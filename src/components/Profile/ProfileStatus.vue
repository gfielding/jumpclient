<template>
	<div>
    <h2>Onboarding Status:</h2>
    <!-- <div class="mb-3" v-if="decryptedText">
      <label for="ssn">Social Security Number:</label>
      <input style="width: 100%;" v-mask="'###-##-####'" placeholder="###-##-####" :value="decryptedText" type="text" maxlength = "11" id="ssn" readonly  />
    </div> -->
    <div class="mb-3">
			<label for="emp">Employee Status:</label>
      <select v-model="user.employeeStatus" id="emp" @change="showButton2 = true">
        <option v-for="item in empStatuses" v-bind:value="item" :key="item">
          {{item}}
        </option>
      </select>
		</div>
		<transition name="fade">
      <div class="flex align-center justify-space-between mb-3" v-if="showButton2">
        <button class="btn btn__primary" @click="updateUser()">
          update
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__outlined" @click="cancelEmpUpdate()">
          cancel changes
        </button>
      </div>
    </transition>

    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `hired`">
	      <label for="hireDate">Hire Date:</label>
	      <input type="date" placeholder="" v-model.trim="user.hireDate" id="hireDate" @change="updateUser()" />
	    </div>
	  </transition>
    <div class="mb-3" v-if="user.hireDate && user.employeeStatus == `hired || user.employeeStatus == 'signed offer letter'`">
			<label for="position">Position:</label>
      <select v-model="user.position" id="position" @change="showButton3 = true">
        <option v-for="item in positions" v-bind:value="item" :key="item">
          {{item}}
        </option>
      </select>
		</div>
		<transition name="fade">
      <div class="flex align-center justify-space-between mb-3" v-if="showButton3">
        <button class="btn btn__primary" @click="updateUser()">
          update
          <transition name="fade">
            <span class="ml-2" v-if="performingRequest">
            <i class="fa fa-spinner fa-spin"></i>
            </span>
          </transition>
        </button>
        <button class="btn btn__outlined" @click="cancelPosUpdate()">
          cancel changes
        </button>
      </div>
    </transition>



    <hr v-if="user.employeeStatus == `hired` || user.employeeStatus == `terminated` || user.employeeStatus == 'signed offer letter'">
    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `hired` || user.employeeStatus == `terminated` || user.employeeStatus == 'signed offer letter'">
	      <label for="empNum">OnPay Employee Number:</label>
	      <input type="text" v-model.trim="user.employeeNumber" id="empNum" @change="updateUserFile2()" />
        <button class="btn btn__outlined btn__small mt-3" v-clipboard:copy="user.employeeNumber" v-clipboard:success="onCopy">Copy <i class="fas fa-copy ml-2"></i></button>
	    </div>
	  </transition>
	  
	  <hr v-if="user.employeeStatus == `terminated`">
    <transition name="fade">
	    <div class="mb-3" v-if="user.employeeStatus == `terminated`">
	      <label for="terminationDate">Termination Date:</label>
	      <input type="date" placeholder="" v-model.trim="user.terminationDate" id="terminationDate" @change="updateUserHired()" />
	    </div>
	  </transition>
    <div v-if="!user.employeeStatus || user.employeeStatus == 'applied'">
      <button v-if="!user.opr || user.opr == false" class="btn btn__outlined mt-5" @click="opr()">Request OnPay Employee Setup</button>

      <button v-if="user.opr" class="btn btn__flat btn__outlined mt-5" disabled>OnPay Setup Requested</button>
    </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../../firebaseConfig.js')

export default {
  props: ['user'],
  data: () => ({
    encryptionKey: 'SKD433{}{[SKD433{}{[SKD433{}{[32',
    empStatuses: ['applied', 'payroll invitation', 'signed offer letter', 'hired', 'not-hired', 'on-hold', 'terminated'],
    positions: ['regular staff', 'shift-lead', 'assistant manager', 'manager', 'admin'],
    showButton2: false,
    showButton3: false,
    performingRequest: false,
  }),
  computed: {
    empNum() {
      return this.user.id.slice(0,10)
    },
    decryptedText() {
      if (this.user && this.user.ssn) {
      return (this.$CryptoJS.AES.decrypt(this.user.ssn, this.encryptionKey).toString(this.CryptoJS.enc.Utf8) || this.$CryptoJS.AES.encrypt(this.ssn, this.encryptionKey).toString())
      }
    }
  },
  methods: {
    onCopy: function (e) {
      alert('Copied to Clipboard')
    },
    updateUser () {
    	this.performingRequest = true
    	let user = this.user
      if (user.employeeStatus == `hired` || user.employeeStatus == 'signed offer letter') {
        console.log(this.empNum)
        user.employeeNumber = this.user.id.slice(0,10)
      }
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    updateUserFile1 () {
      this.performingRequest = true
      let user = this.user
      user.fileId = user.id.slice(0,8)
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    updateUserFile2 () {
      this.performingRequest = true
      let user = this.user
      user.fileId = user.id.slice(0,10)
      this.$store.dispatch('updateUser', user)
      setTimeout(() => {
          this.showButton2 = false
          this.showButton3 = false
          this.performingRequest = false
      }, 500)
    },
    cancelEmpUpdate() {
    	setTimeout(() => {
          this.showButton2 = false
      }, 500)
    },
    cancelPosUpdate() {
    	setTimeout(() => {
          this.showButton3 = false
      }, 500)
    },
    opr() {
      let user = this.user
      console.log(user)
      fb.oprCollection.add(user)
      .then(
        doc => {
          console.log(doc)
          fb.oprCollection.doc(doc.id).update({
            id: doc.id, 
            created: fb.firestore.FieldValue.serverTimestamp(),
          })
        }
      )
      this.$store.dispatch('updateUser', {
        id: user.id,
        opr: true
      })
    },
    removeopr() {
      let user = this.user
      this.$store.dispatch("removeUserOpr", user)
    },
  },
  beforeDestroy () {
  	this.showButton2 = false
  	this.showButton3 = false
  	delete this.showButton2
  	delete this.showButton3
  	this.performingRequest = false
  	delete this.performingRequest
    this.$store.dispatch('clearUserState')
    this.$store.dispatch('clearErrors')
  }
}
</script>