const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const twilio = require('twilio');
const db = admin.firestore();

const accountSid = 'ACae6e454d50d65803615c3949a0a32c95';
const authToken  = '75fb6e98a93d5973bbb25b5cc720e442';
const client = new twilio(accountSid, authToken);
const twilioNumber = '+14158765604'


exports.newVerify = functions.firestore
  .document('users/{id}').onUpdate((change, context) => {
  const afterData = change.after.data()
  const beforeData = change.before.data()

  if (afterData.phone == beforeData.phone) {
  	return null
  } else {
	  let phone = afterData.phone.replace(/[^0-9]+/g, "");
	  if ( !validE164(phone) ) {
	    throw new Error('number must be E164 format!')
	  }
	  return client.verify.services('VA9bd97992cc1a24a4bbcb41864727973f')
    	 .verifications
       .create({to: `+1` + phone, channel: 'sms'})
       .then(verification => console.log(verification.status));
  }
})

exports.newVerifyCheck = functions.firestore
  .document('users/{id}').onUpdate((change, context) => {
  const afterData = change.after.data()
  const beforeData = change.before.data()

  let phone = afterData.phone.replace(/[^0-9]+/g, "");
  let code = afterData.code
  let userId = afterData.id

  if (afterData.code == beforeData.code) {
  	return null
  } else {
  	return client.verify.services('VA9bd97992cc1a24a4bbcb41864727973f')
      .verificationChecks
      .create({to: `+1` + phone, code: code})
      .then(verification_check => 
      	admin.firestore().collection('users').doc(userId).update({
      		phoneVerified: verification_check.status
      	})
     );
  }
})


