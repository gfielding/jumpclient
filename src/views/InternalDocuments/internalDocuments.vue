<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <!-- <Loader v-if="!internalDocuments" /> -->
      <div class="dashboard__container--header">
        <h1>Expected Deliverables from Staffing Managers</h1>
        <button class="btn btn__flat" @click="goBack">
          <i class="fas fa-arrow-left fa-2x"></i>
        </button>
      </div>
      <div class="dashboard__container--body">
        <div class="dashboard__container--body--col" style="width:100%;">
          <h2>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeWvZpURTLwGPF6i3tP4BX6TbCwASvXacFC98klMnt1l9EBSg/viewform"
              >Event Recap Form (Incident Form included)</a
            >
          </h2>
          <p>
            Please complete within 3 days of the event. Only one is needed for
            multiple day events. These will be saved in a shared folder on the
            drive. Email Kaela and Cory if any incidents occurred. Including
            anyone blacklisted, injured, if the order was not fulfilled, or for
            any other noteworthy abnormalities at the event. This does not have
            to be in grave detail but is a requirement for all events with over
            15 staff.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/1MNshzVq3g5GqDVYd6p9PEYmbX5u5SxswbI8XhFy-O4c/"
              >Marketing Strategy Form</a
            >
          </h2>
          <p>
            To be completed by EOD Wednesdays weekly. Submissions are received
            by Kaela.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeWvZpURTLwGPF6i3tP4BX6TbCwASvXacFC98klMnt1l9EBSg/viewform"
              >Event Recap Form (link to Incident Form included)</a
            >
          </h2>
          <p>
            Please complete within 3 days of the event.
          </p>
          <br />
          <h2>
            <a href="/groups">Groups</a>
          </h2>
          <p>
            User groups in admin should be reviewed weekly on non-event days.
            Add all new hires from previous week.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/spreadsheets/d/1zfSDIrA-oj4nR8CYqMRx43FFUp65QCcsbMCTpkkI_5U/edit#gid=0"
              >Payroll Venue Info</a
            >
          </h2>
          <p>
            Every new venue needs to be added to this document, with all
            positions. Updates to rates must be changed immediately upon
            notification of the change. Contact Katy with questions or notes.
          </p>
          <br />
          <h2>
            <a
              href="https://drive.google.com/drive/u/0/folders/1qYWp0-i5hzMURQAH8tuWijp0D0dNLfaz"
              >Timesheets</a
            >
          </h2>
          <p>
            Once timesheets are received managers have 24 hours to look over
            them and ensure accuracy. Make note of missing employees, missing
            tip amounts, inaccurate or missing clock in and out times, position
            changes, and rate discrepancies. If for any reason this cannot be
            completed in 24 hours of receipt contact operations for assistance.
            Please advise the payroll department immediately of any errors.
            Often we are able to add to the timesheet prior to invoicing. Upload
            all timesheets to the appropriate folder on the shared drive.
            Finally, once timesheets are entered into the system review the
            entry for any potential errors.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeDa1f8potwhFIAV1frtc3cCJntHE4Z0k2nE1740eDrTzsG_w"
              >Incident Report Form</a
            >
          </h2>
          <p>
            Required for any workplace violations on-site. To be submitted in
            conjunction with Event Recap Form within 3 days of the event. See
            Tai with questions.
          </p>
          <br />
          <h2>
            <a
              href="https://drive.google.com/drive/u/0/folders/14LpLKKpGJ5ZVf3QJMaL_gnKa8Ol0lltq"
              >Peoplease Employee Injury</a
            >
          </h2>
          <p>
            Medical Incidents, follow these steps. Complete an internal incident
            report as well. See Tai with questions.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/1p3U0bAZeoJ-RTga7e9YZGcHPPmtrR2QO_Zo-OU0_56M"
              >Purchase Request Form</a
            >
          </h2>
          <p>
            Submit before the purchase for any marketing needs, or purchases
            necessary when traveling to events that exceed $50/day. Any
            questions regarding marketing (ads) or travel purchase requests send
            to Kaela. Send all other purchase requests to Cory.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/1EBte-ozUjU13KX-3wk3mENt7fxVvxDUZcpbeTXv6YcA"
              >Reimbursement Form</a
            >
          </h2>
          <p>
            For approved expenses, please submit and upload ALL receipts.
            Expenses without receipts are subject to disapproval. Please
            complete within 3 days of event. Katy can confirm when it will be
            deposited with your payroll.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/1W82NkG_Trqp-cCj2zrMeOjK0LRLwhUX29rnzEMBkpis"
              >Time Off Request Form</a
            >
          </h2>
          <p>
            To be submitted as soon as possible when employee is aware of PTO
            needs. See Form and Handbook for full PTO policy.
          </p>
          <br />
          <h2>
            <a
              href="https://docs.google.com/forms/d/1XOYsjT0eq62ak3TD-Xj8p4dAxdhmNY5BVbp0GNea6MI"
              >IT Support Form - for Event Staff Troubleshooting</a
            >
          </h2>
          <p>
            If you cannot help staff with their IT questions send this form.
            Submissions are received by KP and Victoria.
          </p>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import router from "@/router";

export default {
  name: 'internalDocuments',
  components: {
    Loader
  },
  beforeDestroy() {}
};
</script>
