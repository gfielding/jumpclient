<template>
	<div>
		<h2 class="mb-3">Job Skills</h2>
    <div class="flex mb-3 align-start" v-for="(job, index) in jobs" :key="job.id">
      <div class="inline" style="width:2.4rem;">
        <input class="mb-0 mt-2" type="checkbox" :id="index" :value="job" v-model="userProfile.skills"  @change="updateProfile()">
      </div>
      <div class="flex flex-column" style="width:calc(100% - 2.4rem);">
        <label :for="index">{{job.name}}</label>
        <p class="caption">
          {{job.description}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userProfile'],
  data: () => ({
    jobs: [
      {
        name: 'Stand Worker',
        description: 'Stand Workers work at concession stands at arenas, ballparks, concerts, and other large events. Responsibilities include working a POS machine (register), light food prep, and interacting with customers.'
      },
      {
        name: 'Server',
        description: 'Banquet servers, informally known as cater waiters, are wait staff that work for big catering events and banquets.Working with the catering staff, who prepare each course at the same time, banquet servers must make sure each course is delivered as quickly as possible. Banquet servers keep glasses filled, remove each round of plates and answer any questions from guests. Some banquets servers will have to take orders for each table, if there are multiple meal choices. After service, banquet servers are often responsible for clean up and breakdown of the service.'
      },
      {
        name: 'Professional Bartender',
        description: 'You must have completed bartending school and have experience as a bartender. You must be able to make cocktails on request. Typical bartending jobs will require a more formal uniform, such as slacks, dress shoes, a black button-down shirt, vest, and tie. You must be able to operate in a fast-paced, professional environment while cooperating with coworkers and making small talk with customers. You will usually be required to use point-of-sale software (POS) and be in charge of your own cash box. You will be generally expected to help set up and clean up your stations, as well as carry bags of ice and boxes of product.'
      },
      {
        name: 'Line Cook',
        description: 'Line cooks are employed by many restaurants and prepare much of the food that comes out of the kitchen. They work under a head chef or sous chef, and each line cook is typically assigned a particular place on the line, such as the grill, stove or vegetable prep area.'
      },
      {
        name: 'Fine Dining Server',
        description: 'Fine Dining Servers take food and beverage orders from customers, deliver written requests to the kitchen for preparation, carry items to the table in the proper order, help the bus staff as needed with the removal of finished plates, refill drinks and collect payment when the meal is over. Must be polished and professional.'
      },
      {
        name: 'Busser',
        description: 'Responsibilities include bussing tables, cleaning up, and general help for an event.'
      },
      {
        name: 'Beer and Wine Pourer',
        description: 'No formal training is required, but you Typical bartending jobs will required a more formal uniform, such as slacks, dress shoes, a black button-down shirt, a vest, and tie. You must be able to operate in a fast-paced, professional environment while cooperating with coworkers and making small talk with customers. You will be generally expected to help set up and clean up your stations, as well as carry bags of ice and boxes of product.'
      },
      {
        name: 'Bar-Back',
        description: 'A bar-back has many responsibilities, but their overall purpose is to make sure that things are running smoothly at the bar. Their duties can include anything from replacing bottles to preparing garnishes, cleaning spills, stocking ice, and keeping bar stations stocked at all times. They help with setup and breakdown.'
      },
    ]
  }),
  methods: {
    updateProfile(){
      let userProfile = this.userProfile
      this.$store.dispatch('updateUser', userProfile)
    },
  }
}
</script>