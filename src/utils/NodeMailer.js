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

	static async OrderMail(orderDetail,vendorsIds){
		
		let setting  =  await CommonController.internalAdminSetting()
		let getInfo = setting.vendor_info
		let userDetail = orderDetail.userDetail
		var order_detail = orderDetail.orderDetail
		var merchantInfo = orderDetail.merchantInfo
		let order_id = order_detail.order_id
		let service_name = order_detail.service_name
		let visit_date = moment(order_detail.visit_date).format("DD-MMM-YYYY")
		let visit_time = order_detail.visit_time
		let from_email = order_detail.email
		let user_address_detail = order_detail.address_detail
		let description = order_detail.description
		let platform = order_detail.platform
		var myDate = new Date("2015-06-17 "+visit_time);
		visit_time = moment(myDate).format('LTS')

		//console.log(getInfo)

		
		var message = `
			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml">
				<head>
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
					<title>Just relax</title>
					<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
					<style type="text/css">
						body{
							margin: 0;
							padding: 0;
							font-family: arial, sans-sarif;
						}
					</style>
				</head>
				<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" bgcolor="#eeeeee">
					<table width="730" align="center" bgcolor="#fff" border="0" cellpadding="0" cellspacing="0" height="100%">
						<tbody>
							<tr>
								<td style="padding:10px 25px;">
									<img src="${getInfo['mail_logo_url']}" style="width:130px; height:62px; float:left;" alt="s-epos" />
									<ul style="float:right; list-style:none;">
										<li style="float:left; margin:0px 5px;">
												<h4 style="font-size: 14px;font-style: normal;letter-spacing: 0.4px;color: #333;margin: 9px 0px; font-weight:normal;"><span style="color:#fe4a52;">Ph :</span>  ${getInfo['contact_phone']?getInfo['contact_phone']:""}</h4>
										</li>
										<li style="float:left; margin:0px 5px;">
												<h4 style="font-size: 14px;font-style: normal;letter-spacing: 0.4px;color: #333;margin: 9px 0px; font-weight:normal;"><span style="color:#fe4a52;">Mail :</span>${((getInfo['contact_email'])?getInfo['contact_email']:"")}</h4>
										</li>
									</ul>
								</td>
							</tr>
							<tr><td></td></tr>
							<tr>
								<td>
									<table width="715" align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 10px;text-align:center;background: #ed3237;">
										<tbody>
											<tr>
												<td style="background: #fff;padding: 10px 50px;">
													<h2 style="font-size:24px; color:#444; letter-spacing:0.4px;">Dear ${((userDetail['name'])?userDetail['name']:"")}</h2>
													<p style="font-size:14px; color:#777; letter-spacing:0.4px;">Thank you.</p>
													<!--<a href="#"><button style="width:200px;height:40px;background:#fe4a52;color:#fff;border: none;border-radius: 10px;font-size: 17px;font-weight: 900;margin-bottom: 10px; cursor: pointer;">DOWNLOAD NOW!</button></a> -->
												</td>
											</tr>
										</tbody>
									</table>

									<table width="100%" border="0" cellspacing="0" cellpadding="0">
										<tbody>
											<tr>
												<td align="left" valign="top" style="background-color:#fff;padding:15px 20px;border:solid 1px #dbdfe6;background-image: url(pics.jpg);background-size: cover;">
													<table width="100%" border="0" cellspacing="0" cellpadding="6" style="border:solid 1px #e4e6eb;">	     			 
														<tbody>
															<tr>
																<td width="55%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;">
																	<strong>Services Name</strong>
																</td>
																<td width="15%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;border-left:solid 1px #e4e6eb;"><strong>Date</strong>
																</td>
																<td width="15%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;background-color:#f7f7f7;border-left:solid 1px #e4e6eb;"><strong>Time</strong>
																</td>
															</tr>
						
															<tr>
																<td colspan="4" align="left" valign="middle" height="1" style="background-color:#e4e6eb;padding:0px;">
																	<img id="1563533574496110001_imgsrc_url_1" width="1" height="1">
																</td>
															</tr>
															<tr>
																<td width="23%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																	${service_name}
																</td>
																
																<td width="27%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">
																${visit_date}
																</td>
																<td width="22%" height="18" align="left" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;border-left:solid 1px #e4e6eb;">
																	${visit_time}
																</td>
															</tr>
														</tbody>
              										</table>
              		      							<br><br>
             										<table width="100%" border="0" cellspacing="0" cellpadding="0">
             											<tbody>
                											<tr>
                    											<td height="25" colspan="3" align="left" valign="top" style="font-family: Arial,Helvetica,sans-serif;font-size: 15px; color: #4CAF50;border-bottom: solid 1px #dbdfe6;font-weight: 600;font-size: 20px;">
                        											Customer Details
                        										</td>
                    										</tr>
															<tr>
																<td colspan="3" align="left" valign="top">&nbsp;</td>
															</tr>
															<tr>
																<td width="412" align="left" valign="top">
																	<table width="100%" border="0" cellspacing="0" cellpadding="4">		          
																		<tbody>
																			<tr>
																				<td width="30%" align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																					<strong>Customer:</strong>
																				</td>
																				<td width="70%" align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																				${((userDetail['name'])?userDetail['name']:"")} &nbsp;&nbsp;|&nbsp;&nbsp;
																				</td>
																			</tr>
                                      
																			<tr>
																				<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																					<strong>Order Id</strong>
																				</td>
																				<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${order_id}</td>
																			</tr>
									
																			<tr>
																				<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																					<strong>Order Date</strong>
																				</td>
																				<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${moment(order_detail['added_date_timestamp']).format('DD-MM-YYYY')}</td>
																			</tr>
									 
																			<tr></tr>
																			<tr></tr>
                                    
																			<tr>
																				<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;"><strong>Order Description</strong></td>
																				<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">${description}</td>
																			</tr>
																			<tr>
																				<td align="right" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">&nbsp;</td>
																				<td align="left" valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#373737;">
																				</td>
																			</tr>
																		</tbody>
																	</table>
                      											</td>
																<td width="20" align="left" valign="top">&nbsp;</td>	        
																<td width="244" align="right" valign="top"></td>
															</tr>
                 										</tbody>
             										</table>
             										<br> <br>
													<table width="100%" border="0" cellspacing="0" cellpadding="0">
														<tr>	
															<td></td>
														</tr>
													</table>	
       	  											<br><br>
													<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>
                								</td>
           									</tr>
        								</tbody>
    								</table>
								</td>
							</tr>
							<tr><td></td></tr>
						</tbody>
					</table>
				</body>
			</html>`
		let subject  = "New Request - "+userDetail['name']+' '+service_name
	 	let to = userDetail['email'];

		 merchantInfo.forEach((element,index)=>{
			var email = element.contact_email
			NodeMailer.sendEmail(email, subject, message);
			//console.log(email)
		 })

		var admin_email = getInfo.contact_email
	 	NodeMailer.sendEmail(admin_email, subject, message);

		var subject1 = "New Request "+' '+service_name;
		let message1 = `Dear ${userDetail['name']},<br><br>
		You enquiry has been successfully sent. `;
		let to1= from_email;
		NodeMailer.sendEmail(to1, subject1, message1);
	}
}
