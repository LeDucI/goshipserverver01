'use strict';

const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.loginUser = (email, password) => 
	new Promise((resolve, reject) => {

		user.find({mEmail: email})
			.then(users => {
				if(users.length == 0){
					reject({status: 404, message: 'User Not Found!'});
				} else {
					return users[0];
				}
			})
			.then(user => {
				const hashed_password = user.mHashed_password;
				if(bcrypt.compareSync(password, hashed_password)){
					resolve({status: 200, message: email});
				} else{
					reject({status: 401, message: 'Invalid Credentials!'});
				}
			})
			.catch(err => reject({status: 500, message: 'Invalid Server Error!'}));
	})
		