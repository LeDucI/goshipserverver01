'use strict';

var mongoose = require('mongoose');
var User = require('../app/models/user');

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const register = require('../app/functions/register');
const login = require('../app/functions/login');
const profile = require('../app/functions/profile');
const password = require('../app/functions/password');
const config = require('../config/config.json');

var USERS_COLLECTION = "users";

//Generic error handler used by all endpoints
function handleError(res, reason, message, code){
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}

//Open App Routes
module.exports = router => {

	router.get('/', function(req, res){
		res.end("Goship Node ver01")
	});

    router.post('/authenticate', (req, res) => {
 
        const credentials = auth(req);
        //var credentials = {name: "binboss000@gmail.com", pass: "leduci010595"};

		if(!credentials) {
			console.log(credentials);
			res.status(400).json({message: 'Invalid Request!'});
		} else {
			login.loginUser(credentials.name, credentials.pass)
				 .then(result => {
				 	const token = jwt.sign(result, config.secret, {expiresIn: 1440});
				 	res.status(result.status).json({message: result.message, token: token});
				 })
				 .catch(err => res.status(err.status).json({message: err.message}));
		}
	});

	router.post('/users', (req,res) => {

		const phoneNumber = req.body.mPhone;
		const email = req.body.mEmail;
		const password = req.body.mPassword;

		if(!phoneNumber || !email || !password || !phoneNumber.trim() || !email.trim() || !password.trim()){
			res.status(400).json({message: 'Invalid Request !'});
		} else {
			register.registerUser(phoneNumber, email, password)
					.then(result => {
						res.setHeader('Location', '/users/' + email);
						res.status(result.status).json({message: result.message});
					})
					.catch(err => {

						console.log("Promise Rejected in Register File");
						res.status(err.status).json({message: err.message})

					}
					);
		}
	});

	router.get('/users/:id', (req,res) => {
		if(checkToken(req)){
			profile.getProfile(req.params.id)
					.then(result => res.json(result))
					.catch(err => res.status(err.status).json({message: err.message}));			
		} else {
			res.status(401).json({message: 'Invalid Token!'})
		}
	});

	router.put('/users/:id', (req,res) => {
		if(checkToken(res)){
			const oldPassword = req.body.mPassword;
			const newPassword = req.body.mNewPassword;

			if(!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()){
				res.status(400).json({message: 'Invalid Request!'});
			} else {
				password.changePassword(req.params.id, oldPassword, newPassword)
						.then(result => res.status(result.status).json({message: result.message}))
						.catch(err => res.status(err.status).json({message: err.message}));
			}
		} else {
			res.status(401).json({ message: 'Invalid Token !' });
		}
	});
	
	router.post('users/:id/password', (req, res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if(!token || !newPassword || !token.trim() || !newPassword.trim()){
			password.resetPasswordInit(email)
					.then(result => res.status(result.status).json({message: result.message}))
					.catch(err => res.status(err.status).json({message: err.message}));
		} else {
			password.resetPasswordFinish(email, token, newPassword)
					.then(result => res.status(result.status).json({message: result.message}))
					.catch(err => res.status(err.status).json({message: err.message}));
		}
	});

    function checkToken(req) {
 
        const token = req.headers['x-access-token']; 

        if (token) {
            try {
                  var decoded = jwt.verify(token, config.secret);
                  return decoded.message === req.params.id;
            } catch(err) {
                return false;
            }
        } else {
            return false;
        }
    }
}