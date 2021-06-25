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

function validE164(num) {
  return /^\+?[1-9]\d{1,14}$/.test(num)
}