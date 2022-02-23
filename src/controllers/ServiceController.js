import { Utils } from '../utils/Utils.js';
import { ApiResponse } from '../ApiResponse.js';
import VendorCategoryModel from '../models/VendorCategory.js';
import { decode } from 'html-entities';
import {messages}  from '../utils/Constant.js';
//import SettingModel from '../models/RestaurantSetting.js';
//import CategoryModel from '../models/Category.js';


export class ServiceController {

    static async list(req, res, next) {
      
        const textSearch = (typeof req.body.textSearch != "undefined" && req.body.textSearch != null) ?(req.body.textSearch).trim():'';
        const isFront = (typeof req.body.isFront != "undefined" && req.body.isFront != null) ? req.body.isFront.toString(): ''
        const sort = (typeof req.body.sort != "undefined" && req.body.sort != null) ? req.body.sort : 0
        const skip = (typeof req.body.skip != "undefined" && req.body.skip != null) ? req.body.skip : 0
        const limit = (typeof req.body.limit != "undefined" && req.body.limit != null) ? req.body.limit : 1000

        try {
            var condition ={}
            condition['status'] = 1

            if (textSearch!== "" && textSearch != null ) {
                condition["name"] = { $regex: textSearch, $options: 'i' }
                 
             }
             
             if (isFront!== "" && isFront != null) {
                let front = isFront.split(',').map(function (el){return Number(el)})
                condition["on_front"] = { $in:[...front] }
                 
             } 
          
            const projection = {_id:0,id:1,name:1,description:1,image:1,commission:1,on_front:1}
            const category = await VendorCategoryModel.find(condition,projection).skip(skip).limit(limit).sort( { name: 1 } )

            const decodeCategory = await Promise.all(
                category.map(async (element,array,index)=>{
                    const name = decode(element.name, { level: 'html5' });
                    const description = decode(element.description, { level: 'html5' });
                    if(element.image){
                        var image = messages.HOST+''+messages.CATEGORY_IMAGE_URL+''+element.image;
                    }else{
                        var image = messages.HOST+''+messages.DEAFULT_CATEGORY_IMAGE_URL;
                    }
                    
                    return { id: element.id, name: name,description:description,image:image,commission:element.commission,on_front:element.on_front }
                })
            )
            
            const categoryCnt = await VendorCategoryModel.countDocuments(condition)
            

            const data = {
                'totalRecord': categoryCnt,
                result: decodeCategory
            }

            res.json(new ApiResponse(data));

        } catch (e) {
            console.log('err ' + e)
            next(e);
        }

    }

   

    
}
