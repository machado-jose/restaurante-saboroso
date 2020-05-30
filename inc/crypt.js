var CryptoJS = require("crypto-js");

module.exports = {

	cryptPassword(password){
		var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
		return hash;
	}
}