'use strict';

const User = require('../models/user');

exports.getProfile = email => 
	new Promise((resolve, reject) => {

		User.find({mEmail: email}, { mPhoneNumber: 1, mEmail: 1, mCreated_at: 1, _id: 0 })
			.then(users => resolve(users[0]))
			.catch(err => reject({status: 500, message: 'Invalid Server Error!'}))
	});		
