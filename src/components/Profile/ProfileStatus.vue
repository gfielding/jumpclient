<template>
	<div>
    <h2>Employee Status:</h2>
    <div class="mb-3 mt-1 flex align-center" v-if="user && user.payrollSubmitted">
<i class="fa-solid fa-circle-check fa-2x mr-2"  style="color: #f0ad4e;"></i>
      <span class="caption bold">Onboarding Started - {{submitted | moment("dddd, MMMM Do YYYY") }}</span>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['user'],
  // data: () => ({
  //   encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
  //   empStatuses: ['applied', 'payroll invitation', 'signed offer letter', 'hired', 'not-hired', 'on-hold', 'terminated'],
  //   positions: ['regular staff', 'shift-lead', 'assistant manager', 'manager', 'admin'],
  //   showButton2: false,
  //   showButton3: false,
  //   performingRequest: false,
  // }),
  computed: {
    // empNum() {
    //   return this.user.id.slice(0,10)
    // },
    // decryptedText() {
    //   if (this.user && this.user.ssn) {
    //   return (this.$CryptoJS.AES.decrypt(this.user.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
    //   }
    // },
    submitted() {
      return new Date(this.user.payrollSubmittedStamp.seconds*1000)
    }
  },
  methods: {
    onCopy: function (e) {
      alert('Copied to Clipboard')
    },
    // updateUser () {
    // 	this.performingRequest = true
    // 	let user = this.user
    //   if (user.employeeStatus == `hired` || user.employeeStatus == 'signed offer letter') {
    //     console.log(this.empNum)
    //     user.employeeNumber = this.user.id.slice(0,10)
    //   }
    //   this.$store.dispatch('updateUser', user)
    //   setTimeout(() => {
    //       this.showButton2 = false
    //       this.showButton3 = false
    //       this.performingRequest = false
    //   }, 500)
    // },
    // updateUserFile1 () {
    //   this.performingRequest = true
    //   let user = this.user
    //   user.fileId = user.id.slice(0,8)
    //   this.$store.dispatch('updateUser', user)
    //   setTimeout(() => {
    //       this.showButton2 = false
    //       this.showButton3 = false
    //       this.performingRequest = false
    //   }, 500)
    // },
    // updateUserFile2 () {
    //   this.performingRequest = true
    //   let user = this.user
    //   user.fileId = user.id.slice(0,10)
    //   this.$store.dispatch('updateUser', user)
    //   setTimeout(() => {
    //       this.showButton2 = false
    //       this.showButton3 = false
    //       this.performingRequest = false
    //   }, 500)
    // },
    // cancelEmpUpdate() {
    // 	setTimeout(() => {
    //       this.showButton2 = false
    //   }, 500)
    // },
    // cancelPosUpdate() {
    // 	setTimeout(() => {
    //       this.showButton3 = false
    //   }, 500)
    // },
    // opr() {
    //   let user = this.user
    //   console.log(user)
    //   fb.oprCollection.add(user)
    //   .then(
    //     doc => {
    //       console.log(doc)
    //       fb.oprCollection.doc(doc.id).update({
    //         id: doc.id, 
    //         created: fb.firestore.FieldValue.serverTimestamp(),
    //       })
    //     }
    //   )
    //   this.$store.dispatch('updateUser', {
    //     id: user.id,
    //     opr: true
    //   })
    // },
    // removeopr() {
    //   let user = this.user
    //   this.$store.dispatch("removeUserOpr", user)
    // },
  },
  beforeDestroy () {
  	// this.showButton2 = false
  	// this.showButton3 = false
  	// delete this.showButton2
  	// delete this.showButton3
  	// this.performingRequest = false
  	// delete this.performingRequest
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>