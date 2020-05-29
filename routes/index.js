const conn = require('./../inc/db');
const menu = require('./../inc/menus');
const reservation = require('./../inc/reservation');
const contact = require('./../inc/contact');

var express = require('express');
var router = express.Router();

module.exports = function(io){

	/* GET home page. */
	router.get('/', function(req, res, next) {

		menu.getMenus().then(results=>{
			res.render('index', { 
				title: 'Restaurante Saboroso!',
				menus: results,
				background: 'images/img_bg_1.jpg',
				isHome: true
			});
		}).catch(err=>{
			console.log(err);
		});

	});

	router.get('/contacts', function(req, res, next){
		contact.render(req, res);
	});

	router.post('/contacts', function(req, res, next){
		if(!req.body.name){
			contact.render(req, res, 'Digite o nome');
		}else if(!req.body.email){
			contact.render(req, res, 'Digite o email');
		}else if(!req.body.message){
			contact.render(req, res, 'Digite a mensagem');
		}else{
			contact.save(req.body).then(results=>{
				req.body = {};
				contact.render(req, res, null, "Contato enviado com sucesso!");
				io.emit('dashboard event');
			}).catch(err=>{
				contact.render(req, res, err.message);
			});
		}
	});

	router.get('/menus', function(req, res, next){

		menu.getMenus().then(results=>{
			res.render('menus', {
				title: 'Menu - Restaurante Saboroso',
				menus: results,
				background: 'images/img_bg_1.jpg',
				h1: 'Saboreie nosso menu!'
			});
		}).catch(err=>{
			console.log(err);
		});
		
	});

	router.get('/reservations', function(req, res, next){
		res.render('reservations', {
			title: 'Reserva - Restaurante Saboroso',
			background: 'images/img_bg_2.jpg',
			h1: 'Reserve uma Mesa!',
			body: {}
		});
	});

	router.post('/reservations', function(req, res, next){
		if(!req.body.name){
			reservation.render(req, res, 'Digite o nome');
		}else if(!req.body.email){
			reservation.render(req, res, 'Digite o email');
		}else if(!req.body.people){
			reservation.render(req, res, 'Digite a quantidade de pessoas');
		}else if(!req.body.date){
			reservation.render(req, res, 'Digite a data da reserva');
		}else if(!req.body.time){
			reservation.render(req, res, 'Digite o horário da reserva');
		}else{
			reservation.save(req.body).then(results=>{
				req.body = {};
				reservation.render(req, res, null, "Reserva confirmada!");
				io.emit('dashboard event');
			}).catch(err=>{
				reservation.render(req, res, err.message);
			});
		}
	});

	router.get('/services', function(req, res, next){
		res.render('services', {
			title: 'Serviço - Restaurante Saboroso',
			background: 'images/img_bg_1.jpg',
			h1: 'É um prazer poder servir!'
		});
	});

	return router;
}
