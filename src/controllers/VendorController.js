import { Utils } from '../utils/Utils.js';
import { ApiResponse } from '../ApiResponse.js';
import VendorCategoryModel from '../models/VendorCategory.js';
import UserModel from '../models/User.js';
import {messages}  from '../utils/Constant.js';
import UserAddressModel from '../models/UserAddress.js';
import OrderModel from '../models/Order.js';
import InfoModel from '../models/VendorInfo.js';
import {NodeMailer} from '../utils/NodeMailer.js';

export class VendorController {
    
    addressId
    userId
    serviceId
    email
    vendors
    platform
    description
    visit_date
    visit_time

    static async list(req, res, next) {
        const postcode = (typeof req.body.postcode != "undefined" && req.body.postcode != null) ? (req.body.postcode).replace(/ /g, '').substring(0, 4): '';
        const searchType = Number(req.body.searchType);  //1 vendor category,2 vendor name
        const textSearch = (typeof req.body.textSearch != "undefined" && req.body.textSearch != null) ?(req.body.textSearch):[];
        const categoryIdArr =  (typeof req.body.category_id != "undefined" && req.body.category_id != null) ? req.body.category_id : []
        const distance = (typeof req.body.distance != "undefined" && req.body.distance != null) ? req.body.distance : 0
        const sort = (typeof req.body.sort != "undefined" && req.body.sort != null) ? req.body.sort : 0
        const skip = (typeof req.body.skip != "undefined" && req.body.skip != null) ? req.body.skip : 0
        const limit = (typeof req.body.limit != "undefined" && req.body.limit != null) ? req.body.limit : 1000

        var vendorNameMatch = [{}]
        var vendorPostcodeMatch = {}
        var vendorCategorymatch = [{}];

        var jobQueries = [];
        if (searchType==1 && textSearch!= ""  && typeof (textSearch) == 'object') {
            vendorCategorymatch = [];
            textSearch.forEach( (element,array,index)=>{
                vendorCategorymatch.push({name:{ $regex: element, $options: 'i' }});
           
            })
           
            
        }else if (searchType==2 && textSearch!= "" && typeof (textSearch) == 'object') {
            vendorNameMatch = []
            textSearch.forEach( (element,array,index)=>{
                vendorNameMatch.push({$regexMatch:{ input: "$vendor_name",regex: element,options: 'i' }});
           
            })
            //vendorNameMatch.push( {$regexMatch:{ input: "$vendor_name",regex: textSearch,options: 'i' } })
            //vendorNameMatch =  {$regexMatch:{ input: "$vendor_name",regex: textSearch,options: 'i' } }
        }

        if (postcode!== "") {
            //vendorInfomatch.push({$regexMatch:{ input: "$pincode",regex: postcode,options: 'i' } })
            vendorPostcodeMatch = {$regexMatch:{ input: "$pincode",regex: postcode,options: 'i' } }
        }
        

        var filters = {}
        if (categoryIdArr != '' && typeof (categoryIdArr) == 'object') {
            filters['categoryArr'] = categoryIdArr
        }

       // console.log(vendorNameMatch)
  


        try {
            const category = await VendorCategoryModel.aggregate([
                {
                    $match: {
                        $and: [
                            {$or:[ {status:1} ]},
                            {$or:vendorCategorymatch}
                        ]
                    }
                },
                {
                    $lookup:
                    {
                        from: 'vendor_info_master',
                        let: { id: "$id" },
                        pipeline: [
                            
                            {
                                $match: {
                                    $expr: {

                                        $and: [
                                            { $or: [ { $in: ["$$id", "$vendor_category"] } ] },
                                           // { $or: vendorInfomatch  },
                                           { $or: vendorNameMatch},
                                           { $or: [vendorPostcodeMatch]  }
                                        ],
                                    }
                                },
                            },
                        ],
                        as: 'vendor_info'
                    }
                },
                { $unwind: "$vendor_info" },
                {
                    $lookup:
                    {
                        from: 'user_master',
                        let: { a: "$vendor_info.user_hash_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$hash", "$$a"] },
                                            { $eq: ["$role_master_tbl_id", 2] },
                                            { $eq: ["$status", 1] },
                                        ]
                                    }
                                }
                            },
                            { "$project": { _id: 0, "status": 1, "hash": 1} }
                        ],
                        as: 'vendor'
                    }
                },
                { $unwind: "$vendor" },
                {
                    $lookup:
                    {
                        from: 'vendor_setting_master',
                        let: { b: '$vendor_info.user_hash_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user_hash_id", "$$b"] },
                                            { $eq: ["$close_shop", 0] },
                                        ]
                                    }
                                }
                            },
                            { "$project": { _id: 0, "close_msg": 1, "close_shop": 1, "distance_type": 1} }
                        ],
                        as: 'vendorSetting'
                    }
                },
               { $unwind: "$vendorSetting" },
                {
                    $project: {
                        '_id': 0,
                        'category_id': '$id',
                        'category_name': '$name',
                        'category_image': '$image',
                        'vendor_name': '$vendor_info.vendor_name',
                        'vendor_phone': '$vendor_info.vendor_phone',
                        'vendor_address': '$vendor_info.address',
                        'pincode': '$vendor_info.pincode',
                        'vendor_role': '$vendor.role_master_tbl_id',
                        'restaurant_status': '$vendor.status',
                        'vendor_user_id': '$vendor.hash',
                        'close_shop': '$vendorSetting.close_shop',
                        'close_msg': '$vendorSetting.close_msg',
                    }
                },
                {
                    $group: {
                        '_id': "$category_id",
                        'category_id': { '$first': '$category_id' },
                        "category_name": { "$first": "$category_name" },
                        "category_image": { "$first": "$category_image" },
                        "vendor_user_id": { "$push": "$vendor_user_id" },
                        "vendor_name": { "$push": "$vendor_name" },
                        "vendor_pincode": { "$push": "$pincode" },
                        "total_vendor": { "$sum": 1 },
                    }
                },
                { $sort: { category_name: 1 } }
            ])
            
            category.filter((category, index, arr) => {
                let vendor_user_id = category.vendor_user_id
                let total_vendor = Number(category.total_vendor)
                category['vendor_user_id'] = vendor_user_id.filter(el => { return el != null && el != ''; });
                category['total_vendor'] = total_vendor
            })

            
            //console.log( JSON.stringify( category, undefined, 2 ) );
            
            let vendorIds = []
            category.filter((category, index) => {

                if (categoryIdArr != '' && typeof (categoryIdArr) == 'object') {
                    if (categoryIdArr.indexOf(category['category_id']) != -1) {
                        category['vendor_user_id'].forEach(element => {
                            vendorIds.push(element)
                        })
                    }
                } else {
                    category['vendor_user_id'].forEach(element => {
                        vendorIds.push(element)
                    })
                }

            })
            let uniqueVendordArr = [...new Set(vendorIds)];
           // console.log(uniqueVendordArr)
            
            var result = {}
            result = await VendorController.vendorResultList(vendorNameMatch,vendorPostcodeMatch,vendorCategorymatch,uniqueVendordArr,filters,skip,limit).then(v => {
                return v
            })
                .catch(function (err) {
                    throw new Error(err);
                });

            const data = {
                'totalRecord': result.count.length,
                'vendorCategory': category,
                result: result.result
            }
            res.json(new ApiResponse(data));

        } catch (e) {
            console.log('err ' + e)
            next(e);
        }

    }

    static async vendorResultList(vendorNameMatch,vendorPostcodeMatch,vendorCategorymatch,uniqueVendordArr,filters,skip,limit) {
        var categoryMatch = {};
        const categoryIdArr = filters['categoryArr']
        if (categoryIdArr != '' && typeof (categoryIdArr) == 'object') {
            categoryMatch['id'] = { $in: categoryIdArr }
        }

        const condition =[

            {
                $match: {
                    $and: [
                        {$or:[ {status:1} ]},
                        {$or:vendorCategorymatch},
                   
                    ]
                }
            },
            {
                $lookup:
                {
                    from: 'vendor_info_master',
                    let: { id: "$id", user_hash_id: "$user_hash_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {

                                    $and: [
                                        { $or: [ { $in: ["$$id", "$vendor_category"] } ] },
                                        { $or: vendorNameMatch},
                                        { $or: [vendorPostcodeMatch]},
                                        { $in: ["$user_hash_id", uniqueVendordArr] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'vendor_info'
                }
            },
            { $unwind: "$vendor_info" },
            {
                $lookup:
                {
                    from: 'user_master',
                    let: { a: "$vendor_info.user_hash_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$hash", "$$a"] },
                                        { $eq: ["$role_master_tbl_id", 2] },
                                        { $eq: ["$status", 1] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'vendor'
                }
            },
            { $unwind: "$vendor" },

            {
                $lookup:
                {
                    from: 'vendor_setting_master',
                    let: { b: '$vendor_info.user_hash_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user_hash_id", "$$b"] },
                                        { $eq: ["$close_shop", 0] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'vendorSetting'
                }
            },
            { $unwind: "$vendorSetting" },

            {
                $lookup:
                {
                    from: 'vendor_category',
                    let: { c: '$vendor_info.vendor_category' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { "$in": ["$id", "$$c"] }
                                    ]
                                }
                            }
                        },
                        { "$project": { _id: 0, "name": 1 } }
                    ],
                    as: 'vendor_category'
                }
            },

            {
                $project: {
                    '_id': 0,
                    'category_id': '$id',
                    'category_image': '$image',
                    'vendor_id': '$vendor_info.user_hash_id',
                    'vendor_name': '$vendor_info.vendor_name',
                    'vendor_phone': '$vendor_info.vendor_phone',
                    'vendor_address': '$vendor_info.address',
                    'vendor_city': '$vendor_info.city',
                    'postcode': '$vendor_info.pincode',
                    'logo': '$vendor_info.logo',
                    'about': '$vendor_info.about',
                    'category_name': '$vendor_category.name',
                    'restaurant_status': '$vendor.status',
                    'close_shop': '$vendorSetting.close_shop',
                    'close_msg': '$vendorSetting.close_msg',
                    'setting_id': '$vendorSetting.user_hash_id',
                    'distance_type': '$vendorSetting.distance_type',
                    'vendor_distance_coverd': '$vendorSetting.vendor_distance_coverd',
                    'logo_path': messages.HOST+''+messages.LOGO_IMAGE_URL,
                    'default_logo': messages.HOST+''+messages.DEAFULT_CATEGORY_IMAGE_URL,
                   
                }
            }
        ]

        let result = await VendorCategoryModel.aggregate([
            ...condition,

            {
                $group: {
                    '_id': "$vendor_id",
                    'category_id': { '$push': '$category_id' },
                    "category_name": { "$first": "$category_name" },
                    "category_image": { "$push": "$category_image" },
                    "vendor_name": { "$first": "$vendor_name" },
                    "vendor_phone": { "$first": "$vendor_phone" },
                    "vendor_address": { "$first": "$vendor_address" },
                    "vendor_city": { "$first": "$vendor_city" },
                    "postcode": { "$first": "$postcode" },
                    "logo": { "$first": "$logo" },
                    "about": { "$first": "$about" },
                    "default_logo": { "$first": "$default_logo" },
                    "logo_path": { "$first": "$logo_path" },
                    "setting_id": { "$first": "$setting_id" },
                    "close_msg": { "$first": "$close_msg" },
                    "close_shop": { "$first": "$close_shop" },
                    "vendor_distance_type": { "$first": "$distance_type" },
                    "vendor_distance_coverd": { "$first": "$vendor_distance_coverd" },
                    
                }
            },
            { $sort: { vendor_name: 1 } },
            { $skip: skip },
            { $limit: limit }

        ]
        )

        // count result
        const count =  await VendorCategoryModel.aggregate([
            ...condition,
            {
                $group: {
                    '_id': "$vendor_id",
                }
            }
        ]
        )
        return {result:result,count:count}
    }

    static async vendorDetail(req, res, next){

        try {
            var rt={}
            const vendortId = req.params.id;
            const storeSetting = await UserModel.aggregate([
                {
                    $match: {
                        $and: [
                            { role_master_tbl_id: 2 },
                            { hash: vendortId }
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
                            { "$project": { _id: 0, "vendor_name": 1, "vendor_phone": 1, "contact_name": 1, "contact_phone": 1, "contact_email": 1, "country": 1, "state": 1, "city": 1, "address": 1, "pincode": 1, "about": 1, "site_url": 1, 'logo': 1, social_media: 1,'vendor_category':1 } }
                        ],
                        as: 'vendor_info'
                    }
                },
                {   $unwind:"$vendor_info" }, 
                {
                    $lookup:
                    {
                        from: 'vendor_category',
                        let:{"c":'$vendor_info.vendor_category'},
                        pipeline: [
                            { 
                                $match: {
                                    $expr:{
                                        $and:[
                                            {"$in": ["$id",'$$c']}
                                        ]
                                    }
                                }
                            },
                            { "$project": { _id:0,"name": 1}}
                            ],
                        as: 'vendor_category'
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
                        as: 'vendor_Setting'
                    }
                },
                {
                    $project: {
                        '_id': 0,
                        'role_master_tbl_id': '$role_master_tbl_id',
                        'vendor_info': '$vendor_info',
                        'logo_path': messages.HOST+''+messages.LOGO_IMAGE_URL,
                        'default_logo': messages.HOST+''+messages.DEAFULT_CATEGORY_IMAGE_URL,
                        'vendor_category': '$vendor_category',
                        'vendor_Setting': '$vendor_Setting',
                    }
                },
                { "$limit": 1 }
            ])

            if (storeSetting && storeSetting.length) {
                rt = storeSetting[0];
            }

            let store_cat = rt['vendor_category']
            let new_cat=[]
            store_cat.forEach((item,index)=>{
                new_cat.push(item['name'])
            })
            rt['vendor_category'] = new_cat
           
            //console.log( JSON.stringify( shipping, undefined, 2 ) );  
            res.json(new ApiResponse(rt));
           

        }catch (e) {
            console.log('err ' + e)
            next(e);
        }

    }

    static async similarVendor(req, res, next){

        try {
            const categoryId =  (typeof req.body.category_id != "undefined" && req.body.category_id != null) ? req.body.category_id : ''
            var vendor_id =  (typeof req.body.vendor_id != "undefined" && req.body.vendor_id != null) ? req.body.vendor_id : ''
            const distance = (typeof req.body.distance != "undefined" && req.body.distance != null) ? req.body.distance : 0
            const sort = (typeof req.body.sort != "undefined" && req.body.sort != null) ? req.body.sort : 0
            const skip = (typeof req.body.skip != "undefined" && req.body.skip != null) ? req.body.skip : 0
            const limit = (typeof req.body.limit != "undefined" && req.body.limit != null) ? req.body.limit : 1000
            const postcode = (req.body.postcode).replace(/ /g, '').substring(0, 4);

            var vendorPostcodeMatch = {}
            if (postcode!== "") {
                vendorPostcodeMatch = {$regexMatch:{ input: "$pincode",regex: postcode,options: 'i' } }
            }
            const condition =[
                {
                    $match: {
                        $and: [
                            {status:1},
                            {id:categoryId}
                        ]
                    }
                },
                {
                    $lookup:
                    {
                        from: 'vendor_info_master',
                        let: { id: "$id", user_hash_id: "$user_hash_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
    
                                        $and: [
                                            {$ne: ["$user_hash_id", vendor_id]},
                                            { $or: [ { $in: ["$$id", "$vendor_category"] } ] },
                                            { $or: [vendorPostcodeMatch]  }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'vendor_info'
                    }
                },
                { $unwind: "$vendor_info" },
                {
                    $lookup:
                    {
                        from: 'user_master',
                        let: { a: "$vendor_info.user_hash_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$hash", "$$a"] },
                                            { $eq: ["$role_master_tbl_id", 2] },
                                            { $eq: ["$status", 1] },
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'vendor'
                    }
                },
                { $unwind: "$vendor" },
                {
                    $lookup:
                    {
                        from: 'vendor_setting_master',
                        let: { b: '$vendor_info.user_hash_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user_hash_id", "$$b"] },
                                            { $eq: ["$close_shop", 0] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'vendorSetting'
                    }
                },
                { $unwind: "$vendorSetting" },
    
                {
                    $lookup:
                    {
                        from: 'vendor_category',
                        let: { c: '$vendor_info.vendor_category' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { "$in": ["$id", "$$c"] }
                                        ]
                                    }
                                }
                            },
                            { "$project": { _id: 0, "name": 1 } }
                        ],
                        as: 'vendor_category'
                    }
                },
    
                {
                    $project: {
                        '_id': 0,
                        'category_id': '$id',
                        'category_image': '$image',
                        'vendor_id': '$vendor_info.user_hash_id',
                        'vendor_name': '$vendor_info.vendor_name',
                        'vendor_phone': '$vendor_info.vendor_phone',
                        'vendor_address': '$vendor_info.address',
                        'vendor_city': '$vendor_info.city',
                        'category_name': '$vendor_category.name',
                        'restaurant_status': '$vendor.status',
                        'close_shop': '$vendorSetting.close_shop',
                        'close_msg': '$vendorSetting.close_msg',
                        'setting_id': '$vendorSetting.user_hash_id',
                        'distance_type': '$vendorSetting.distance_type',
                        'vendor_distance_coverd': '$vendorSetting.vendor_distance_coverd',
                       
                    }
                }
            ]

            let result = await VendorCategoryModel.aggregate([
                ...condition,
    
                {
                    $group: {
                        '_id': "$vendor_id",
                        'category_id': { '$push': '$category_id' },
                        "category_name": { "$first": "$category_name" },
                        "category_image": { "$push": "$category_image" },
                        "vendor_name": { "$first": "$vendor_name" },
                        "vendor_phone": { "$first": "$vendor_phone" },
                        "vendor_address": { "$first": "$vendor_address" },
                        "vendor_city": { "$first": "$vendor_city" },
                        "setting_id": { "$first": "$setting_id" },
                        "close_msg": { "$first": "$close_msg" },
                        "close_shop": { "$first": "$close_shop" },
                        "vendor_distance_type": { "$first": "$distance_type" },
                        "vendor_distance_coverd": { "$first": "$vendor_distance_coverd" },
                        
                    }
                },
                { $sort: { vendor_name: 1 } },
                { $skip: skip },
                { $limit: limit }
    
            ])
    
            // count result
            const count =  await VendorCategoryModel.aggregate([
                ...condition,
                {
                    $group: {
                        '_id': "$vendor_id",
                    }
                }
            ])
           // console.log( JSON.stringify( category, undefined, 2 ) );
            const data = {
                'totalRecord': count.length,
                result: result
            }
            res.json(new ApiResponse(data));

        } catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }
   
    static async  getAddresForOrder(){

        var condition ={status:1,hash:VendorController.addressId,user_hash_id:VendorController.userId}
        var projection ={_id:0,added_date:0,updated_date:0,added_date_timestamp:0,updated_date_timestamp:0,added_date_iso:0,updated_date_iso:0,__v:0}

        var getUserAddress = await UserAddressModel.findOne(condition,projection)
        if(typeof getUserAddress != "undefined" && getUserAddress != null){
            return getUserAddress
        }
        return {}
	}

    static async  getSerivce(){

        var condition = {status:1,hash:VendorController.serviceId}
        var projection ={_id:0,name:1,commission:1}
        var category = await VendorCategoryModel.findOne(condition,projection)
        return category
        
	}

    static async sendRequest(req, res, next){

        try {
        
            VendorController.userId =  (typeof req.body.user_id != "undefined" && req.body.user_id != null) ? req.body.user_id : ''
            VendorController.serviceId =  (typeof req.body.service_id != "undefined" && req.body.service_id != null) ? req.body.service_id : ''
            VendorController.email = (typeof req.body.email != "undefined" && req.body.email != null) ? req.body.email : ''
            VendorController.addressId = (typeof req.body.address_id != "undefined" && req.body.address_id != null) ? req.body.address_id : ''
            VendorController.description = (typeof req.body.description != "undefined" && req.body.description != null) ? req.body.description : ''
            VendorController.platform = (typeof req.body.platform != "undefined" && req.body.platform != null) ? req.body.platform : ''
            VendorController.vendors = (typeof req.body.vendors != "undefined" && req.body.vendors != null) ? req.body.vendors : []
            VendorController.visit_date = (typeof req.body.visit_date != "undefined" && req.body.visit_date != null) ? new Date(req.body.visit_date).getTime() : 0
            VendorController.visit_time = (typeof req.body.visit_time != "undefined" && req.body.visit_time != null) ? req.body.visit_time : '00:00:00'
            
            const address_detail = await VendorController.getAddresForOrder()	
            const serviceObj = await VendorController.getSerivce()	

            const hash =  Utils.randomAsciiString(32);
            var date = new Date();
            var today = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
            var rand =  Utils.randomAsciiString(6);
            let order_id = (Utils.randomAsciiString(3)+today+rand).toUpperCase()

            const data = {
                id: hash,
                order_id:order_id,
                user_id: VendorController.userId,
                service_id: VendorController.serviceId,
                service_name: serviceObj['name'],
                commission: serviceObj['commission'],
                visiting_charge: 0,
                email: VendorController.email,
                address_id: VendorController.addressId,
                address_detail: address_detail,
                description: VendorController.description,
                platform: VendorController.platform,
                location : {type : "Point", coordinates :[28.412894,77.311299]},
                vendors: VendorController.vendors,
                visit_date: VendorController.visit_date,
                visit_time: VendorController.visit_time,
                payment_remark: '',
                payment_status: 0,
                status: 1,
                added_date: new Date().toString(),
                updated_date:  new Date().toString(),
                added_date_timestamp:  Math.floor(Date.now()),
                updated_date_timestamp:  Math.floor(Date.now()),
                added_date_iso: new Date(),
                updated_date_iso: new Date(),
            };

            var saveRequest =  await new OrderModel(data).save();
            //var objectId = saveRequest._id
            let orderDetail = await VendorController.orderList(VendorController.userId,order_id,VendorController.vendors);
            await NodeMailer.OrderMail(orderDetail,VendorController.vendors)
            const sendData = {order_id:order_id}
            res.json(new ApiResponse(sendData));
        } catch (e) {
            console.log('err ' + e)
            next(e);
        }
    }

    static async  orderList(userId,orderId,vendors){
        //var orderId = 'IKT2022125BV5Q7B'
 
        var data = {}
        let orderDetail = await VendorController.orderDetail(orderId)
        if(orderDetail!= null && typeof orderDetail != "undefined" ){
            data['orderDetail'] = orderDetail
        }
 
        let userDetail = await VendorController.userDetail(userId)
        if(userDetail!= null && typeof userDetail != "undefined" ){
            data['userDetail'] = userDetail
        }
 
        let getInfo = await VendorController.getStoreInformation(vendors)
         if(getInfo!= null && typeof getInfo != "undefined" ){
            data['merchantInfo'] = getInfo
        }
        //console.log( JSON.stringify(  data, undefined, 2 ) ); 
        return data
         
         
    }

    static async orderDetail(orderId){
        var response =null

        var condition = { order_id: orderId }
        var projection = { _id: 0, added_date: 0, updated_date: 0, added_date_iso: 0,updated_date_iso:0,__v:0,postcode:0,address_id:0,id:0,user_id:0}
        let order = await OrderModel.findOne(condition, projection)
        if(order!= null && typeof order != "undefined" ){
            return order
        }
        return response

    }

    static async userDetail(userId){
        var response =null

        var condition = { hash: userId }
        var projection = { _id: 0, "name": 1, "email": 1, "mobile": 1, "mail_status": 1, "status": 1  }
        let order = await UserModel.findOne(condition, projection)
        if(order!= null && typeof order != "undefined" ){
            return order
        }
        return response

    }
    
    static async getStoreInformation(vendors){
        
        var projection = {_id: 0, "vendor_name": 1, "vendor_phone": 1, "contact_name": 1, "contact_phone": 1, "contact_email": 1, "address": 1, "pincode": 1}
        
        var condition ={user_hash_id:{$in:vendors}}
        return await InfoModel.find(condition,projection)
    }
}
