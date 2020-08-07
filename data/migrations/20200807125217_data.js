
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments()
        table.string("first_name",128).notNullable();
        table.string("last_name",128).notNullable();
        table.string("password",128).notNullable();
        table.string("email",128).notNullable().unique()
      })
};
exports.up = function(knex) {
    return knex.schema.createTable('orders', function (table) {
        table.increments()
        table.string("user_id",128).notNullable();
        table.string("product_id",128).notNullable();
        table.string("price",128).notNullable();
        table.string("email",128).notNullable().unique()
          table.string("street",255)
          table.string("city",255)
          table.string("country",255)
          table.boolean("delivered",128)
        table.date("date_ordered")
        table.date("date_arrived")
        
      })
};

exports.down = function(knex) {
  
};