exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table
        .string('email')
        .unique()
        .notNullable();
      table.string('password').notNullable();
      table
        .string('phone_number')
        .unique()
        .notNullable();
    }),
  ]);
exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);
