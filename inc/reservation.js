const conn = require('./db');
const Pagination = require('./pagination');
const moment = require('moment');

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

	getReservations(req){

		return new Promise((s, f)=>{

			let page = req.query.page;
			let dtstart = req.query.start;
			let dtend = req.query.end;

			if(!page) page = 1;

			let params = [];

			if(dtstart && dtend) params.push(dtstart, dtend);

			let pagination = new Pagination(
				`
					SELECT SQL_CALC_FOUND_ROWS * 
					FROM tb_reservations 
					${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
					ORDER BY name DESC LIMIT ?, ?
				`,
				params
			);

			pagination.getPage(page).then(data=>{

				s({
					data,
					links: pagination.getNavigation(req.query)
				});

			});

		});
	
	},

	chart(req){

		return new Promise((s, f)=>{

			conn.query(`
				SELECT
					CONCAT(YEAR(date),'-',MONTH(date)) AS dateInterval,
					COUNT(*) AS total,
					SUM(people) / COUNT(*) AS avg_people
				FROM tb_reservations
				WHERE date BETWEEN ? AND ?
				GROUP BY dateInterval DESC
				ORDER BY SUBSTRING(dateInterval, 1, 4),
						 SUBSTRING(dateInterval, 6, 7)
			`, [
				req.query.start,
				req.query.end
			], (err, results)=>{

				if(err){
					f(err);
				}else{

					let months = [];
					let values = [];

					results.forEach(row=>{

						months.push(moment(row.dateInterval).format('MMM-YYYY'));
						values.push(row.total);

					});

					s({
						months,
						values
					});
				}

			});

		});	
	}
}