import  mongoose from 'mongoose';

mongoose.pluralize(null);
const bannerSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    alt_text: {type: String, required: false},
    description: {type: String, required: false},
    sort_order: {type: Number},
    status: {type: Number},
    image: {type: String},
    user_hash_id: {type: String},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    
});
export default mongoose.model('master_banner', bannerSchema);