exports.newUser = functions.firestore
  .document('users/{id}').onCreate(snap => {
  const afterData = snap.data()
  if (afterData) {
    let name = afterData.firstName;
    let email = afterData.email;

    const mailObject = {
       to: afterData.email,
       message: {
        subject: `Welcome to MVP Event Staffing ${name}!`,
        text: 'Welcome to MVP Event Staffing',
        html: `<html>
                <head>
                  <meta name="viewport" content="width=device-width" />
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>MVP Email</title>
                  <style>
                    /* -------------------------------------
                        GLOBAL RESETS
                    ------------------------------------- */
                    
                    /*All the styling goes here*/
                    
                    img {
                      border: none;
                      -ms-interpolation-mode: bicubic;
                      max-width: 100%; 
                    }

                    body {
                      background-color: #f6f6f6;
                      font-family: sans-serif;
                      -webkit-font-smoothing: antialiased;
                      font-size: 14px;
                      line-height: 1.4;
                      margin: 0;
                      padding: 0;
                      -ms-text-size-adjust: 100%;
                      -webkit-text-size-adjust: 100%; 
                    }

                    table {
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      width: 100%; }
                      table td {
                        font-family: sans-serif;
                        font-size: 14px;
                        vertical-align: top; 
                    }

                    /* -------------------------------------
                        BODY & CONTAINER
                    ------------------------------------- */

                    .body {
                      background-color: #efefef;
                      width: 100%; 
                    }

                    /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                    .container {
                      display: block;
                      margin: 0 auto !important;
                      /* makes it centered */
                      max-width: 580px;
                      padding: 10px;
                      width: 580px; 
                    }

                    /* This should also be a block element, so that it will fill 100% of the .container */
                    .content {
                      box-sizing: border-box;
                      display: block;
                      margin: 0 auto;
                      max-width: 580px;
                      padding: 10px; 
                    }

                    /* -------------------------------------
                        HEADER, FOOTER, MAIN
                    ------------------------------------- */
                    .main {
                      background: #ffffff;
                      border-radius: 3px;
                      width: 100%; 
                    }

                    .wrapper {
                      box-sizing: border-box;
                      padding: 20px; 
                    }

                    .content-block {
                      padding-bottom: 10px;
                      padding-top: 10px;
                    }

                    .footer {
                      clear: both;
                      margin-top: 10px;
                      text-align: center;
                      width: 100%; 
                    }
                      .footer td,
                      .footer p,
                      .footer span,
                      .footer a {
                        color: #999999;
                        font-size: 12px;
                        text-align: center; 
                    }

                    /* -------------------------------------
                        TYPOGRAPHY
                    ------------------------------------- */
                    h1,
                    h2,
                    h3,
                    h4 {
                      color: #000000;
                      font-family: sans-serif;
                      font-weight: 800;
                      line-height: 1.4;
                      margin: 0;
                      margin-bottom: 15px; 
                    }

                    h1 {
                      font-size: 35px;
                      font-weight: 300;
                      text-align: center;
                      text-transform: capitalize; 
                    }

                    p,
                    ul,
                    ol {
                      font-family: sans-serif;
                      font-size: 14px;
                      font-weight: normal;
                      margin: 0;
                      margin-bottom: 10px; 
                    }
                      p li,
                      ul li,
                      ol li {
                        list-style-position: inside;
                        margin-left: 5px; 
                    }

                    ul, ol {
                      padding-inline-start: 0px;
                    }

                    ol li {
                      margin-bottom:10px;
                    }

                    a {
                      color: #0d3fd1;
                      text-decoration: underline; 
                    }

                    /* -------------------------------------
                        BUTTONS
                    ------------------------------------- */
                    .btn {
                      box-sizing: border-box;
                      width: 100%; }
                      .btn > tbody > tr > td {
                        padding-bottom: 15px; }
                      .btn table {
                        width: auto; 
                    }
                      .btn table td {
                        background-color: #ffffff;
                        border-radius: 5px;
                        text-align: center; 
                    }
                      .btn a {
                        background-color: #ffffff;
                        border: solid 1px #0d3fd1;
                        border-radius: 5px;
                        box-sizing: border-box;
                        color: #0d3fd1;
                        cursor: pointer;
                        display: inline-block;
                        font-size: 14px;
                        font-weight: bold;
                        margin: 0;
                        padding: 12px 25px;
                        text-decoration: none;
                        text-transform: capitalize; 
                    }

                    .btn-primary table td {
                      background-color: #0d3fd1; 
                    }

                    .btn-primary a {
                      background-color: #0d3fd1;
                      border-color: #0d3fd1;
                      color: #ffffff; 
                    }

                    /* -------------------------------------
                        OTHER STYLES THAT MIGHT BE USEFUL
                    ------------------------------------- */
                    .last {
                      margin-bottom: 0; 
                    }

                    .first {
                      margin-top: 0; 
                    }

                    .align-center {
                      text-align: center; 
                    }

                    .align-right {
                      text-align: right; 
                    }

                    .align-left {
                      text-align: left; 
                    }

                    .clear {
                      clear: both; 
                    }

                    .mt0 {
                      margin-top: 0; 
                    }

                    .mb0 {
                      margin-bottom: 0; 
                    }

                    .mb20 {
                      max-width:80%;
                      margin:auto;
                      margin-bottom: 15px; 
                    }

                    .mb10 {
                      margin-bottom:20px;
                    }

                    .preheader {
                      color: transparent;
                      display: none;
                      height: 0;
                      max-height: 0;
                      max-width: 0;
                      opacity: 0;
                      overflow: hidden;
                      mso-hide: all;
                      visibility: hidden;
                      width: 0; 
                    }

                    .powered-by a {
                      text-decoration: none; 
                    }

                    hr {
                      border: 0;
                      border-bottom: 1px solid #f6f6f6;
                      margin: 20px 0; 
                    }

                    /* -------------------------------------
                        RESPONSIVE AND MOBILE FRIENDLY STYLES
                    ------------------------------------- */
                    @media only screen and (max-width: 620px) {
                      table[class=body] h1 {
                        font-size: 28px !important;
                        margin-bottom: 10px !important; 
                      }
                      table[class=body] p,
                      table[class=body] ul,
                      table[class=body] ol,
                      table[class=body] td,
                      table[class=body] span,
                      table[class=body] a {
                        font-size: 16px !important; 
                      }
                      table[class=body] .wrapper,
                      table[class=body] .article {
                        padding: 10px !important; 
                      }
                      table[class=body] .content {
                        padding: 0 !important; 
                      }
                      table[class=body] .container {
                        padding: 0 !important;
                        width: 100% !important; 
                      }
                      table[class=body] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important; 
                      }
                      table[class=body] .btn table {
                        width: 100% !important; 
                      }
                      table[class=body] .btn a {
                        width: 100% !important; 
                      }
                      table[class=body] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important; 
                      }
                    }

                    /* -------------------------------------
                        PRESERVE THESE STYLES IN THE HEAD
                    ------------------------------------- */
                    @media all {
                      .ExternalClass {
                        width: 100%; 
                      }
                      .ExternalClass,
                      .ExternalClass p,
                      .ExternalClass span,
                      .ExternalClass font,
                      .ExternalClass td,
                      .ExternalClass div {
                        line-height: 100%; 
                      }
                      .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important; 
                      }
                      #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                      }
                      .btn-primary table td:hover {
                        background-color: #0d3fd1 !important; 
                      }
                      .btn-primary a:hover {
                        background-color: #0d3fd1 !important;
                        border-color: #0d3fd1 !important; 
                      } 
                    }

                  </style>
                </head>
                <body class="">
                  <span class="preheader">Welcome to MVP Event Staffing!</span>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                    <tr>
                      <td>&nbsp;</td>
                      <td class="container">
                        <div class="content">

                          <!-- START CENTERED WHITE CONTAINER -->
                          <table role="presentation" class="main">

                            <!-- START MAIN CONTENT AREA -->
                            <tr>
                              <td class="wrapper">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td>
                                      <img src="https://firebasestorage.googleapis.com/v0/b/mvpes-25aef.appspot.com/o/MVPTriangleText.svg?alt=media&token=518da9ea-28e1-4f7c-9d89-fc13c303c62b" alt="MVP Festival and Event Staffing" width="40%" height="auto" margin="auto" border="0" class="mb20" style="border:0; outline:none; text-decoration:none; display:block;">
                                    </td>
                                  </tr>
                                  
                                  <tr>
                                    <td>
                                      <h2>Welcome to MVP Event Staffing!</h2>
                                      <p>Here are the next steps:</p>
                                      <ol class="mb10">
                                        <li>Please complete your <a href="https://mvpeventstaffing.com/dashboard/profile" target="_blank">profile</a>, including uploading any certifications and documentation that you have. Make sure your cell phone number is correct because we frequently use text messages to communicate.</li>
                                        <li>We will reach out to schedule an in-person or phone interview.</li>
                                        <li>We will be posting events for 2021 shortly.</li>
                                        <li>Follow us on <a href="https://www.instagram.com/mvpeventstaffing/" target="_blank">Instagram</a>.</li>
                                        <li>Follow us on <a href="https://www.facebook.com/mvpeventstaffing/" target="_blank">Facebook</a>.</li>
                                      </ol>
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                        <tbody>
                                          <tr>
                                            <td align="center">
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                  <tr>
                                                    <td> <a href="https://mvpeventstaffing.com/login" target="_blank">Get Started</a> </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p>Thank you!</p>
                                      <p>- The MVP Event Staffing Team</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                          <!-- END MAIN CONTENT AREA -->
                          </table>
                          <!-- END CENTERED WHITE CONTAINER -->

                          <!-- START FOOTER -->
                          <div class="footer">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td class="content-block">
                                  <span class="apple-link">MVP Event Productions, LLC, 160 Alamo Plaza, Unit #486, Alamo, CA 94507</span>
                                </td>
                              </tr>
                            </table>
                          </div>
                          <!-- END FOOTER -->

                        </div>
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                  </table>
                </body>
              </html>`,
      }
    }
    return admin.firestore().collection('mail').add(mailObject);
  } else {
    return null
  }
})


function validE164(num) {
  return /^\+?[1-9]\d{1,14}$/.test(num)
}