<template>
	<div class="pt-3">
		<div class="dashboard__container--body">
      <div class="dashboard__container--body--col">
      	<div class="mb-3">
          <label for="description">Upload File:</label>
          <input type="text" v-model.trim="description" id="description" placeholder="description" />
          <input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">
          <progress :value="uploadValue" max="100" v-if="showBar"></progress>
			    <div>
			      <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUpload">Upload</button>
			    </div>
        </div>
      </div>
    </div>
    <div class="dashboard__container--body">
    	<div style="width:100%;" v-if="client && client.files">
				<vue-good-table
		      :columns="columns"
		      :rows="client.files"
		      
		      :pagination-options="{
		        enabled: true,
		        mode: 'records',
		        perPage: 10,
		      }"
		    >
		     <template slot="table-row" slot-scope="props">
		     		
		        <span v-if="props.column.field == 'url'">
		        	<a :href="props.row.url" target="_blank">
		        		<i class="fas fa-external-link"></i>
		        	</a>
		        </span>

		      </template>

		      
		    </vue-good-table>
			</div>
    </div>

		<!-- <h3>Client Files</h3>
		<input class="mt-3" type="file" ref="fileInputTip" accept="image/*,application/pdf,.doc" @change="previewImage">

    <progress :value="uploadValue" max="100" v-if="showBar"></progress>
    <div>
      <button v-if="imageData != null" class="btn btn__primary mt-3" @click="onUpload">Upload</button>
    </div> -->
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'
import router from '@/router'
const fb = require('../../firebaseConfig.js')

export default {
	name: 'clientFiles',
  data: () => ({ 
    imageData: null,
    uploadValue: 0,
    showBar:false,
    description: '',
    columns: [
    	{	
      	label: 'Description',
        field: 'description',
      },
      {
        label: 'Link',
        field: 'url',
        width: '132px',
      }
    ],
  }),
  computed: {
    ...mapState(['clientInfo', 'userProfile']),
    client() {
      return this.clientInfo
    },
  },
  methods: {
    previewImage(event) {
      this.uploadValue=0;
      this.imageData=event.target.files[0]
    },
    onUpload() {
      this.showBar = true
      let client = this.client
      let description = this.description

      // client.certTips=null

      let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      let storageRef = fb.storageRef.child('docs/' + rand).put(this.imageData);
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error => {console.log(error.message)},
      () => {this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url) => {

          // userProfile.certTips=url
          this.$store.dispatch('addClientFile', {
          	url: url,
          	description: description,
          	client: client
          })
          // this.$store.dispatch('updateUser', userProfile)
        })
        this.showBar = false
      })
      this.imageData = null
      this.description = ''
      this.$refs.fileInputTip.value=null
    },
  }
}
</script>