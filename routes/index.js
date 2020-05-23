const conn = require('./../inc/db');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	conn.query(
		'SELECT * FROM tb_menus ORDER BY title',
		function(err, results, fields){
			if(err){
				console.log(err);
			}else{
				res.render('index', { 
					title: 'Restaurante Saboroso!',
					menus: results 
				});
			}
		}
	);
});

module.exports = router;
