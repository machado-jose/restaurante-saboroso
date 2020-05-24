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

			let date = fields.date.split('/');
			fields.date = `${date[2]}-${date[1]}-${date[0]}}`

			conn.query(`
				INSERT INTO tb_reservations (name, email, people, date, time) 
				VALUES (?, ?, ?, ?, ?)
			`, [
				fields.name,
				fields.email,
				fields.people,
				fields.date,
				fields.time
			], (err, results)=>{
				(err) ? f(err) : s(results);
			});
		});
	}
}