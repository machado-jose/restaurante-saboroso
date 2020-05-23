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

router.get('/contacts', function(req, res, next){
	res.render('contacts', {
		title: 'Contato - Restaurante Saboroso'
	});
});

router.get('/menus', function(req, res, next){
	res.render('menus', {
		title: 'Menu - Restaurante Saboroso'
	});
});

router.get('/reservations', function(req, res, next){
	res.render('reservations', {
		title: 'Reserva - Restaurante Saboroso'
	});
});

router.get('/services', function(req, res, next){
	res.render('services', {
		title: 'Serviço - Restaurante Saboroso'
	});
});

module.exports = router;
