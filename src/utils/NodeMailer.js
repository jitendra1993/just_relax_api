import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';
import Mailer from '../models/Mailer.js';
import { CommonController } from '../controllers/CommonController.js';
import {messages}  from '../utils/Constant.js';
import moment from 'moment';


export class NodeMailer {
	
	
     // static initializeTransport() {
        // return nodeMailer.createTransport(SendGrid({
            // auth: {
                // api_key: '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'
            // }
        // }))
    // }
	
	static async mailInfo(){
		 const mail = await Mailer.findOne()
		 return mail
	}
	
	static  initializeTransport(host,port,username,password) {
		return nodeMailer.createTransport({
				host: host,
				port: port,
				secure:false,
				requireTLS:true,
				auth: {
				  user: username,
				  pass: password
				}
			});
	 }

    static  async sendEmail(to, subject, html) {
		
		const mailInfo = await NodeMailer.mailInfo()
		
		const host = mailInfo.mail_host
		const port = Number(mailInfo.mail_port)
		const username = mailInfo.mail_username
		const password = mailInfo.mail_password
        return  NodeMailer.initializeTransport(host,port,username,password).sendMail({
            from: 'abc@gmail.com',
            to: to,
            subject: subject,
            html: html
        });
    }
	
	static sendOtpOnMailRegistration(otp,email,username){
		
		let subject = "Verify email OTP";
		let message = `Dear ${username},<br><br>
		You registered an account on our portal, before being able to use your account you need to verify that this is your email address by enter OTP ${otp}. `;
		let to= email;
		NodeMailer.sendEmail(to, subject, message);
	}
	
	static sendOtpOnMailForgotPassword(otp,email,username){
		
		let subject = "Reset password OTP";
		let message = `Dear ${username},<br><br>
		As per your request , the One Time Password (OTP) for your reset password is  ${otp}. `;
		let to= email;
		NodeMailer.sendEmail(to, subject, message);
	}

	static addAddressMail(name,email,data){
		
		let subject = "Add new address";
		let message = `Dear ${name},<br><br>
		You have added new address successfully with following detail<br><br>
		Name:${data.name}<br>
		Mobile:${data.phoneNumber}<br>
		Postcode:${data.pincode}<br>
		Address line 1:${data.addressLine1}<br>
		Address line 2:${data.addressLine2}<br>
		Type:${(data.addressType==1)?'Home':'Office'}<br>

		`;
		let to= email;
		NodeMailer.sendEmail(to, subject, message);
	}

	// static async OrderMail(orderDetail,restaurantId){
	// 	let getInfo = await CommonController.getSingleStoreInformation(restaurantId)
	// 	let userDetail = orderDetail.userDetail
	// 	let orderItemDetail = orderDetail.orderItemDetail
	// 	let order = orderDetail.orderDetail
	// 	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	// 	var orderStatus = 'Not Paid'
	// 	var orderType = 'Collection'
	// 	let paymentType = order['payment_type']
	// 	let paymentStatus = Number(order['payment_status'])
	// 	let payment_id = (order['payment_id'])?order['payment_id']:''
	// 	let order_type =Number(order['order_type'])

	// 	if(paymentType==1){
	// 		orderStatus = 'Not Paid'

	// 	} else if(paymentType==2 && Number(paymentStatus)==1 && payment_id!=''){
	// 		orderStatus = 'Paid';

	// 	} else if(paymentType==2 && Number(paymentStatus)==2){
	// 		orderStatus = 'Pending'

	// 	}else if(paymentType==2 && Number(paymentStatus)==3)
	// 	{
	// 		orderStatus = 'Cancelled'
	// 	}

	// 	if(order_type==1){
	// 		orderType ='Collection'

	// 	}else if(order_type==2){
	// 		orderType ='Delivery'

	// 	}else if(order_type==3){
	// 		orderType ='Dinein'
	// 	}


