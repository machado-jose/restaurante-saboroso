const conn = require('./db');

module.exports = {

	render(req, res, error = null, success = null){
		res.render('reservations', {
			title: 'Reserva - Restaurante Saboroso',
			background: 'images/img_bg_2.jpg',
			h1: 'Reserve uma Mesa!',
			body: req.body,
			error,
			success
		});
	},

	save(fields){

		return new Promise((s, f)=>{

			if(fields.date.indexOf('/') > -1){
				let date = fields.date.split('/');
				fields.date = `${date[2]}-${date[1]}-${date[0]}`;
			}

			let query, params = [
				fields.name,
				fields.email,
				fields.people,
				fields.date,
				fields.time
			];

			if(parseInt(fields.id) > 0){
				query = `
					UPDATE tb_reservations
					SET name = ?,
						email = ?,
						people = ?,
						date = ?,
						time = ?
					WHERE id = ?
				`;
				params.push(fields.id);
			}else{
				query = `INSERT INTO tb_reservations (name, email, people, date, time) 
					VALUES (?, ?, ?, ?, ?)
				`;
			}

			conn.query(query, params, (err, results)=>{
				(err) ? f(err) : s(results);
			});

		});
	},

	delete(id){

		return new Promise((s, f)=>{

			conn.query(`
				DELETE FROM tb_reservations WHERE id = ?
			`, [
				id
			], (err, results)=>{
				err ? f(err) : s(results);
			});

		});
		
	},

	getReservations(){

		return new Promise((s, f)=>{

			conn.query(`
				SELECT * FROM tb_reservations
			`, (err, results)=>{
				err ? f(err) : s(results);
			});

		});
	}
}