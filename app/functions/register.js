'use strict';

const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = (phoneNumber, email, password) =>
new Promise((resolve, reject) => {

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		const newUser = new User({
			mPhoneNumber: phoneNumber,
			mEmail: email,
			mHashed_password: hash,
			mCreated_at: new Date()
		});

		newUser.save()
				.then(() => resolve({status: 201, message: 'User Registered Successfully!'}))
				.catch(err => {
					console.log("Promise Rejected in Register File");
					if(err.code == 11000){
						reject({status: 409, message: 'User Already Registered!'});
					} else {
						reject({status: 500, message: 'Internal Server Error!'});
					}
				});

	});
