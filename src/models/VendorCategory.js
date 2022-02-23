import  mongoose from 'mongoose';

mongoose.pluralize(null);
const vendorCategorySchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: false},
    sort_order: {type: Number, required: true,default:1},
    commission: {type: Number, required: true,default:5},
    status: {type: Number, required: true,default:1},
    on_front: {type: Number, required: false,default:0},
    user_hash_id: {type: String, required: true},
    image: {type: String, required: true},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    
});
export default mongoose.model('vendor_category', vendorCategorySchema);