const conn = require('./../inc/db');
const login = require('./../inc/login');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const reservations = require('./../inc/reservation');
const moment = require('moment');

moment.locale("pt-BR");

var express = require('express');
var router = express.Router();

router.use(function(req, res, next){

	(['/login'].indexOf(req.url) === -1 && !req.session.user) ? res.redirect('/admin/login') : next();

});

router.use(function(req, res, next){
	req.menus = admin.getMenus(req);
	next();
});

router.get('/logout', function(req, res, next){

	delete req.session.user;
	res.redirect('/admin/login');
});

router.get('/', function(req, res, next) {

	admin.dashboard().then(datas=>{
		res.render('admin/index', admin.getParams(req, {
			datas
		}));
	}).catch(err=>{
		console.log(err);
	});
});

router.get('/contacts', function(req, res, next) {
	res.render('admin/contacts', admin.getParams(req));
});

router.get('/login', function(req, res, next) {
	login.render(req, res);
});

router.post('/login', function(req, res, next) {

	if(!req.body.email){
		login.render(req, res, "Digite o email.");
	}else if(!req.body.password){
		login.render(req, res, "Digite a senha.");
	}else{
		login.userLogin(req.body).then(user=>{
			req.session.user = user;
			res.redirect("/admin");
		}).catch(err=>{
			req.body = {};
			login.render(req, res, err);
		});
	}
});

router.get('/menus', function(req, res, next) {

	menus.getMenus().then(datas=>{

		res.render('admin/menus', admin.getParams(req, {
			datas
		}));

	}).catch(err=>{
		console.log(err);
	});
});

router.post('/menus', function(req, res, next){

	menus.save(req.fields, req.files).then(results=>{
		res.send(results);
	}).catch(err=>{
		res.send(err);
	});
});

router.delete('/menus/:id', function(req, res, next){

	menus.delete(req.params.id).then(results=>{
		res.send(results);
	}).catch(err=>{
		res.send(err);
	})

});

router.get('/reservations', function(req, res, next) {

	reservations.getReservations().then(datas=>{
		res.render('admin/reservations', admin.getParams(req, {
			datas,
			date: {},
			moment
		}));
	}).catch(err=>{
		res.send(err);
	});
	
});

router.post('/reservations', function(req, res, next){

	reservations.save(req.fields, req.files).then(results=>{
		res.send(results);
	}).catch(err=>{
		res.send(err);
	});
});

router.delete('/reservations/:id', function(req, res, next){

	reservations.delete(req.params.id).then(results=>{
		res.send(results);
	}).catch(err=>{
		res.send(err);
	})

});

router.get('/users', function(req, res, next) {
	res.render('admin/users', admin.getParams(req));
});

router.get('/emails', function(req, res, next) {
	res.render('admin/emails', admin.getParams(req));
});

module.exports = router;
