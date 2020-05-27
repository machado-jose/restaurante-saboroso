const conn = require('./db');

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
				query = `INSERT INTO tb_users (name, email, password) 
					VALUES (?, ?, ?)
				`;
				params.push(fields.password);
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
	}
}