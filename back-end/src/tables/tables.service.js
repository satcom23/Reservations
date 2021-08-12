const { table } = require("../db/connection");
const knex = require("../db/connection");

const tableName = "tables";
function list() {
  return knex(tableName).select("*").orderBy("table_name", "asc");
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((createdTable) => createdTable[0]);
}
function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((records) => records[0]);
}

function destroy(table_id) {
  return knex(tableName).where({ table_id }).update("reservation_id", null);
}

module.exports = {
  create,
  list,
  read,
  update,
  destroy,
};
