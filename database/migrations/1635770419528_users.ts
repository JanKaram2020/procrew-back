import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('email', 255).notNullable().unique();
      table.string('name', 255).nullable().unique();
      table.string('password', 180).notNullable();
      table.string('forget_password_token').nullable();
      table.timestamp('forget_password_token_create_at').nullable();
      table.string('remember_me_token').nullable();
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
