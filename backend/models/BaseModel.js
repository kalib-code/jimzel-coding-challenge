const db = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll() {
    return await db.query(`SELECT * FROM ${this.tableName}`);
  }

  async findById(id) {
    return await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    return await db.query(query, values);
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    values.push(id);
    
    return await db.query(query, values);
  }

  async delete(id) {
    return await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async findByCondition(condition, params = []) {
    return await db.query(`SELECT * FROM ${this.tableName} WHERE ${condition}`, params);
  }

  async query(sql, params = []) {
    return await db.query(sql, params);
  }
}

module.exports = BaseModel;