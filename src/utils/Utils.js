
import crypto from 'crypto';
import Password from 'node-php-password';
//import * as Multer from 'multer';

// const storageOptions =
    // Multer.diskStorage({
        // destination: function (req, file, cb) {
            // cb(null, './src/uploads')
        // },
        // filename: function (req, file, cb) {
            // cb(null, file.originalname);
        // }
    // });
	
	
function randomString(length, chars) {
	  if (!chars) {
		throw new Error('Argument \'chars\' is undefined');
	  }

	  const charsLength = chars.length;
	  if (charsLength > 256) {
		throw new Error('Argument \'chars\' should not have more than 256 characters'
		  + ', otherwise unpredictability will be broken');
	  }

	  const randomBytes = crypto.randomBytes(length);
	  let result = new Array(length);

	  let cursor = 0;
	  for (let i = 0; i < length; i++) {
		cursor += randomBytes[i];
		result[i] = chars[cursor % charsLength];
	  }

	  return result.join('');
	}
		
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export class Utils {
    MAX_TOKEN_TIME = 600000;
	
	static randomAsciiString(length) {
	  return randomString(length,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
	}


   // public multer = Multer({storage: storageOptions, fileFilter: fileFilter});

    static generateVerificationToken(size = 5) {
        let digits = '0123456789';
        let otp = '';
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }

    static encryptPassword(password){
        return Password.hash(password);
        
    }

    static async comparePassword(plainPassword, encryptedPassword){
        return new Promise(((resolve, reject) => {
			if(Password.verify(plainPassword, encryptedPassword)){
			  resolve(true);
			}else{
			    reject(new Error('Old Password Does not Match'));
			}
        }))
    }

    static getTimeIndex(){
        var weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        var today = new Date();
        var dayOfWeek = weekday[today.getDay()]
        var dayArr = {'Mon':0,'Tue':1,'Wed':2,'Thu':3,'Fri':4,'Sat':5,'Sun':6}
        return dayArr[dayOfWeek]
    }

    static checkRestrictedStatus(restricted_hour_from,restricted_hour_to){
        var d = new Date();
        var m = d.getMinutes();
        var h = d.getHours();
        
        if(h<10){
            h='0'+h
        } 
        if(m<10){
            m='0'+m
        }
        var currentTime = h+':'+m

        var from_time = restricted_hour_from.split(":");
        var from_hour = from_time[0]
        var from_minute = from_time[1]
        

        if(from_hour<10 && from_hour.length==1){
            from_hour='0'+from_hour
        } 
        if(from_minute<10 && from_hour.length==1){
            from_minute='0'+from_minute
        }
        var restrictedHourFrom = from_hour+':'+from_minute

        var to_time = restricted_hour_to.split(":");
        var to_hour = to_time[0]
        var to_minute = to_time[1]

        if(to_hour<10 && from_hour.length==1){
            to_hour='0'+to_hour
        } 
        if(to_minute<10 && from_hour.length==1){
            to_minute='0'+to_minute
        }
        var restrictedHourTo = to_hour+':'+to_minute
        
        if (currentTime < restrictedHourFrom && currentTime > restrictedHourTo) {
            return 0
        }
        return 1
    }
	
	// var myDate = new Date("2015-06-17 14:24:36");
    // console.log(moment(myDate).format("YYYY-MM-DD HH:mm:ss"));
    // console.log("Date: "+moment(myDate).format("YYYY-MM-DD"));
    // console.log("Year: "+moment(myDate).format("YYYY"));
    // console.log("Month: "+moment(myDate).format("MM"));
    // console.log("Month: "+moment(myDate).format("MMMM"));
    // console.log("Day: "+moment(myDate).format("DD"));
    // console.log("Day: "+moment(myDate).format("dddd"));
    // console.log("Time: "+moment(myDate).format("HH:mm")); // Time in24 hour format
    // console.log("Time: "+moment(myDate).format("hh:mm A"));
    // moment(order['added_date_timestamp']).format('DD-MM-YYYY')
   // https://momentjs.com/
	// static async comparePassword(password: { plainPassword, encryptedPassword}){
        // return new Promise(((resolve, reject) => {
            // Bcrypt.compare(password.plainPassword, password.encryptedPassword, ((err, isSame) => {
                // if (err) {
                    // reject(err);
                // } else if (!isSame) {
                    // reject(new Error('User and Password Does not Match'));
                // } else {
                    // resolve(true);
                // }
            // }))
        // }))
    // }
}
