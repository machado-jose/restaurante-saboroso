const conn = require('./db');

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
	}
}