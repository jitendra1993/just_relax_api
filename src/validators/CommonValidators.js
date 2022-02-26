import {body, query,param} from 'express-validator';
import VendorInfo from '../models/VendorInfo.js';

export default class CommonValidators {
	
	static postcode() {
		return [
			query('postcode', 'Postcode is Required').isLength({min: 3}),
			query('vendor_id').custom((vendor_id, {req}) => {
                return VendorInfo.findOne({user_hash_id: vendor_id}).then((info) => {
                    if (info) {
                        req.get = info;
                        return true;
                    } else {
                        throw  new Error('Vendor Does Not Exist');
                    }
                })
            })
           ];
			
    }

    static history() {
		return [
			query('userId', 'User id is Required').isLength({min: 3}),
			query('start', 'Page no. is Required').isLength({min: 1}),
			query('last', 'Total recored per page is Required').isLength({min: 1})
           ];
    }

}