	// 	//console.log( JSON.stringify(  order, undefined, 2 ) ); 
	// 	var message = `
	// 		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	// 		<html xmlns="http://www.w3.org/1999/xhtml">
	// 			<head>
	// 				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	// 				<title>${getInfo['merchant_name']}</title>
	// 				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	// 				<style type="text/css">
	// 				body{
	// 					margin: 0;
	// 					padding: 0;
	// 					font-family: arial, sans-sarif;
	// 				}
	// 				</style>
	// 			</head>
	// 			<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" bgcolor="#eeeeee">
	// 			<table width="730" align="center" bgcolor="#fff" border="0" cellpadding="0" cellspacing="0" height="100%">
	// 				<tbody>
	// 					<tr>
	// 						<td style="padding:10px 25px;">
	// 							<img src="${getInfo['mail_logo_url']}" style="width:130px; height:62px; float:left;" alt="s-epos" />
	// 							<ul style="float:right; list-style:none;">
	// 								<li style="float:left; margin:0px 5px;">
	// 									<h4 style="font-size: 14px;font-style: normal;letter-spacing: 0.4px;color: #333;margin: 9px 0px; font-weight:normal;"><span style="color:#fe4a52;">Ph :</span>${getInfo['contact_phone']?getInfo['contact_phone']:""}</h4>
	// 								</li>
	// 								<li style="float:left; margin:0px 5px;">
	// 									<h4 style="font-size: 14px;font-style: normal;letter-spacing: 0.4px;color: #333;margin: 9px 0px; font-weight:normal;"><span style="color:#fe4a52;">Mail :</span>${((getInfo['contact_email'])?getInfo['contact_email']:"")}</h4>
	// 								</li>
	// 							</ul>
	// 						</td>
	// 					</tr>
	// 					<tr><td></td></tr>
	// 					<tr>
	// 						<td>
	// 							<table width="715" align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 50px;text-align:center;background: #2b68d4;">
	// 								<tbody>
	// 									<tr>
	// 										<td style="background: #fff;padding: 10px 50px;">
	// 											<h2 style="font-size:24px; color:#444; letter-spacing:0.4px;">Dear ${((userDetail['name'])?userDetail['name']:"")}</h2>
	// 											<p style="font-size:14px; color:#777; letter-spacing:0.4px;">Thank you for your order from ${getInfo['merchant_name']} For your convenience, we have included a copy of your order below.</p>
	// 											<!--<a href="#"><button style="width:200px;height:40px;background:#fe4a52;color:#fff;border: none;border-radius: 10px;font-size: 17px;font-weight: 900;margin-bottom: 10px; cursor: pointer;">DOWNLOAD NOW!</button></a> -->
	// 										</td>
	// 									</tr>
	// 								</tbody>
	// 							</table>

	// 							<table width="100%" border="0" cellspacing="0" cellpadding="0">
	// 								<tbody>
	// 									<tr>
	// 										<td align="left" valign="top" style="background-color:#fff;padding:15px 20px;border:solid 1px #dbdfe6;background-image: url(pics.jpg);background-size: cover;">
	// 											<table width="100%" border="0" cellspacing="0" cellpadding="6" style="border:solid 1px #e4e6eb;">	     			 
	// 												<tbody>
	// 													<tr>
	// 														<td width="55%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;">
	// 														<strong>Particular</strong>
	// 														</td>
	// 														<td width="15%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;border-left:solid 1px #e4e6eb;"><strong>Unit Price</strong>
	// 														</td>
	// 														<td width="15%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;border-left:solid 1px #e4e6eb;"><strong>Qty</strong>
	// 														</td>
	// 														<td width="15%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;border-left:solid 1px #e4e6eb;"><strong>Amount</strong>
	// 														</td>
	// 													</tr>
	// 													<tr>
	// 														<td colspan="4" align="left" valign="middle" height="1" style="background-color:#e4e6eb;padding:0px;"><img id="1563533574496110001_imgsrc_url_1" width="1" height="1">
	// 														</td>
	// 													</tr>`
	// 													orderItemDetail.forEach(( singleItem, index)=>{
															
	// 														message+=`
	// 														<tr>
	// 															<td width="23%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><b>${singleItem['master_product'][0]['item_name']}</b></td>

	// 															<td width="27%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${messages.CURRENCY}${singleItem['price']}</td>
	// 															<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${singleItem['quantity']}</td>
	// 															<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${messages.CURRENCY}${(Number(singleItem['price'])*Number(singleItem['quantity'])).toFixed(2)}</td>
	// 														</tr>`
															
