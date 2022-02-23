import  mongoose from 'mongoose';
//import {model} from 'mongoose';
mongoose.pluralize(null);
const userSchema = new mongoose.Schema({
    hash: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    mobile: {type: String, required: true},
    role_master_tbl_id: {type: Number, required: true},
    loyalty_point: {type: Number, required: true,default:0},
    status: {type: Number, required: true,default: 1},
	mail_status: {type: Number, required: true,default: 0},
	mobile_status: {type: Number, required: true,default: 0},
    location : {type: { type: String },coordinates: []},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    verification_token: {type: Number, required: true},
    verification_token_time: {type: Number, required: true},

});
userSchema.index({
    location: '2dsphere'
});

export default mongoose.model('user_master', userSchema);