const conn = require('./db');
const crypt = require('./crypt');

module.exports = {

	userLogin(fields){

		return new Promise((s, f)=>{

			let password = crypt.cryptPassword(fields.password);

			conn.query(`
				SELECT * FROM tb_users WHERE email = ? and password = ?
			`, [
				fields.email,
				password
			], function(err, results){

				if(err) f(err.message);

				if(results.length == 0) f("E-mail e/ou senha incorretos.");

				s(results[0]);
			
			});

		});
	},
	
	render(req, res, error = null){
		res.render('admin/login', {
			body: req.body,
			error
		});
	}
}