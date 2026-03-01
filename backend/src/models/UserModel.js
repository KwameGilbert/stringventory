import { BaseModel } from './BaseModel.js';
import { passwordHasher } from '../utils/passwordHasher.js';
import { db } from '../config/database.js';
import { parsePagination, parseSort } from '../utils/helpers.js';

/**
 * User Model
 */
class UserModelClass extends BaseModel {
  constructor() {
    super('users', {
      timestamps: true,
      softDeletes: true,
      searchableFields: ['email', 'firstName', 'lastName'],
      sortableFields: ['createdAt', 'updatedAt', 'email', 'firstName', 'lastName'],
      hidden: ['passwordHash'],
    });
  }

  /**
   * Find all users with role joins
   */
  async findAll(options = {}) {
    const { page, limit, offset } = parsePagination(options);
    const { field: sortField, order: sortOrder } = parseSort(options, this.sortableFields);

    let query = options.trx ? this.query(options.trx) : this.query();

    // Join roles to get role name
    query = query
      .leftJoin('roles as r', `${this.tableName}.roleId`, 'r.id')
      .select(`${this.tableName}.*`, 'r.name as role');

    // Apply search if provided
    if (options.search && this.searchableFields.length > 0) {
      query = query.where((builder) => {
        this.searchableFields.forEach((field, index) => {
          const qualifiedField = field.includes('.') ? field : `${this.tableName}.${field}`;
          if (index === 0) {
            builder.whereILike(qualifiedField, `%${options.search}%`);
          } else {
            builder.orWhereILike(qualifiedField, `%${options.search}%`);
          }
        });
      });
    }

    // Apply additional filters
    if (options.filters) {
      // Qualify filters to users table to avoid ambiguity
      const qualifiedFilters = {};
      for (const [key, value] of Object.entries(options.filters)) {
        if (value === undefined || value === null) continue;
        const qualifiedKey = key.includes('.') ? key : `${this.tableName}.${key}`;
        qualifiedFilters[qualifiedKey] = value;
      }
      query = this.applyFilters(query, qualifiedFilters);
    }

    // Get total count
    const countQuery = query.clone().clearSelect().count(`${this.tableName}.id as count`);
    const countResult = await countQuery;
    const count = countResult[0]?.count || 0;
    const total = parseInt(count);

    // Apply sorting and pagination
    const data = await query
      .orderBy(sortField.includes('.') ? sortField : `${this.tableName}.${sortField}`, sortOrder)
      .limit(limit)
      .offset(offset);

    return {
      data: data.map((record) => this.hideFields(record)),
      pagination: { page, limit, total },
    };
  }

  /**
   * Find user by ID including role name
   */
  async findById(id, trx = null) {
    const q = trx ? trx : db;
    const record = await q(`${this.tableName} as u`)
      .leftJoin('roles as r', `u.roleId`, 'r.id')
      .where('u.id', id)
      .whereNull('u.deletedAt')
      .select('u.*', 'r.name as role')
      .first();

    return record ? this.hideFields(record) : null;
  }

  /**
   * Create user with hashed password
   */
  async create(data, trx = null) {
    const userData = { ...data };

    if (userData.password) {
      userData.passwordHash = await this.hashPassword(userData.password);
      delete userData.password;
    }

    const created = await super.create(userData, trx);
    return this.findById(created.id, trx);
  }

  /**
   * Update user with optional password hashing
   */
  async update(id, data, trx = null) {
    const userData = { ...data };

    if (userData.password) {
      userData.passwordHash = await this.hashPassword(userData.password);
      delete userData.password;
    }

    await super.update(id, userData, trx);
    return this.findById(id, trx);
  }

  /**
   * Find user by email
   */
  async findByEmail(email, trx = null) {
    return this.findBy('email', email.toLowerCase(), trx);
  }

  /**
   * Find user by email including password hash
   */
  async findByEmailWithPassword(email, trx = null) {
    const record = await this.query(trx).where('email', email.toLowerCase()).first();
    return record;
  }

  /**
   * Find user with business and subscription details
   */
  async findUserWithDetails(userId, trx = null) {
    const q = trx ? trx : db;

    const user = await q(`${this.tableName} as u`)
      .leftJoin('businesses as b', 'u.businessId', 'b.id')
      .leftJoin('subscription_plans as sp', 'b.subscriptionPlanId', 'sp.id')
      .leftJoin('roles as r', 'u.roleId', 'r.id')
      .select('u.*', 'sp.slug as subscriptionPlan', 'b.subscriptionStatus', 'r.name as role')
      .where('u.id', userId)
      .first();

    if (!user) return null;

    // Remove hidden fields manually since we used a raw query join
    this.hidden.forEach((field) => delete user[field]);

    // Clean up internal database names if necessary, though they match here
    return user;
  }

  /**
   * Hash a password using configured algorithm
   */
  async hashPassword(password) {
    return passwordHasher.hash(password);
  }

  /**
   * Compare password with hash using auto-detected algorithm
   */
  async comparePassword(password, hash) {
    return passwordHasher.verify(password, hash);
  }

  /**
   * Verify user password
   */
  async verifyPassword(userId, password, trx = null) {
    const user = await this.query(trx).where(this.primaryKey, userId).first();

    if (!user || !user.passwordHash) {
      return false;
    }

    return this.comparePassword(password, user.passwordHash);
  }
}

export const UserModel = new UserModelClass();
export default UserModel;