	// 														if(singleItem['special_instruction']  && singleItem['special_instruction']!=''){ 
	// 															message+=`
	// 															<tr>
	// 																<td width="23%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;padding-left: 30px;"><b>Special Instruction</b><br/>${singleItem['special_instruction']}</td>

	// 																<td width="27%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 															</tr>`
	// 														}

	// 														if(singleItem['master_ingredient']  && singleItem['master_ingredient']!='' && singleItem['master_ingredient'].length>0){ 
	// 															var ingredient = singleItem['master_ingredient'].map(function (el){return el.name}).join(',');
	// 															message+=`
	// 															<tr>
	// 																<td width="23%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;padding-left: 30px;"><b>Ingredient</b><br/>${ingredient}</td>

	// 																<td width="27%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">&nbsp;</td>

	// 															</tr>`
	// 														}
														 
	// 														singleItem['order_addon_item_detail'].forEach((singleSubItem)=>{
	// 															message +=` 
	// 															<tr>
	// 																<td width="23%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;padding-left: 30px;">-&nbsp;${singleSubItem['addon_item_name']}</td>

	// 																<td width="27%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${messages.CURRENCY}${singleSubItem['addon_price']}</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${singleSubItem['addon_quantity']}</td>

	// 																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">${messages.CURRENCY}${(Number(singleSubItem['addon_price'])*Number(singleSubItem['addon_quantity'])).toFixed(2)}</td>
	// 															</tr>`
	// 														})
	// 													})								
	// 													message +=
	// 												`</tbody>
	// 											</table>
	// 											<br><br>
	// 											<table width="100%" border="0" cellspacing="0" cellpadding="0">
	// 												<tbody>
	// 													<tr>
	// 														<td height="25" colspan="3" align="left" valign="top" style="    font-family: Arial,Helvetica,sans-serif;font-size: 15px;color: #4CAF50;border-bottom: solid 1px #dbdfe6;font-weight: 600;font-size: 20px;">
	// 														Order Details
	// 														</td>
	// 													</tr>

	// 													<tr>
	// 														<td colspan="3" align="left" valign="top">&nbsp;</td>
	// 													</tr>
	// 													<tr>
	// 														<td width="412" align="left" valign="top">
	// 															<table width="100%" border="0" cellspacing="0" 	cellpadding="4">		          
	// 																<tbody>
	// 																	<tr>
	// 																		<td width="30%" align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																		<strong>Customer:</strong>
	// 																		</td>

	// 																		<td width="70%" align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${((userDetail['name'])?userDetail['name']:"")}&nbsp;&nbsp;|&nbsp;&nbsp;
	// 																			<a href="mailto:${userDetail['email']}" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;" target="_blank">${userDetail['email']}</a>&nbsp;&nbsp;|&nbsp;&nbsp;${userDetail['mobile']}
	// 																		</td>
	// 																	</tr>

	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																			<strong>Store Name</strong>
	// 																		</td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${getInfo['merchant_name']}</td>
	// 																	</tr>

	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																			<strong>Order Id</strong>
	// 																		</td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['order_id']}</td>
	// 																	</tr>
									
