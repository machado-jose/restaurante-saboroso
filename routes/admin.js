const conn = require('./../inc/db');
const login = require('./../inc/login');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const users = require('./../inc/users');
const contact = require('./../inc/contact');
const emails = require('./../inc/emails');
const reservations = require('./../inc/reservation');
const moment = require('moment');
const formidable = require('formidable');
const fs = require('fs');

module.exports = function(io){

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

	router.get('/dashboard', function(req, res, next){

		admin.dashboard().then(data=>{
			res.send(data);
		}).catch(err=>{
			console.log(err);
		});

	});

	router.get('/contacts', function(req, res, next) {

		contact.getContacts().then(data=>{
			res.render('admin/contacts', admin.getParams(req, {
				data
			}));
		});
		
	});

	router.delete('/contacts/:id', function(req, res, next){

		contact.delete(req.params.id).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		})

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
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		});
	});

	router.delete('/menus/:id', function(req, res, next){

		conn.query(`
			SELECT photo FROM tb_menus WHERE id = ?
		`, [
			req.params.id
		], (err, results)=>{
			if(err){
				res.send(err);
			}else{
				
				let file = './public/' + results[0].photo;
				
				if(fs.existsSync(file)){
					fs.unlinkSync(file);
				}
			}
		});

		menus.delete(req.params.id).then(results=>{		
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		})

	});

	router.get('/reservations/chart', function(req, res, next){


		req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
		req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

		reservations.chart(req).then(chartData=>{

			res.send(chartData);
			
		});

	});

	router.get('/reservations', function(req, res, next) {

		let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
		let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

		reservations.getReservations(req).then(pag=>{
			res.render('admin/reservations', admin.getParams(req, {
				datas: pag.data,
				date: {
					start,
					end
				},
				moment,
				links: pag.links
			}));
		}).catch(err=>{
			res.send(err);
		});
		
	});

	router.post('/reservations', function(req, res, next){

		reservations.save(req.fields, req.files).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		});
	});

	router.delete('/reservations/:id', function(req, res, next){

		reservations.delete(req.params.id).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		})

	});

	router.get('/users', function(req, res, next) {

		users.getUsers().then(data=>{
			res.render('admin/users', admin.getParams(req, {
				data
			}));
		});
	});

	router.post('/users', function(req, res, next){

		users.save(req.fields).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		});
	});

	router.post('/users/password-change', function(req, res, next){

		users.changePassword(req).then(results=>{
			res.send(results);
		}).catch(err=>{
			res.send({
				error: err
			});
		});
	});

	router.delete('/users/:id', function(req, res, next){

		users.delete(req.params.id).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		})

	});

	router.get('/emails', function(req, res, next) {

		emails.getEmails().then(data=>{
			res.render('admin/emails', admin.getParams(req, {
				data
			}));
		});
		
	});

	router.post('/emails', (req, res, next)=>{

		emails.save(req.fields).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		});
	});

	router.delete('/emails/:id', (req, res, next)=>{

		emails.delete(req.params.id).then(results=>{
			res.send(results);
			io.emit('dashboard event');
		}).catch(err=>{
			res.send(err);
		})
	});

	return router;
}
