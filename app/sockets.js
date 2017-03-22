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
var socketio = require('socket.io')



var socketio = require('socket.io');

module.exports.listen = server => {
    var io = socketio.listen(server);

    // require('socketio-auth')(io, {
    // 	authenticate: authenticate,
    // 	postAuthenticate: postAuthenticate,
    // 	disconnect: disconnect,
    // 	timeout: 1000
    // });

    // function authenticate(socket, data, callback){
    // 	console.log('authenticate function running');

    // 	//get credentials sent by the client
    // 	var phoneNumber = data.phonenumber;
    // 	var password = data.password;
    // 	login.loginUser(phonenumber, email, password)
    //   		.then(result => {
    // 			const token = jwt.sign(result, config.secret, {expiresIn: 1440});
    // 			socket.emit('authenticate status', {status: result.status, message: result.message, token: token});
    // 		})
    // 		.catch(err => socket.emit('authenticate status', {status: err.status, message: err.message}));
    // }

    // function postAuthenticate(socket, data) {
    // 	console.log('postAuthenticate function running');
    //   	var phonenumber = data.phonenumber;

    //   	profile.getProfile(phonenumber)
    // 					.then(result => {socket.client.user = result;})
    // 					.catch(err => socket.emit('get profile user status', {status: err.status, message: err.message}));	
    // }

    // function disconnect(socket) {
    // 	console.log('disconnect function running');
    //   console.log(socket.id + ' disconnected');
    // }

    io.on('connection', function(socket) {
        console.log('user ' + socket.id + ' login');
        socket.auth = false;

        // socket.on('authenticate', function(data) {
        //     //check the auth data sent by the client
        //     if (checkToken(data.token, data.phonenumber)) {
        //         console.log("Authenticated socket ", socket.id);
        //         socket.auth = true;
        //     }
        // });

        // setTimeout(function() {
        //     //If the socket didn't authenticate, disconnect it
        //     if (!socket.auth) {
        //         console.log("Disconnecting socket ", socket.id);
        //         socket.disconnect('unauthorized');
        //     }
        // }, 1000);

        socket.on('user register', function(data) {
            console.log('user register function running');
            var phoneNumber = data.phonenumber;
            var email = data.email;
            var password = data.password;

            if (!phoneNumber || !email || !password || !phoneNumber.trim() || !email.trim() || !password.trim()) {
                socket.emit('register status', { status: 400, message: 'Invalid Request !' });
            } else {
                register.registerUser(phoneNumber, email, password, socket)
                    .then(result => {
                        socket.emit('register status', { status: result.status, message: result.message });
                    })
                    .catch(err => {
                        //console.log("Promise Rejected in Register File");
                        socket.emit('register status', { status: err.status, message: err.message });
                    });
            }

        });

        socket.on('disconnect', function() {
            console.log('user ' + socket.id + ' disconnect');
        });

        socket.on('user signin', function(data) {});

        socket.on('user login', function(data) {

        });

        socket.on('get profile user', function(data) {
            if (checkToken(data.token)) {
                profile.getProfile(data.phonenumber)
                    .then(result => socket.emit('get profile user status', { status: 200, message: result }))
                    .catch(err => socket.emit('get profile user status', { status: err.status, message: err.message }));
            } else {
                socket.emit('get profile user status', { status: 401, message: 'Invalid Token!' });
            }
        });

    });

    function checkToken(phoneNumber, token) {

        if (token) {
            try {
                var decoded = jwt.verify(token, config.secret);
                return decoded.message === phoneNumber;
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }
}
