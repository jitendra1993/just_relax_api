import  mongoose from 'mongoose';

mongoose.pluralize(null);
const orderSchema = new mongoose.Schema({
    id: {type: String, required: true},
    order_id: {type: String, required: true},
    user_id: {type: String, required: true},
    service_id: {type: String, required: true},
    service_name: {type: String, required: true},
    email: {type: String, required: true},
    address_id: {type: String, required: false},
    address_detail: {type: Object, required: false},
    description: {type: String, required: false},
    platform: {type: String, required: false},
    location : {type: { type: String },coordinates: []},
    vendors : {type: { type: Array },required: false},
    payment_remark: {type: String, required: false},
    admin_order_remark: {type: String, required: false},
    payment_status: {type: Number, required: false},
    payment_id: {type: String, required: false},
    status: {type: Number, required: true},
    visiting_charge: {type: Number, required: false},
    commission: {type: Number, required: false},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    
});     

orderSchema.index({
    location: '2dsphere'
});

export default mongoose.model('master_order_tbl', orderSchema);