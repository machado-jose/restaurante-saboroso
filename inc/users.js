const conn = require('./db');
const crypt = require('./crypt');

module.exports = {

	save(fields){

		return new Promise((s, f)=>{

			let query, params = [
				fields.name,
				fields.email
			];

			if(parseInt(fields.id) > 0){

				query = `
					UPDATE tb_users
					SET name = ?,
						email = ?
					WHERE id = ?
				`;

				params.push(fields.id);

			}else{

				let password = crypt.cryptPassword(fields.password);

				query = `INSERT INTO tb_users (name, email, password) 
					VALUES (?, ?, ?)
				`;

				params.push(password);
				
			}

			conn.query(query, params, (err, results)=>{
				(err) ? f(err) : s(results);
			});

		});
	},

	delete(id){

		return new Promise((s, f)=>{

			conn.query(`
				DELETE FROM tb_users WHERE id = ?
			`, [
				id
			], (err, results)=>{
				err ? f(err) : s(results);
			});

		});
		
	},

	getUsers(){

		return new Promise((s, f)=>{

			conn.query(`
				SELECT * FROM tb_users ORDER BY name
			`, (err, results)=>{
				err ? f(err) : s(results);
			});

		});
	},

	changePassword(req){

		return new Promise((s, f)=>{

			if(!req.fields.password){
				f("Preencha a senha");
			}else if(req.fields.password !== req.fields.passwordConfirm){
				f("Confirme a senha corretamente.");
			}else{

				let password = crypt.cryptPassword(req.fields.password);

				conn.query(`
					UPDATE tb_users
					SET password = ?
					WHERE id = ?
				`, [
					password,
					req.fields.id
				], (err, results)=>{
					err ? f(err.message) : s(results);
				});
			}
		});
	}
}