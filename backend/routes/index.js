var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');

/* GET home page. */
router.get('/', function(req, res, next) {
  mysqlpool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.render('index', {
        title: 'Express',
        data: JSON.stringify({ error: 'Database connection error', message: err.message }, null, 4)
      });
    }

    connection.query('SELECT * FROM mysql_table', function (error, results, fields) {
      connection.release();

      if (error) {
        console.error('Error querying database:', error);
        return res.render('index', {
          title: 'Express',
          data: JSON.stringify({ error: 'Query error', message: error.message }, null, 4)
        });
      }

      res.render('index', { title: 'Express', data: JSON.stringify(results, null, 4) });
    });
  });
});

/* API endpoint for health check */
router.get('/api/health', function(req, res) {
  res.json({ status: 'ok', message: 'Server is running' });
});

/* API endpoint to get all posts */
router.get('/api/posts', function(req, res) {
  mysqlpool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error', message: err.message });
    }

    connection.query('SELECT * FROM posts', function (error, results, fields) {
      connection.release();

      if (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ error: 'Query error', message: error.message });
      }

      res.json(results);
    });
  });
});

/* API endpoint to get all categories */
router.get('/api/categories', function(req, res) {
  mysqlpool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error', message: err.message });
    }

    connection.query('SELECT * FROM categories', function (error, results, fields) {
      connection.release();

      if (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ error: 'Query error', message: error.message });
      }

      res.json(results);
    });
  });
});

module.exports = router;
