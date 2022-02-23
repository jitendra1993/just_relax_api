import {Router} from 'express';
import {UserValidators} from '../validators/UserValidators.js';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare.js';
import {UserController} from '../controllers/UserController.js';

import {Utils} from '../utils/Utils.js';

class UserRouter {
    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/profile/:id', GlobalMiddleWare.authenticate, UserValidators.profileId(), GlobalMiddleWare.checkError,UserController.getUserProfile); 
		//this.router.get('/reset/password', UserValidators.sendResetPasswordEmail(), GlobalMiddleWare.checkError,UserController.sendResetPasswordEmail);
        //this.router.get('/verify/resetPasswordToken', UserValidators.verifyResetPasswordToken(), GlobalMiddleWare.checkError,UserController.verifyResetPasswordToken)
        this.router.get('/address/list', GlobalMiddleWare.authenticate, UserValidators.listAddress(), GlobalMiddleWare.checkError,UserController.listAddress);  
        this.router.get('/address/:id', GlobalMiddleWare.authenticate, UserValidators.addressId(), GlobalMiddleWare.checkError,UserController.getAddressById); 
        
    }

    postRoutes() {
    
       this.router.post('/signup', UserValidators.signUp(), GlobalMiddleWare.checkError, UserController.signUp);
       this.router.post('/send/verification/email',UserValidators.resendEmailVerification(),GlobalMiddleWare.checkError,UserController.resendVerificationEmail);
        this.router.post('/login', UserValidators.login(), GlobalMiddleWare.checkError, UserController.login);
        this.router.post('/forgot/password',UserValidators.resendEmailVerification(),GlobalMiddleWare.checkError,UserController.forgotPassword);
		this.router.post('/address/add', GlobalMiddleWare.authenticate, UserValidators.addAddress(), GlobalMiddleWare.checkError,UserController.addAddress); 
    }

    patchRoutes() {
        this.router.patch('/verify-mail', UserValidators.verifyMailToken(), GlobalMiddleWare.checkError,UserController.verifyMail);
		this.router.patch('/reset/password', UserValidators.resetPassword(), GlobalMiddleWare.checkError, UserController.resetPassword);
        this.router.patch('/update/password', GlobalMiddleWare.authenticate, UserValidators.updatePassword(), GlobalMiddleWare.checkError,UserController.updatePassword);
        this.router.put('/profile/update', GlobalMiddleWare.authenticate, UserValidators.updateProfile(), GlobalMiddleWare.checkError,UserController.updateProfile); 
        this.router.put('/address/update', GlobalMiddleWare.authenticate, UserValidators.addAddress(), GlobalMiddleWare.checkError,UserController.updateAddress); 
        this.router.patch('/address/delete', GlobalMiddleWare.authenticate, UserValidators.deleteAddress(), GlobalMiddleWare.checkError,UserController.deleteAddress); 
        
    }

    deleteRoutes() {

    }
}

export default new UserRouter().router;
