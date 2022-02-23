import  mongoose from 'mongoose';

mongoose.pluralize(null);
const vendorInfoSchema = new mongoose.Schema({
    user_hash_id: {type: String, required: true},
    vendor_name: {type: String, required: true},
    vendor_phone: {type: String, required: false},
    contact_name: {type: String, required: false},
    contact_phone: {type: String, required: true,default:1},
    contact_email: {type: String, required: true,default:1},
    country: {type: String, required: true},
    country_id: {type: Number, required: true},
    state: {type: String, required: true,default:1},
    state_id: {type: Number, required: true,default:1},
    city: {type: String, required: true},
    city_id: {type: Number, required: true},
    address: {type: String, required: true,default:1},
    pincode: {type: String, required: true},
    location : {type: { type: String },coordinates: []},
    about: {type: String, required: true},
    logo: {type: String, required: true,default:1},
    social_media: {type: Object, required: false},
    site_url: {type: String, required: false},
    mail_logo_url: {type: String, required: false},
    vendor_category: {type: Array, required: true},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    
});
vendorInfoSchema.index({
    location: '2dsphere'
});
export default mongoose.model('vendor_info_master', vendorInfoSchema);