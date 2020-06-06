const conn = require('./db');
const path = require('path');

module.exports = {

	getMenus(){
		return new Promise((s, f)=>{
			conn.query(
				'SELECT * FROM tb_menus ORDER BY title',
				function(err, results, fields){
					(err) ? f(err) : s(results);
				}
			);
		});
	},

	save(fields, files){

		return new Promise((s, f)=>{

			fields.photo = `images/${path.parse(files.photo.path).base}`;

			let query, queryPhoto = '', params = [
				fields.title,
				fields.description,
				fields.price
			];

			if(files.photo.name){
				queryPhoto = ',photo = ?';
				params.push(fields.photo);
			}

			console.log("[queryPhoto]: " + queryPhoto);

			if(parseInt(fields.id) > 0){

				query = `
					UPDATE tb_menus
					SET title = ?,
					description = ?,
					price = ?
					${queryPhoto}
					WHERE id = ?
				`;

				params.push(fields.id);

			}else{

				if(!files.photo.name) f("Insira a foto do produto.");

				query = `
					INSERT INTO tb_menus(title, description, price, photo) VALUES(?, ?, ?, ?)
				`;

			}

			conn.query(query, params, (err, results)=>{

				err ? f(err) : s(results);
			});

		});
		
	},

	delete(id){

		return new Promise((s, f)=>{

			conn.query(`
				DELETE FROM tb_menus WHERE id = ?
			`, [
				id
			], (err, results)=>{
				err ? f(err) : s(results);
			});

		});
		
	}

}