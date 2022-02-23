import  mongoose from 'mongoose';
mongoose.pluralize(null);

const mailerSchema = new mongoose.Schema({
    mail_from_email: {type: String, required: true},
    mail_from_name: {type: String, required: true},
    mail_host: {type: String, required: true},
    mail_port: {type: String, required: true},
    mail_username: {type: String, required: true},
    mail_password: {type: String, required: true},
    admin_received_mail: {type: String, required: true},
    admin_received_name: {type: String, required: true},
	added_date: {type: String, required: true},
	updated_date: {type: String, required: true},
	added_date_timestamp: {type: Number, required: true},
	updated_date_timestamp: {type: Number, required: true},
    added_date_iso: {type: Date, required: true},
    updated_date_iso: {type: Date, required: true},
    verification_token: {type: Number, required: true},
    verification_token_time: {type: Number, required: true},
});
export default mongoose.model('mail_setting_master', mailerSchema);
