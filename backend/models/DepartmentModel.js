const BaseModel = require('./BaseModel');

class DepartmentModel extends BaseModel {
  constructor() {
    super('departments');
  }
}

module.exports = new DepartmentModel();