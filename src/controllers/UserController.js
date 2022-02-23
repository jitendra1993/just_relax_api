import User from '../models/User.js';
import UserAddress from '../models/UserAddress.js';
import {Utils} from '../utils/Utils.js';
import {NodeMailer} from '../utils/NodeMailer.js';
import Jwt from 'jsonwebtoken';
import {getEnvironmentVariables} from '../environments/env.js';
import {ApiResponse} from'../ApiResponse.js';


export class UserController {
	
    static async signUp(req, res, next) {
		
       const hash = await Utils.randomAsciiString(32);
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const mobile = req.body.mobile;
        const verificationToken = Utils.generateVerificationToken();
		 const data = {
                hash: hash,
                name: name,
                email: email,
                mobile: mobile,
                password: await Utils.encryptPassword(password),
                role_master_tbl_id: req.body.role_master_tbl_id?req.body.role_master_tbl_id:4,
                status: 1,
                location : {type : "Point", coordinates :[28.412894,77.311299]},
                added_date: new Date().toString(),
                updated_date:  new Date().toString(),
                added_date_timestamp:  Math.floor(Date.now()),
                updated_date_timestamp:  Math.floor(Date.now()),
				added_date_iso: new Date(),
                updated_date_iso: new Date(),
                verification_token: verificationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
               
            };
        try {
            let user = await new User(data).save();
			res.json(new ApiResponse(user));
            //res.send(user);
			await NodeMailer.sendOtpOnMailRegistration(verificationToken,email,name)
        } catch (e) {
            next(e);
        }
    }
	
	static async login(req, res, next) {
        //const password = req.query.password;
        const password = req.body.password;
        let user = req.user;
        try {
            await Utils.comparePassword(password,user.password);
            const token = Jwt.sign({email: user.email, user_id: user._id,name:user.name},getEnvironmentVariables().jwt_secret, {expiresIn: '120d'});
			
			const userRes = {
				//_id:user._id,
				hash:user.hash,
				name:user.name,
				email:user.email,
				mobile:user.mobile,
				role_master_tbl_id:user.role_master_tbl_id,
				status:user.status,
				mail_status:user.mail_status,
				mobile_status:user.mobile_status,
			
			}
            const data = {token: token, user: userRes};
            //res.json(data);
			res.json(new ApiResponse(data));
        } catch (e) {
            next(e);
        }
    }
	
    static async verifyMail(req, res, next) {
        const verificationToken = Number(req.body.verification_token);
        const email = req.user.email;
        try {
            const user = await User.findOneAndUpdate({
                email: email, verification_token: verificationToken,
                verification_token_time: {$gte: Date.now()}
            }, {mail_status: 1}, {new: true});
            if (user) {
				const userRes = {
					_id:user._id,
					hash:user.hash,
					name:user.name,
					email:user.email,
					mobile:user.mobile,
					role_master_tbl_id:user.role_master_tbl_id,
					status:user.status,
					mail_status:user.mail_status,
					mobile_status:user.mobile_status,
				}
               // res.send(user);
			   res.json(new ApiResponse(userRes));
            } else {
                throw new Error('Verification Token Is Expired or OTP is incorrect.');
            }
        } catch (e) {
            next(e);
        }
    }

    static async resendVerificationEmail(req, res, next) {
        const email = req.body.email;
        const name = req.user.name;
        const verificationToken = Utils.generateVerificationToken();
        try {
            const user = await User.findOneAndUpdate({email: email}, {
                verification_token: verificationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            });
            if (user) {
				await NodeMailer.sendOtpOnMailRegistration(verificationToken,email,name)
				const data = {success: true}
				res.json(new ApiResponse(data));
            } else {
                throw new Error('User Does Not Exist');
            }
        } catch (e) {
            next(e);
        }
    }
	
	static async forgotPassword(req, res, next) {
        const email = req.body.email;
        const name = req.user.name;
        const verificationToken = Utils.generateVerificationToken();
        try {
            const user = await User.findOneAndUpdate({email: email}, {
                verification_token: verificationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            });
            if (user) {
				await NodeMailer.sendOtpOnMailForgotPassword(verificationToken,email,name)
				const data = {success: true}
				res.json(new ApiResponse(data));
            } else {
                throw new Error('User Does Not Exist');
            }
        } catch (e) {
            next(e);
        }
    }

    static async resetPassword(req, res, next) {
        const user = req.user;
        const newPassword = req.body.new_password;
        try {
            const encryptedPassword = await Utils.encryptPassword(newPassword);
            const updatedUser = await User.findOneAndUpdate({_id: user._id}, {
                updated_date:  new Date().toString(),
				updated_date_iso: new Date(),
                password: encryptedPassword
            }, {new: true});
			
			const userRes = {
				_id:user._id,
				hash:user.hash,
				name:user.name,
				email:user.email,
				mobile:user.mobile,
				role_master_tbl_id:user.role_master_tbl_id,
				status:user.status,
				mail_status:user.mail_status,
				mobile_status:user.mobile_status,
			
			}
            res.json(new ApiResponse(userRes));
        } catch (e) {
            next(e);
        }
    }

    static async updatePassword(req, res, next) {
		
        const user_id = req.user.user_id;
        const password = req.body.password;
        const newPassword = req.body.new_password;
        try {
            const user = await User.findOne({_id: user_id});
            await Utils.comparePassword( password,user.password);
            const encryptedPassword = await Utils.encryptPassword(newPassword);
            const newUser = await User.findOneAndUpdate({_id: user_id}, {password: encryptedPassword},
                {new: true});
            const userRes = {
				_id:user._id,
				hash:user.hash,
				name:user.name,
				email:user.email,
				mobile:user.mobile,
				role_master_tbl_id:user.role_master_tbl_id,
				status:user.status,
				mail_status:user.mail_status,
				mobile_status:user.mobile_status,
			
			}
            res.json(new ApiResponse(userRes));
        } catch (e) {
            next(e);
        }
    }

