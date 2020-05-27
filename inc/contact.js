const conn = require('./db');

module.exports = {

	render(req, res, error = null, success = null){
		res.render('contacts', {
			title: 'Contato - Restaurante Saboroso',
			background: 'images/img_bg_3.jpg',
			h1: 'Diga um oi!',
			body: req.body,
			error,
			success
		});
	},

	save(fields){

		return new Promise((s, f)=>{

			conn.query(`
				INSERT INTO tb_contacts (name, email, message) 
				VALUES (?, ?, ?)
			`, [
				fields.name,
				fields.email,
				fields.message
			], (err, results)=>{
				(err) ? f(err) : s(results);
			});
		});
	},

	getContacts(){

		return new Promise((s, f)=>{

			conn.query(`
				SELECT * FROM tb_contacts ORDER BY register DESC
			`, (err, results)=>{
				err ? f(err) : s(results);
			});

		});
	},

	delete(id){

		return new Promise((s, f)=>{

			conn.query(`
				DELETE FROM tb_contacts WHERE id = ?
			`, [
				id
			], (err, results)=>{
				err ? f(err) : s(results);
			});

		});
		
	}
}