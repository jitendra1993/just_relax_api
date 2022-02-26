import { Utils } from '../utils/Utils.js';
import {messages}  from '../utils/Constant.js';
import { ApiResponse } from '../ApiResponse.js';
import request from 'request';
import { type } from 'os';
import {VendorController} from '../controllers/VendorController.js'
import moment from 'moment';
import UserModel from '../models/User.js';
import BannerModel from '../models/Banner.js';
import LoyaltyPointModel from '../models/LoyaltyPoint.js';
import SettingModel from '../models/VendorSetting.js';
import { decode } from 'html-entities';
import OrderModel from '../models/Order.js';

export class CommonController {

    static async checkPostcode(req, res, next) {

        const postcode = (req.query.postcode).replace(/ /g, '');
        const vendorPostcode = (req.get.pincode).replace(/ /g, '');
        const retaurantAddress = req.get.address
        const vendor_id = req.query.vendor_id;

        try {
            const condition = { user_hash_id: vendor_id }
            const projection = { _id: 0, vendor_distance_coverd: 1, distance_type: 1 }
            let setting = await SettingModel.findOne(condition, projection)
            // console.log(setting)

            let stringify = JSON.stringify(setting)
            let settingParse = JSON.parse(stringify)
            let delivery_coverd = settingParse.vendor_distance_coverd

            if (setting) {
                var max_distance = delivery_coverd ? delivery_coverd : '2'
                var units = 'metric';
                if (settingParse.distance_type == 'mi') {
                    units = 'imperial';

                }
                //var origins = encodeURI(retaurantAddress);
                var origins = encodeURI(vendorPostcode);
                var distination = encodeURI(postcode);


                var google_map_distance_matrix_api = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${distination}&units=${units}&key=AIzaSyA3PyqnzvGCmK5U3wP2uMh7kkID0bv9mRU`

                request(google_map_distance_matrix_api, function (error, response, body) {
                    if (response && response.statusCode != 200) {
                        next({ 'message': 'error in api' })

                    } else {
                        let bodyParse = JSON.parse(body)
                        var resStatus = bodyParse.rows[0].elements[0].status

                        if (resStatus == 'OK') {

                            let distance = bodyParse.rows[0].elements[0].distance.text
                            let split = distance.split(' ')
                            let distance_in_miles = split[0];
                            let distance_mes = split[1];
                            let dis_display = distance_in_miles.replace(',', '.',)

                            if (distance_mes == 'mi') {
                                if (distance_in_miles <= max_distance) {

                                    var del_msg = `Yes!! (${distance}) We will deliver!`
                                    var status = 1;

                                } else {
                                    del_msg = "Sorry you are outside our permitted area but you can pick up.";
                                    status = 0;
                                }
                            }

                            else if (distance_mes == 'km') {
                                if (distance_in_miles <= max_distance) {
                                    del_msg = `Yes!! (${distance}) We will deliver!`
                                    status = 1;

                                } else {
                                    del_msg = "Sorry you are outside our permitted area.";
                                    status = 0;
                                }
                            }

                            else if (distance_mes == 'ft') {
                                del_msg = `Yes!! (${distance}) We will deliver!`
                                status = 1;
                            }

                            else if (resStatus != 'ZERO_RESULTS' && resStatus != 'NOT_FOUND' && distance_mes != 'mi') {
                                del_msg = 'Yes!!  We will deliver!'
                                status = 1

                            } else {
                                status = 1;
                            }
                            const data = {
                                'msg': del_msg,
                                'distance': distance
                            }
                            res.json(new ApiResponse(data));


                            //console.log( JSON.stringify(  distance_mes, undefined, 2 ) ); 

                        } else {
                            const data = {
                                'errorStatus': 200,
                                'message': 'Invalid Postcode',
                            }
                            next(data)
                        }
                    }

                });
            } else {
                const data = {
                    'errorStatus': 200,
                    'message': 'Merchant setting not found'
                }
                next(data);
            }


        } catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }

    static async adminSetting(req, res, next) {
        try {

          var detail =  await CommonController.internalAdminSetting()

            //console.log( JSON.stringify( rt, undefined, 2 ) );  
            res.json(new ApiResponse(detail));
        } catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }

    static async internalAdminSetting() {
        var rt ={}
        const storeSetting = await UserModel.aggregate([
            {
                $match: {
                    $and: [
                        { role_master_tbl_id: 1 }
                    ]
                }
            },
            {
                $lookup:
                {
                    from: 'vendor_info_master',
                    let: { id: "$hash" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$id", "$user_hash_id"] }
                                    ]
                                }
                            }
                        },
                        { "$project": { _id: 0, "vendor_name": 1, "vendor_phone": 1, "contact_name": 1, "contact_phone": 1, "contact_email": 1, "country": 1, "state": 1, "city": 1, "address": 1, "pincode": 1, "about": 1, "site_url": 1, logo: 1, social_media: 1, favicon: 1,mail_logo_url:1 } }
                    ],
                    as: 'vendor_info'
                }
            },
            {
                $lookup:
                {
                    from: 'vendor_setting_master',
                    let: { b: '$hash' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user_hash_id", "$$b"] },
                                    ]
                                }
                            }
                        },
                       { "$project": { _id: 0, "user_hash_id": 0, "added_date": 0, "updated_date": 0, "added_date_timestamp": 0, "updated_date_timestamp": 0, "added_date_iso": 0, "updated_date_iso": 0 } }
                    ],
                    as: 'vendor_setting'
                }
            },
            {
                $lookup:
                {
                    from: 'social_media_setting_master',
                    let: { b: '$hash' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user_hash_id", "$$b"] },
                                    ]
                                }
                            }
                        },
                        { "$project": { _id: 0, "added_date": 0, "updated_date": 0, "added_date_timestamp": 0, "updated_date_timestamp": 0, "added_date_iso": 0, "updated_date_iso": 0 } }
                    ],
                    as: 'social_media'
                }
            },
            {
                $lookup:
                {
                    from: 'master_payment_option',
                    let: { b: '$hash' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user_hash_id", "$$b"] },
                                    ]
                                }
                            }
                        },
                        { "$project": { _id: 0, id: 0, "added_date": 0, "updated_date": 0, "added_date_timestamp": 0, "updated_date_timestamp": 0, "added_date_iso": 0, "updated_date_iso": 0, user_hash_id: 0, description: 0 } }
                    ],
                    as: 'master_payment_option'
                }
            },

            {
                $project: {
                    '_id': 0,
                    // 'email':'$email',
                    'role_master_tbl_id': '$role_master_tbl_id',
                    'vendor_info': '$vendor_info',
                    'vendor_setting': '$vendor_setting',
                    'social_media_login_setting': '$social_media',
                    'payment_option': '$master_payment_option',
                }
            },
            { "$limit": 1 }
        ]
        )
        if (storeSetting && storeSetting.length) {
             rt = storeSetting[0];
        }

        var image = messages.HOST+'/uploads/vendor_logo/'+rt.vendor_info[0].logo;
        rt.vendor_info[0].logopath = image;
       
        rt['vendor_info'] ={...rt.vendor_info[0]}
        rt['vendor_setting'] ={...rt.vendor_setting[0]}
        rt['social_media_login_setting'] ={...rt.social_media_login_setting[0]}

        var loyaltyPoint = await CommonController.getLoyaltyPoint();
        if(loyaltyPoint != null && typeof loyaltyPoint != "undefined"){
            rt['loyaltyPoint']= loyaltyPoint

        }else{
            rt['loyaltyPoint']= {}
        }
        return rt
       
    }

    static async  getLoyaltyPoint(){

        var projection = {
            _id:0,
            id:1,
            enable_pts:1,
            points_based_earn:1,
            pts_earning:1,
            every_spent:1,
            earning_points_value:1,
            earn_above_amount:1,
            enable_redeem:1,
            min_redeeming_point:1,
            points_apply_order_amt:1,
            min_point_used:1,
            max_point_used:1
        }
        var condition ={status:1}
        let points =  await LoyaltyPointModel.findOne(condition,projection)
        if (typeof points != "undefined" && points != null) {
            return points
        }
        return null
	}

    static async adminbanner(req, res, next) {
        try {
            const condition ={status: 1}
            const projection = {_id:0,id:1,name:1,alt_text:1,description:1,image:1}
            const bannerResult =  await BannerModel.find(condition,projection)

            const bannerRes = await Promise.all(
                bannerResult.map(async (element,array,index)=>{
                    const name = decode(element.name, { level: 'html5' });
                    const alt_text = decode(element.alt_text, { level: 'html5' });
                    const description = decode(element.description, { level: 'html5' });
                    if(element.image){
                        var image = messages.HOST+''+messages.CATEGORY_IMAGE_URL+''+element.image;
                    }else{
                        var image = messages.HOST+''+messages.CATEGORY_IMAGE_URL;
                    }
                    return { id: element.id, name: name,alt_text:alt_text,description:description,image:image}
                })
            )

            res.json(new ApiResponse(bannerRes));
        } catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }

    static async checkUserExist(id){

        const condition ={status: 1,hash: id}
        const projection = {_id:0,hash:1,email:1,name:1,mobile:1,loyalty_point:1}
        return await UserModel.findOne(condition,projection)
    }

    static async history(req, res, next){
        try {
            var totalRecord = 0
            let userId = (typeof req.query.userId != "undefined" && req.query.userId != null) ? req.query.userId : ''
            let start = (typeof req.query.start != "undefined" && req.query.start != null) ? Number(req.query.start) : 0
            let last = (typeof req.query.last != "undefined" && req.query.last != null) ? Number(req.query.last) : 20
            let textSearch = (typeof req.query.textSearch != "undefined" && req.query.textSearch != null) ? req.query.textSearch: ''
            let startDate = (typeof req.query.startDate != "undefined" && req.query.startDate != null) ? `${req.query.startDate}`: ''
            let endDate = (typeof req.query.endDate != "undefined" && req.query.endDate != null) ? `${req.query.endDate}`: ''
            let year = (typeof req.query.year != "undefined" && req.query.year != null) ? req.query.year: ''

            let queryObj = {
                _id: {$ne: null},
                user_id: userId
            };
            
            if (startDate != ''  && endDate != '')  {
                let startDateTime = parseInt((new Date(startDate+' 00:00:00').getTime()).toFixed(0))
                let endDateTime = parseInt((new Date(endDate+' 23:50:59').getTime()).toFixed(0))

                queryObj['added_date_timestamp'] = { $gte: startDateTime,$lte: endDateTime }
                
              
            }else if (startDate != ''  && endDate == '')  {
                let startDateTime = parseInt((new Date(startDate+' 00:00:00').getTime()).toFixed(0))
                queryObj['added_date_timestamp'] = { $gte: startDateTime }

            }else if (startDate == ''  && endDate != '')  {
                let endDateTime = parseInt((new Date(endDate+' 23:50:59').getTime()).toFixed(0))
                queryObj['added_date_timestamp'] = { $lte: endDateTime }

            }else if(year!= '')  {
                var isoDateStart = new Date(`${year}-01-01 00:00:00`).getTime() 
                var isoDateEnd= new Date(`${year}-12-31 23:59:59`).getTime() 
                
                queryObj['added_date_timestamp'] = { $gte: isoDateStart,$lte: isoDateEnd }
            }
        
            if (textSearch != '')  {
                queryObj["$or"] = [
                        {order_id:{$regex: textSearch, $options: 'i'}},
                        {description:{$regex: textSearch, $options: 'i'}},
                        {payment_remark:{$regex: textSearch, $options: 'i'}},
                                ]
            }
          
            const orderDetail = await OrderModel.find(queryObj).skip(start).limit(last).sort({_id:-1})
            totalRecord = await OrderModel.countDocuments(queryObj)
            if(orderDetail!=null && typeof orderDetail!='undefined' && orderDetail.length>0) {
                var rr= orderDetail.map((element,index)=>{
                    element = element.toJSON()
                    var status = Number(element['status'])
                    var payment_type = Number(element['payment_type'])
                    var payment_status = Number(element['payment_status'])
                    var text_order_status =''
					var pt ='Pending';
                    if(status==1)
                    {
                        text_order_status ='Placed';
                    }else if(status==2)
                    {
                        text_order_status ='Placed';
                    }else if(status==3)
                    {
                        text_order_status ='Accept';
                    }else if(status==4)
                    {
                        text_order_status ='Rejected';
                    }else if(status==5)
                    {
                        text_order_status ='Pending';
                    }

                    if(payment_type==2){
                        if(payment_status==1)
                        {
                            pt ='Success'
                        }else if(payment_status==2)
                        {
                            pt ='Pending'
                        }else if(payment_status==3)
                        {
                            pt ='Cancel'
                        }else if(payment_status==4)
                        {
                            pt ='Decline'
                        }
                    }
                    const newPropsObj = {
                        text_order_status:text_order_status,
                        text_payment_status:pt,
                      };
                    return Object.assign(element, newPropsObj);
                    
                    
                })
                //console.log( JSON.stringify( rr, undefined, 2 ) ); 
                var data ={totalRecord:totalRecord,result:rr}
                res.json(new ApiResponse(data));
            }else{
                res.json(new ApiResponse({},200,'No any order found.'));
            }
        }catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }
    
    


}