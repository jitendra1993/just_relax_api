import  mongoose from 'mongoose';

mongoose.pluralize(null);
const vendorSettingSchema = new mongoose.Schema({
    user_hash_id: {type: String, required: true},
    added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    close_msg: {type: String, required: false},
    merchant_distance_type: {type: String, required: false},
    vendor_distance_coverd: {type: String, required: false},
    close_shop: {type: Number, required: true},
	
    
});
export default mongoose.model('vendor_setting_master', vendorSettingSchema);