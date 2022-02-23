import {body, query,param} from 'express-validator';
import User from '../models/User.js';
import UserAddress from '../models/UserAddress.js';

export class UserValidators {
	
    static signUp() {
		
        return [
			body('name', 'Name is Required').isLength({min: 3}),
			body('email', 'Email is Required').isEmail().custom((email, {req}) => {
			return User.findOne({email: email}).then(user => {
				if (user) {
					throw new Error('User Already Exist');
				} else {
					return true;
				}
			})
			}),
            body('password', 'Password is Required').isAlphanumeric().isLength({min: 6, max: 20}).withMessage('Password can be from 6-20 Characters only'),
            body('mobile', 'Mobile is Required').isLength({min: 10, max: 11}).withMessage('Mobile should be 10-11 Characters only').custom((mobile, {req}) => {
			return User.findOne({mobile: mobile}).then(user => {
				if (user) {
					throw new Error('Mobile Already Exist');
				} else {
					return true;
				}
			})
			})
			];
    }
	
	 static login() {
		return [
			body('email', 'Email is Required').isEmail().custom((email, {req}) => {
			return User.findOne({email: email}).then(user => {
				if (user) {
					req.user = user;
                    if(user.status==0){
                        throw new Error('Account is not active');
                    }else{
                        return true;
                    }
                    
					
					
				} else {
					
				}
			})
			}),
            body('password', 'Password is Required').isAlphanumeric().isLength({min: 6, max: 20}).withMessage('Password can be from 6-20 Characters only'),
			];
			
    }
	
    static verifyMailToken() {
        return [
			body('verification_token', 'Verification Token is Required').isNumeric(),
			body('email', 'Email is Required').isEmail().custom((email, {req}) => {
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
	
	static resendEmailVerification() {
        return [
			
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

	 static resetPassword() {
        return [
			body('email', 'Email is Required').isEmail().custom((email, {req}) => {
				return User.findOne({email: email}).then(user => {
					if (user) {
						req.user = user;
						return true;
					} else {
						throw  new Error('User Does Not Exist');
					}
				});
			}),
			body('new_password', 'New Password is Required').isAlphanumeric().custom((newPassword, {req}) => {
				if (newPassword === req.body.confirm_password) {
					return true;
				} else {
					throw new Error('Confirm Password and new Password Does not Match');
				}
			}),
            body('confirm_password', 'Confirm Password is Required').isAlphanumeric()
        ]
    }

    static updatePassword() {
        return [body('password', 'Password is Required').isAlphanumeric(),
            body('confirm_password', 'Confirm Password is Required').isAlphanumeric(),
            body('new_password', 'New Password is Required').isAlphanumeric()
                .custom((newPassword, {req}) => {
                    if (newPassword === req.body.confirm_password) {
                        return true;
                    } else {
                        req.errorStatus = 422;
                        throw  new Error('Password and Confirm Password Does Not Match');
                    }
                })]
    }

    static sendResetPasswordEmail() {
        return [query('email', 'Email is Required').isEmail()
            .custom((email) => {
                return User.findOne({email: email}).then((user) => {
                    if (user) {
                        return true;
                    } else {
                        throw new Error('Email Does not Exist');
                    }
                })
            })];
    }

    static verifyResetPasswordToken() {
        return [query('reset_password_token', 'Reset Password Token is Required')
            .isNumeric().custom((token, {req}) => {
                return User.findOne({
                    reset_password_token: token,
                    reset_password_token_time: {$gt: Date.now()}
                }).then((user) => {
                    if (user) {
                        return true;
                    } else {
                        throw new Error('Token Doest Not Exist.Please Request For a New One');
                    }
                })
            })]
    }

    static updateProfilePic() {
        return [body('profile_pic').custom((profilePic, {req}) => {
            if (req.file) {
                return true;
            } else {
                throw new Error('File not Uploaded');
            }
        })]
    }

    static addAddress() {
		
        return [
			body('userId', 'User Id is Required').isLength({min: 10}).withMessage('User Id  should be minimum 10 Characters'),
            body('name', 'Name is Required').isLength({min: 3}),
            body('phoneNumber', 'Mobile is Required').isLength({min: 10, max: 11}).withMessage('Mobile should be 10-11 Characters only'),
            body('pincode', 'Postcode is Required').isLength({min: 6}).withMessage('Postcode should be minimum 6 Characters'),
            body('addressLine1', 'Address Line 1 is Required').isLength({min: 3}),
            body('addressLine2', 'Address Line 2 is Required').isLength({min: 3}),
            body('addressType', 'Address Type is Required').isLength({min: 1})
			];
    }

    static listAddress() {
        return [
			query('userId', 'User Id is Required').isLength({min: 10}).withMessage('User Id  should be minimum 10 Characters'),
			];
    }

    static deleteAddress() {
        return [
			body('addressId', 'Address Id is Required').isLength({min: 5}).withMessage('Address Id  should be minimum 10 Characters'),
			];
    }

    static addressId() {
		return [
            param('id').custom((id, {req}) => {
                return UserAddress.findOne({hash: id}).then((address) => {
                    if (address) {
                        req.get = address;
                        return true;
                    } else {
                        throw  new Error('Address Does Not Exist');
                    }
                })
            }),
        ]
			
    }

    static updateProfile() {
		
        return [
			body('name', 'Name is Required').isLength({min: 3}),
			body('email', 'Email is Required').isEmail().custom((email, {req}) => {
			return User.countDocuments({email: email,hash:{$nin:[req.body.userId]}}).then(user => {
				if (user) {
					throw new Error('Email Already Exist');
				} else {
					return true;
				}
			})
			}),
            body('mobile', 'Mobile is Required').isLength({min: 10, max: 11}).withMessage('Mobile should be 10-11 Characters only').custom((mobile, {req}) => {
			return User.countDocuments({mobile: mobile,hash:{$nin:[req.body.userId]}}).then(user => {
				if (user) {
					throw new Error('Mobile Already Exist');
				} else {
					return true;
				}
			})
			})
			
			
			];
    }

    static profileId() {
		return [
            param('id').custom((id, {req}) => {
                return User.findOne({hash: id}).then((user) => {
                    if (user) {
                        req.get = user;
                        return true;
                    } else {
                        throw  new Error('user Does Not Exist');
                    }
                })
            }),
        ]
			
    }

}


