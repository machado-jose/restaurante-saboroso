const conn = require('./../inc/db');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('admin/index');
});

router.get('/contacts', function(req, res, next) {
	res.render('admin/contacts');
});

router.get('/login', function(req, res, next) {
	res.render('admin/login');
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
