const conn = require('./../inc/db');
const login = require('./../inc/login');

var express = require('express');
var router = express.Router();

router.use(function(req, res, next){

	(['/login'].indexOf(req.url) === -1 && !req.session.user) ? res.redirect('/admin/login') : next();

});

router.get('/logout', function(req, res, next){

	delete req.session.user;
	res.redirect('/admin/login');
});

router.get('/', function(req, res, next) {
	res.render('admin/index');
});

router.get('/contacts', function(req, res, next) {
	res.render('admin/contacts');
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
	res.render('admin/menus');
});

router.get('/reservations', function(req, res, next) {
	res.render('admin/reservations', {
		date: {}
	});
});

router.get('/users', function(req, res, next) {
	res.render('admin/users');
});

router.get('/emails', function(req, res, next) {
	res.render('admin/emails');
});

module.exports = router;
