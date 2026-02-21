import { BaseModel } from './BaseModel.js';
import { passwordHasher } from '../utils/passwordHasher.js';
import { db } from '../config/database.js';

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
   * Create user with hashed password
   */
  async create(data, trx = null) {
    const userData = { ...data };

    if (userData.password) {
      userData.passwordHash = await this.hashPassword(userData.password);
      delete userData.password;
    }

    return super.create(userData, trx);
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

    return super.update(id, userData, trx);
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

    const user = await q('users as u')
      .leftJoin('businesses as b', 'u.businessId', 'b.id')
      .leftJoin('subscription_plans as sp', 'b.subscriptionPlanId', 'sp.id')
      .select('u.*', 'sp.slug as subscriptionPlan', 'b.subscriptionStatus')
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

  /**
   * Get all effective permissions for a user
   */
  async getUserPermissions(userId, trx = null) {
    const q = trx ? trx : db;

    // 1. Get user direct permissions
    const directPermissions = await q('permissions as p')
      .join('user_permissions as up', 'p.id', 'up.permissionId')
      .where('up.userId', userId)
      .select('p.key');

    // 2. Get permissions from user's role
    const user = await this.findById(userId, trx);
    let rolePermissions = [];
    if (user && (user.roleId || user.role)) {
      const query = q('permissions as p').join('role_permissions as rp', 'p.id', 'rp.permissionId');

      if (user.roleId) {
        query.where('rp.roleId', user.roleId);
      } else {
        query.join('roles as r', 'r.id', 'rp.roleId').where('r.name', user.role);
      }

      rolePermissions = await query.select('p.key');
    }

    // Combine and unique
    const allKeys = [...directPermissions, ...rolePermissions].map((p) => p.key);
    return [...new Set(allKeys)];
  }

  /**
   * Get detailed effective permissions for a user
   */
  async getUserPermissionsDetailed(userId, trx = null) {
    const q = trx ? trx : db;

    // Fetch all permissions (direct and via role)
    const permissions = await q('permissions as p')
      .leftJoin('user_permissions as up', 'p.id', 'up.permissionId')
      .leftJoin('role_permissions as rp', 'p.id', 'rp.permissionId')
      .leftJoin('users as u', (join) => {
        join.on('u.roleId', '=', 'rp.roleId').orOn('u.role', '=', q.raw('??', ['roles.name']));
      })
      .where('up.userId', userId)
      .orWhere('u.id', userId)
      .select('p.id', 'p.key as name', 'p.description')
      .distinct('p.id');

    return permissions;
  }
}

export const UserModel = new UserModelClass();
export default UserModel;
