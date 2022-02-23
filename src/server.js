import express from 'express';
import  mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {getEnvironmentVariables} from './environments/env.js';
import {ApiResponse} from'./ApiResponse.js';
import VendorRouter from './routers/VendorRouter.js';
import ServiceRouter from './routers/ServiceRouter.js';
import CommonRouter from './routers/CommonRouter.js';
import UserRouter from './routers/UserRouter.js';


//import OrderRouter from './routers/OrderRouter.js';
//import DriverRouter from './routers/DriverRouter.js';


export  class Server {
	app = express()

    constructor() {
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    setConfigurations() {
        this.connectMongoDb();
        this.configureBodyParser();
    }

    connectMongoDb() {
        const databaseUrl = getEnvironmentVariables().db_url;
		console.log(databaseUrl)
        mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log('connected to database');
        });
    }

    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({extended: true}));
		this.app.use(express.json())
    }

    setRoutes() {
        this.app.use('/src/uploads', express.static('src/uploads'));
	    this.app.use('/api/vendor', VendorRouter);
        this.app.use('/api/service', ServiceRouter);
	    this.app.use('/api/common', CommonRouter);
	    this.app.use('/api/user', UserRouter);
	//    this.app.use('/api/order', OrderRouter);
	//    this.app.use('/api/driver', DriverRouter);

	   this.app.get('/', function(req, res) { 
		res.send('API is running.');
	   })
    }

    error404Handler() {
       this.app.use((req, res) => {
            res.status(404).json({
                message: 'Request Not Found',
                status_code: 404
            });
        })
    }

    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
			const message = error.message || 'Something Went Wrong. Please Try Again';
			
            // res.status(errorStatus).json({
                // message: error.message || 'Something Went Wrong. Please Try Again',
                // status_code: errorStatus
            // })
			const data = {}
			res.json(new ApiResponse(data,errorStatus,message));
        })
    }
}