    static async sendResetPasswordEmail(req, res, next) {
        const email = req.query.email;
        const resetPasswordToken = Utils.generateVerificationToken();
        try {
            const updatedUser = await User.findOneAndUpdate({email: email},
                {
                    updated_at: new Date(), reset_password_token: resetPasswordToken,
                    reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                }, {new: true});
            res.send(updatedUser);
            await NodeMailer.sendEmail({
                to: [email], subject: 'Reset Password Email',
                html: `<h1>${resetPasswordToken}</h1>`
            })
        } catch (e) {
            next(e);
        }
    }

    static verifyResetPasswordToken(req, res, next) {
        res.json({
            success: true
        })
    }

    static async addAddress(req, res, next) {

        const hash = await Utils.randomAsciiString(32);
        const userId = req.user.user_id;
        const userName = req.user.name;
        const email = req.user.email;
        const userHashId = req.body.userId;
        const name = req.body.name;
        const phoneNumber = req.body.phoneNumber;
        const pincode = req.body.pincode;
        const addressLine1 = req.body.addressLine1;
        const addressLine2 = req.body.addressLine2;
        const addressType = Number(req.body.addressType);
        
      //  return false

		 const data = {
                hash: hash,
                user_hash_id: userHashId,
                name: name,
                phoneNumber: phoneNumber,
                pincode: pincode,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                addressType: addressType,
                status: 1,
                location : {type : "Point", coordinates :[28.412894,77.311299]},
                added_date: new Date().toString(),
                updated_date:  new Date().toString(),
                added_date_timestamp:  Math.floor(Date.now()),
                updated_date_timestamp:  Math.floor(Date.now()),
				added_date_iso: new Date(),
                updated_date_iso: new Date(),
            };
        try {
            let address = await new UserAddress(data).save();
            await NodeMailer.addAddressMail(userName,email,data)
			res.json(new ApiResponse(address));
        } catch (e) {
            next(e);
        }
    }

    static async listAddress(req, res, next) {

        const userId = req.user.user_id;
        const userHashId = req.query.userId;
       
        try {
            const condition ={user_hash_id:userHashId,status: { $in: [1,0]}}
            const projection = {_id:0,added_date:0,updated_date:0,added_date_iso:0,updated_date_iso:0,__v:0}
            let address = await UserAddress.find(condition,projection).sort( { added_date_timestamp: -1 } )
			res.json(new ApiResponse(address));
        } catch (e) {
            next(e);
        }
    }

    static async updateAddress(req, res, next) {

        const name = req.body.name;
        const addressId = req.body.addressId;
        const phoneNumber = req.body.phoneNumber;
        const pincode = req.body.pincode;
        const addressLine1 = req.body.addressLine1;
        const addressLine2 = req.body.addressLine2;
        const addressType = Number(req.body.addressType);
        
		 const data = {
                name: name,
                phoneNumber: phoneNumber,
                pincode: pincode,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                addressType: addressType,
                status: 1,
                location : {type : "Point", coordinates :[28.412894,77.311299]},
                updated_date:  new Date().toString(),
                updated_date_timestamp:  Math.floor(Date.now()),
                updated_date_iso: new Date(),
            };
           
        try {
            const address = await UserAddress.findOneAndUpdate({hash: addressId}, data, {new: true});
			res.json(new ApiResponse(address));
        } catch (e) {
            next(e);
        }
    }

    static async deleteAddress(req, res, next) {

        const addressId = req.body.addressId;
		 const data = {
                status: 2
            };
           
        try {
            const address = await UserAddress.findOneAndUpdate({hash: addressId}, data, {new: true});
			res.json(new ApiResponse(address));
        } catch (e) {
            next(e);
        }
    }

    static async getAddressById(req, res, next) {

        const addressId = req.param.id;
        var obj = req.get.toJSON();
        //delete obj['_id']
        const {_id,added_date,updated_date,added_date_iso,updated_date_iso,__v, ...updatedObject} = obj;

        try {
			res.json(new ApiResponse(updatedObject));
        } catch (e) {
            next(e);
        }
    }

    static async getUserProfile(req, res, next) {

        var obj = req.get.toJSON();
        //console.log(obj)
        //delete obj['_id']
        const {_id,added_date,updated_date,added_date_iso,updated_date_iso,__v,password,verification_token,verification_token_time, ...updatedObject} = obj;

        try {
			res.json(new ApiResponse(updatedObject));
        } catch (e) {
            next(e);
        }
    }

    static async updateProfile(req, res, next) {

        const userId = req.body.userId;
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
       
		 const data = {
                name: name,
                email: email,
                mobile: mobile,
                updated_date:  new Date().toString(),
                updated_date_timestamp:  Math.floor(Date.now()),
                updated_date_iso: new Date(),
            };
           
        try {
            var obj = await User.findOneAndUpdate({hash: userId}, data, {new: true});
            var profile = obj.toJSON()
            const {_id,added_date,updated_date,added_date_iso,updated_date_iso,__v,password,verification_token,verification_token_time, ...updatedObject} = profile;
			res.json(new ApiResponse(updatedObject));
        } catch (e) {
            next(e);
        }
    }

    static async updateProfilePic(req, res, next) {
        const userId = req.user.user_id;
        const fileUrl = 'http://localhost:5000/' + req.file.path;
        try {
            const user = await User.findOneAndUpdate({_id: userId}, {
                updated_at: new Date(),
                profile_pic_url: fileUrl
            }, {new: true});
            res.send(user);
        } catch (e) {
            next(e);
        }
    }
}
