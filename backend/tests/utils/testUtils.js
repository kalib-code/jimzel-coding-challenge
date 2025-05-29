/**
 * Utility functions for testing
 */

/**
 * Creates a mock service for testing
 * @param {Object} mockData - The mock data to use
 * @param {Function} onFind - Custom function for handling find operations
 * @param {Function} onCreate - Custom function for handling create operations
 * @param {Function} onUpdate - Custom function for handling update operations
 * @param {Function} onDelete - Custom function for handling delete operations
 * @returns {Object} - The mock service
 */
const createMockService = (mockData, { onFind, onCreate, onUpdate, onDelete } = {}) => {
  const data = [...mockData];
  
  return {
    findAll: jest.fn(async (filters = {}) => {
      if (onFind) {
        return onFind(data, filters);
      }
      return data;
    }),
    
    findById: jest.fn(async (id) => {
      const item = data.find(item => item.id === parseInt(id));
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    }),
    
    create: jest.fn(async (newData) => {
      if (onCreate) {
        return onCreate(data, newData);
      }
      
      const newId = Math.max(...data.map(item => item.id), 0) + 1;
      const newItem = { id: newId, ...newData };
      data.push(newItem);
      return newItem;
    }),
    
    update: jest.fn(async (id, updateData) => {
      const index = data.findIndex(item => item.id === parseInt(id));
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      if (onUpdate) {
        return onUpdate(data, id, updateData);
      }
      
      const updatedItem = { ...data[index], ...updateData };
      data[index] = updatedItem;
      return updatedItem;
    }),
    
    delete: jest.fn(async (id) => {
      const index = data.findIndex(item => item.id === parseInt(id));
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      if (onDelete) {
        return onDelete(data, id);
      }
      
      data.splice(index, 1);
      return true;
    }),
    
    // Helper to reset the data
    _resetData: () => {
      data.length = 0;
      data.push(...mockData);
    }
  };
};

module.exports = {
  createMockService
};