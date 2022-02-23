import  mongoose from 'mongoose';

mongoose.pluralize(null);
const loyaltyPointSchema = new mongoose.Schema({
    id: {type: String, required: true},
    enable_pts: {type: String, required: true},
    points_based_earn: {type: String, required: false},
    pts_earning: {type: String, required: false},
    every_spent: {type: String, required: false},
    earning_points_value: {type: String, required: false},
    earn_above_amount: {type: String, required: false},
    enable_redeem: {type: Number, required: false},
    min_redeeming_point: {type: String},
    points_apply_order_amt: {type: String},
    min_point_used: {type: String, required: false},
    max_point_used: {type: String, required: false},
    user_hash_id: {type: String, required: true},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    
});
export default mongoose.model('master_loyalty_point', loyaltyPointSchema);