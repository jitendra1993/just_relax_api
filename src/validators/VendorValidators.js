import {body, query,param} from 'express-validator';
import VendorInfoModel from '../models/VendorInfo.js';
import VendorCategoryModel from '../models/VendorCategory.js';
import User from '../models/User.js';


export class VendorValidators {
	
	static list() {
        
		return [
            
			body('searchType', 'Search Type is Required').isLength({min: 1}),
           ];
			
    }

	static vendorId() {
		return [
            param('id').custom((id, {req}) => {
                return VendorInfoModel.findOne({user_hash_id: id}).then((info) => {
                    if (info) {
                        req.get = info;
                        return true;
                    } else {
                        throw  new Error('Vendor Does Not Exist');
                    }
                })
            })]
			
    }

    static similar() {
		return [
            body('postcode', 'Postcode is Required').isLength({min: 4}),
            body('vendor_id', 'Vendor id is Required').isLength({min: 4}),
            body('category_id').custom((id, {req}) => {
                return VendorCategoryModel.findOne({id: id}).then((info) => {
                    if (info) {
                        req.get = info;
                        return true;
                    } else {
                        throw  new Error('Category Does Not Exist');
                    }
                })
            })
        ]
			
    }

    static sendrequest() {
       
		return [
            //console.log('dddd')
            body('user_id', 'User id is Required').isLength({min: 4}),
            body('address_id', 'Address id is Required').isLength({min: 4}),
            body('description', 'Description id is Required').isLength({min: 4}),
            body('service_id').custom((id, {req}) => {
                return VendorCategoryModel.findOne({id: id}).then((info) => {
                    if (info) {
                        req.get = info;
                        return true;
                    } else {
                        throw  new Error('Service Does Not Exist');
                    }
                })
            }),
            body('email', 'Email is Required').isEmail().isLength({min: 3}).custom((email, {req}) => {
                return User.findOne({email: email}).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                        
                    } else {
                        throw new Error('Email Does Not Exist');
                    }
                })
                }),
        ]
			
    }

    // static restaurantIdItemId() {
	// 	return [
    //         param('id').custom((id, {req}) => {
    //             return RestaurantInfo.findOne({user_hash_id: id}).then((info) => {
    //                 if (info) {
    //                     req.get = info;
    //                     return true;
    //                 } else {
    //                     throw  new Error('Restaurant Does Not Exist');
    //                 }
    //             })
    //         }),
        
    //         param('item_id').custom((id, {req}) => {
    //             return ProductModel.findOne({id: id}).then((info) => {
    //                 if (info) {
    //                     //req.get = info;
    //                     return true;
    //                 } else {
    //                     throw  new Error('Item id Does Not Exist');
    //                 }
    //             })
    //         }),
    //     ]
			
    // }

    // static addTocart() {
	// 	return [
	// 		body('itemId', 'Item id is Required').isLength({min: 3}),
	// 		body('restaurantId', 'Restaurant id is Required').isLength({min: 3}),
	// 		body('price', 'Price is Required').isLength({min: 1}),
	// 		body('itemQuantity', 'Item Quantity is Required').isLength({min: 1}),
	// 		body('postCode', 'Postcodeis Required').isLength({min: 3}),
    //        ];
    // }

    // static cartDetail() {
	// 	return [
	// 		body('restaurantId', 'Restaurant id is Required').isLength({min: 3}),
	// 		body('cookieId', 'Price is Required').isLength({min: 1})
    //        ];
    // }

    // static cartUpdate() {
	// 	return [
    //         body('cookieId', 'Price is Required').isLength({min: 1}),
	// 		body('restaurantId', 'Restaurant id is Required').isLength({min: 3}),
	// 		body('cartId', 'Cart Id is Required').isLength({min: 1}),
	// 		body('uniqueId', 'Item Id is Required').isLength({min: 1}),
	// 		body('quantity', 'Quantity is Required').isLength({min: 1}).withMessage('must be at least 1 chars long').matches(/\d/).withMessage('must contain a number').isInt({ min:1}).withMessage('Quantity should be greater then or eqaul to 1'),
	// 		body('updateType', 'Update Type is Required').isLength({min: 1}),
    //        ];
    // }

    // static cartItemDelete() {
	// 	return [
    //         body('cookieId', 'Price is Required').isLength({min: 1}),
	// 		body('restaurantId', 'Restaurant id is Required').isLength({min: 3}),
	// 		body('cartId', 'Cart Id is Required').isLength({min: 1}),
	// 		body('uniqueId', 'Item Id is Required').isLength({min: 1}),
	// 		body('updateType', 'Update Type is Required').isLength({min: 1}),
    //        ];
    // }

    // static cartDelete() {
	// 	return [
    //         body('cookieId', 'Price is Required').isLength({min: 1}),
	// 		body('restaurantId', 'Restaurant id is Required').isLength({min: 3}),
	// 		body('cartId', 'Cart Id is Required').isLength({min: 1})
    //        ];
    // }

}


