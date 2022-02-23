import {Router} from 'express';
import {VendorValidators} from '../validators/VendorValidators.js';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare.js';
import {VendorController} from '../controllers/VendorController.js';
import {ServiceController} from '../controllers/ServiceController.js';

class ServiceRouter {

    constructor() {
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }

    postRoutes() {
        this.router.post('/list',ServiceController.list);
        // this.router.post('/cart/add', RestaurantValidators.addTocart(), GlobalMiddleWare.checkError, RestaurantController.addToCart);
        // this.router.post('/cart/detail', RestaurantValidators.cartDetail(), GlobalMiddleWare.checkError, RestaurantController.cartDetail);
        // this.router.post('/cart/update', RestaurantValidators.cartUpdate(), GlobalMiddleWare.checkError, RestaurantController.cartUpdate);
        // this.router.post('/cart/delete-item', RestaurantValidators.cartItemDelete(), GlobalMiddleWare.checkError, RestaurantController.cartItemDelete);
        // this.router.post('/cart/delete', RestaurantValidators.cartDelete(), GlobalMiddleWare.checkError, RestaurantController.cartDelete);
    }

    getRoutes() {
        //this.router.post('/list',ServiceController.list);
        // this.router.get('/:id/category', RestaurantValidators.restaurantId(), GlobalMiddleWare.checkError, RestaurantController.restaurantMasterCategory);
        // this.router.get('/:id/items/:type', RestaurantValidators.restaurantId(), GlobalMiddleWare.checkError, RestaurantController.restaurantItems);
        // this.router.get('/:id/item/:item_id', RestaurantValidators.restaurantIdItemId(), GlobalMiddleWare.checkError, RestaurantController.restaurantItemsDetail);
        
    }

}

export default new ServiceRouter().router;