	// 																	<tr><td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																			<strong>Order Date</strong>
	// 																		</td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${moment(order['added_date_timestamp']).format('DD-MM-YYYY')}</td>
	// 																	</tr>
									 
	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Payment Type :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${(order['payment_type']==1)?'CASH':'ONLINE'}</td>
	// 																	</tr>`
																		
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Platform :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['platform']}</td>
	// 																	</tr>`

	// 																	if(order['payment_type']==1 && order['order_change']!=''){
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Order Change :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['order_change']}</td>
	// 																	</tr>`
	// 																	}

	// 																	if(order['promocode']!=''){
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Used Promocode :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['promocode']}</td>
	// 																	</tr>`
	// 																	}

	// 																	if(order['loyalty_point_used']!='' && order['loyalty_point_used']>0){
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>No. of Loyalty Point Used :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['loyalty_point_used']}</td>
	// 																	</tr>`
	// 																	}

	// 																	if(order['loyalty_point_earn']!='' && order['loyalty_point_earn']>0){
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>No. of Loyalty Point Earn :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['loyalty_point_earn']}</td>
	// 																	</tr>`
	// 																	}

	// 																	if(order['delivery_time']!='' && order['delivery_time']!=null && (order_type==2 || order_type==1)){
	// 																		var nedate = `2015-06-17 ${order['delivery_time']}`
	// 																		var myDate = new Date(nedate);
	// 																		var del_time = moment(myDate).format("hh:mm A")
	// 																		message +=`
	// 																		<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>${(order_type==2)?'Delivery':'Collection'} Time :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${del_time}</td>
	// 																	</tr>`
	// 																	}
																		

	// 																	message +=`<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Payment Status :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${orderStatus}
	// 																		</td>
	// 																	</tr>
                                    
	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Order Type :</strong></td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${orderType}
	// 																		</td>
	// 																	</tr>`
																		
	// 																	if(order_type==2){

	// 																		let address_detail = order['address_detail']
	// 																		let rev_street = address_detail['addressLine1']+' , '+address_detail['addressLine2']
	// 																		let address_type = (address_detail['addressType']==1)?'Home':'Office'
	// 																		let rev_pincode = address_detail['pincode']
	// 																		message +=`
	// 																		<tr>
	// 																			<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Address :</strong></td>
	// 																			<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${rev_street},${rev_pincode}
	// 																			</td>
	// 																		</tr>`
	// 																	}
	// 																	if(order_type==3){
	// 																		message +=`
	// 																		<tr>
	// 																			<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Table number :</strong></td>
	// 																			<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['table_number']}
	// 																			</td>
	// 																		</tr>
																			
	// 																		<tr>
	// 																			<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Number of person :</strong></td>
	// 																			<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order['no_of_person']}
	// 																			</td>
	// 																		</tr>`
	// 																	}
	// 																	message +=`
	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">&nbsp;</td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">&nbsp;</td>
	// 																	</tr>

	// 																	<tr>
	// 																		<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">&nbsp;</td>
	// 																		<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																		</td>
	// 																	</tr>
	// 																</tbody>
	// 															</table>
	// 														</td>
	// 														<td width="20" align="left" valign="top">&nbsp;</td>	        
	// 														<td width="244" align="right" valign="top">
	// 															<table width="244" border="0" cellspacing="0" cellpadding="10">
	// 																<tbody>
	// 																	<tr>
	// 																		<td align="left" valign="top" style="background-color:#f7f7f7;border:solid 1px #e4e6eb;">
	// 																			<table width="244" border="0" cellspacing="0" cellpadding="0">
	// 																				<tbody>
	// 																					<tr>
	// 																						<td width="51%" height="19" align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							Gross Amount:&nbsp;
	// 																						</td>
	// 																						<td width="16%" height="19" align="center" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"> ${messages.CURRENCY}</td>
	// 																						<td width="33%" height="19" align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																						${messages.CURRENCY}${Number(order['sub_total']).toFixed(2)}</td>
	// 																					</tr>`
	// 																					if((order['discount']) && order[discount]>0){
	// 																						message +=`
	// 																						<tr>
	// 																							<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>Discount :&nbsp;</strong>
	// 																							</td>
	// 																							<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong> ${messages.CURRENCY}</strong>
	// 																							</td>
	// 																							<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>${Number(order['discount']).toFixed(2)}</strong>
	// 																							</td>
	// 																					   </tr>`
	// 																					}
	// 																					if((order['promocode_amt']) && order['promocode_amt']>0){
	// 																						message +=`
	// 																						<tr>
	// 																							<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>Voucher Discount :&nbsp;</strong>
	// 																							</td>
	// 																							<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong> ${messages.CURRENCY}</strong>
	// 																							</td>
	// 																							<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>${Number(order['promocode_amt']).toFixed(2)}</strong>
	// 																							</td>
	// 																					   </tr>`
	// 																					}

	// 																					if((order['loyalty_point_value']) && order['loyalty_point_value']>0){
	// 																						message +=`
	// 																						<tr>
	// 																							<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>Loyalty Point Discount :&nbsp;</strong>
	// 																							</td>
	// 																							<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong> ${messages.CURRENCY}</strong>
	// 																							</td>
	// 																							<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>${Number(order['loyalty_point_value']).toFixed(2)}</strong>
	// 																							</td>
	// 																					   </tr>`
	// 																					}
																						
	// 																					if(order_type==2){
	// 																						message +=`
	// 																						<tr>
	// 																							<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>Delivery Fee :&nbsp;</strong>
	// 																							</td>

	// 																							<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>${messages.CURRENCY} </strong>
	// 																							</td>

	// 																							<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																								<strong>${Number(order['delivery_fee']).toFixed(2)}</strong>
	// 																							</td>
	// 																						</tr>`
	// 																					}
	// 																					message +=`
	// 																					<tr>
	// 																						<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong>Service Charge:&nbsp;</strong>
	// 																						</td>
	// 																						<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong> ${messages.CURRENCY} </strong>
	// 																						</td>

	// 																						<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong>${Number(order['service_charge']).toFixed(2)}</strong>
	// 																						</td>
	// 																					</tr>
	// 																					<tr>
	// 																						<td height="22" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong>Net Payable:&nbsp;</strong>
	// 																						</td>
	// 																						<td height="20" align="center" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong> ${messages.CURRENCY}</strong>
	// 																						</td>
	// 																						<td height="20" align="right" valign="bottom" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																							<strong>${Number(order['grand_total']).toFixed(2)}</strong>
	// 																						</td>
	// 																					</tr>
	// 																				</tbody>
	// 																			</table>
	// 																		</td>
	// 																	</tr>
	// 																</tbody>
	// 															</table>
	// 														</td>
	// 													</tr>
	// 												</tbody>
	// 											</table>
	// 											<br> <br>
	// 											<table width="100%" border="0" cellspacing="0" cellpadding="0">
	// 												<tbody>
	// 													<tr>
	// 														<td height="25" align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0072c6;border-bottom:solid 1px #dbdfe6;">
	// 														Note :
	// 														</td>
	// 												   </tr>
	// 												   <tr>
	// 														<td align="left" valign="top">&nbsp;</td>
	// 												   </tr>
	// 													<tr>
	// 														<td width="412" align="left" valign="top">
	// 															<table width="100%" border="0" cellspacing="0" cellpadding="4">
	// 																<tbody>
	// 																	<tr>
	// 																		<td width="16%" align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																			<strong>Note :</strong>
	// 																		</td>
	// 																		<td width="84%" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
	// 																			${order['instruction']}
	// 																		</td>
	// 																	 </tr>
	// 																 </tbody>
	// 															 </table>
	// 														 </td>
	// 													</tr>
	// 												</tbody>
	// 											</table>
	// 											<br><br>
	// 											<table width="100%" border="0" cellspacing="0" cellpadding="0">
	// 												<tbody>
	// 													<tr>
	// 														<td height="1" align="left" valign="top" style="background-color:#e4e6eb;padding:0px;border-bottom:solid 1px #dbdfe6;" colspan="2">
	// 															<img id="1563533574496110001_imgsrc_url_2" width="1" height="1">
	// 														</td>
	// 														<td width="61%" align="right" valign="bottom">&nbsp;</td>
									
	// 														<td width="39%" align="left" valign="top"style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#373737;"><p>
	// 															<img id="1563533574496110001_imgsrc_url_3" width="180"><br><br>
	// 															<strong><a href="${getInfo['site_url']}" target="_blank">${getInfo['site_url']}</a></strong><br>  
	// 															<strong>${getInfo['address']}</strong><br>
	// 															Phone: ${getInfo['merchant_phone']}<br>	
	// 															Email: <a href="mailto:${getInfo['contact_email']}" target="_blank">${getInfo['contact_email']}</a><br>
	// 															Website: <a href="${getInfo['site_url']}" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#373737;text-decoration:underline;" target="_blank">${getInfo['site_url']}</a></p>
	// 														</td>
	// 													</tr>
	// 												</tbody>
	// 											</table>
	// 										</td>
	// 									</tr>
	// 								</tbody>
	// 							</table>
	// 						</td>
	// 					</tr>
	// 					<tr><td></td></tr>
	// 				</tbody>
	// 			</table>
	// 			</body>
	// 		</html>`
	// 	let subject  = "New Order - "+orderType
	// 	let to= userDetail['email'];
	// 	NodeMailer.sendEmail(to, subject, message);
	// }
}
