/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('subscription_plans').del();

  // Inserts seed entries
  await knex('subscription_plans').insert([
    {
      id: '5f4dcc3b-5aa7-4efc-a502-4fc93d6593d1', // Static UUIDs for deterministic seeding
      name: 'Free',
      slug: 'free',
      price: 0,
      features: JSON.stringify(['Limited stock tracking', 'Single user', 'Basic reports']),
    },
    {
      id: '5f4dcc3b-5aa7-4efc-a502-4fc93d6593d2',
      name: 'Professional',
      slug: 'professional',
      price: 29.99,
      features: JSON.stringify(['Advanced analytics', 'Unlimited users', 'Multi-location support']),
    },
    {
      id: '5f4dcc3b-5aa7-4efc-a502-4fc93d6593d3',
      name: 'Enterprise',
      slug: 'enterprise',
      price: 99.99,
      features: JSON.stringify(['Dedicated support', 'Custom integrations', 'API access']),
    },
  ]);
};
