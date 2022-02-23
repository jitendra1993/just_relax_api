import  mongoose from 'mongoose';
//import {model} from 'mongoose';
mongoose.pluralize(null);
const userAddressSchema = new mongoose.Schema({
    hash: {type: String, required: true},
    user_hash_id: {type: String, required: true},
    name: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    pincode: {type: String, required: true},
    addressLine1: {type: String, required: true},
    addressLine2: {type: String, required: true},
    addressType: {type: Number, required: true},
    status: {type: Number, required: true,default: 0},
    location : {type: { type: String },coordinates: []},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
});
userAddressSchema.index({
    location: '2dsphere'
});
export default mongoose.model('master_user_address', userAddressSchema);
