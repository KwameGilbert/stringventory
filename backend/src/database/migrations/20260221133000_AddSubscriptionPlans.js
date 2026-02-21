/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // 1. Create subscription_plans table
  await knex.schema.createTable('subscription_plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 50).notNullable();
    table.string('slug', 50).unique().notNullable(); // professional, free, etc.
    table.decimal('price', 10, 2).defaultTo(0);
    table.jsonb('features').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // 2. Add subscription fields to businesses
  await knex.schema.table('businesses', (table) => {
    table
      .uuid('subscriptionPlanId')
      .references('id')
      .inTable('subscription_plans')
      .onDelete('SET NULL');
    table.string('subscriptionStatus', 20).defaultTo('active');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('businesses', (table) => {
    table.dropColumn('subscriptionPlanId');
    table.dropColumn('subscriptionStatus');
  });
  await knex.schema.dropTable('subscription_plans');
};
