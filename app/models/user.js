var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = mongoose.Schema.Types.ObjectId;

//Set up a mongoose model
var UserSchema = new Schema({
	mPhoneNumber: {type: String, required: true},
	mEmail : {type: String, required: true},
	mHashed_password: {type: String},
	mCreated_at: {type: Date, default: Date.now},
	mUpdated_at: {type: Date, default: Date.now},
	mTemp_password    : {type: String},
    mTemp_password_time: {type: String}
});

//Sets the mCreated_at parameter equals to the current time
UserSchema.pre('save', function(next){
	now = new Date();
	this.mUpdated_at = now;
	if(!this.mCreated_at){
		this.nCreated_at = now;
	}
	next();
});

//Exports the UserSchema for using elsewhere. Sets the MongoDB collection to be used as "goship-users"
module.exports = mongoose.model('User', UserSchema);
