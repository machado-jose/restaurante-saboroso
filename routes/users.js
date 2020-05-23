const conn = require('./../inc/db');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
	// simple query
	conn.query(
	  'SELECT * FROM tb_users ORDER BY name',
	  function(err, results, fields) {
	    (err) ? res.send(err) : res.send(results);
	  }
	);

});

module.exports = router;
