import {Router} from 'express';
import CommonValidators from '../validators/CommonValidators.js';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare.js';
import {CommonController} from '../controllers/CommonController.js';

class CommonRouter {

    constructor() {
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }

    postRoutes() {
        //this.router.post('/list', RestaurantValidators.list(), GlobalMiddleWare.checkError, RestaurantController.list);
    }

    getRoutes() {
        this.router.get('/postcode-verification', CommonValidators.postcode(), GlobalMiddleWare.checkError, CommonController.checkPostcode);
        this.router.get('/admin/setting',CommonController.adminSetting);
        this.router.get('/admin/banner',CommonController.adminbanner);
        this.router.get('/history',GlobalMiddleWare.authenticate,CommonValidators.history(), GlobalMiddleWare.checkError, CommonController.history);
        //this.router.get('/:id/items/:type', RestaurantValidators.restaurantId(), GlobalMiddleWare.checkError, RestaurantController.restaurantItems);
    }

}

export default new CommonRouter().router;
