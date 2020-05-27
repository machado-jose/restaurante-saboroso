const conn = require('./db');

module.exports = {

	getEmails(){

		return new Promise((s, f)=>{

			conn.query(`
				SELECT * FROM tb_emails ORDER BY register DESC
			`, (err, results)=>{
				err ? f(err) : s(results);
			});

		});

	},

	delete(id){

		return new Promise((s, f)=>{

			conn.query(`
				DELETE FROM tb_emails WHERE id = ?
			`, [
				id
			], (err, results)=>{
				err ? f(err) : s(results);
			});

		});
	},

	save(fields){

		return new Promise((s, f)=>{

			conn.query(`
				INSERT INTO tb_emails (email) 
				VALUES (?)
			`, [
				fields.email
			], (err, results)=>{
				(err) ? f(err) : s(results);
			});
		});
	}
}