import {Router} from 'express';
import {VendorValidators} from '../validators/VendorValidators.js';
import {GlobalMiddleWare} from '../middlewares/GlobalMiddleWare.js';
import {VendorController} from '../controllers/VendorController.js';

class VendorRouter {

    constructor() {
        this.router = Router();
        this.postRoutes();
        this.getRoutes();
    }

    postRoutes() {
        this.router.post('/list', VendorValidators.list(), GlobalMiddleWare.checkError, VendorController.list);
        this.router.post('/similar', VendorValidators.similar(), GlobalMiddleWare.checkError, VendorController.similarVendor);
        this.router.post('/sendrequest', VendorValidators.sendrequest(), GlobalMiddleWare.checkError, VendorController.sendRequest);
        // this.router.post('/cart/add', RestaurantValidators.addTocart(), GlobalMiddleWare.checkError, RestaurantController.addToCart);
        // this.router.post('/cart/detail', RestaurantValidators.cartDetail(), GlobalMiddleWare.checkError, RestaurantController.cartDetail);
        // this.router.post('/cart/update', RestaurantValidators.cartUpdate(), GlobalMiddleWare.checkError, RestaurantController.cartUpdate);
        // this.router.post('/cart/delete-item', RestaurantValidators.cartItemDelete(), GlobalMiddleWare.checkError, RestaurantController.cartItemDelete);
        // this.router.post('/cart/delete', RestaurantValidators.cartDelete(), GlobalMiddleWare.checkError, RestaurantController.cartDelete);
    }

    getRoutes() {
        this.router.get('/:id', VendorValidators.vendorId(), GlobalMiddleWare.checkError, VendorController.vendorDetail);
        // this.router.get('/:id/items/:type', RestaurantValidators.restaurantId(), GlobalMiddleWare.checkError, RestaurantController.restaurantItems);
        // this.router.get('/:id/item/:item_id', RestaurantValidators.restaurantIdItemId(), GlobalMiddleWare.checkError, RestaurantController.restaurantItemsDetail);
        
    }

}

export default new VendorRouter().router;
