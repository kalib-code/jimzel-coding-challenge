/**
 * Utility functions for handling dates in MySQL compatible format
 */

/**
 * Formats a JavaScript Date or ISO string to MySQL date format (YYYY-MM-DD)
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} MySQL formatted date string
 */
const formatDateForMySQL = (date) => {
  if (!date) return null;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return null;
  }
  
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Formats a JavaScript Date or ISO string to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} MySQL formatted datetime string
 */
const formatDateTimeForMySQL = (date) => {
  if (!date) return null;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return null;
  }
  
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  const isoDate = dateObj.toISOString();
  return isoDate.replace('T', ' ').substring(0, 19);
};

/**
 * Processes an object containing date fields and formats them for MySQL
 * @param {Object} data - Object containing date fields
 * @param {Array<string>} dateFields - Array of field names that should be treated as dates
 * @param {Array<string>} dateTimeFields - Array of field names that should be treated as datetimes
 * @returns {Object} Object with formatted date fields
 */
const formatObjectDatesForMySQL = (data, dateFields = [], dateTimeFields = []) => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const formattedData = { ...data };
  
  dateFields.forEach(field => {
    if (formattedData[field]) {
      formattedData[field] = formatDateForMySQL(formattedData[field]);
    }
  });
  
  dateTimeFields.forEach(field => {
    if (formattedData[field]) {
      formattedData[field] = formatDateTimeForMySQL(formattedData[field]);
    }
  });
  
  return formattedData;
};

module.exports = {
  formatDateForMySQL,
  formatDateTimeForMySQL,
  formatObjectDatesForMySQL
};