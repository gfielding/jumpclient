import firebase from 'firebase/app';

require("firebase/auth")
require("firebase/storage")
require("firebase/firestore")
require("firebase/functions")
require("firebase/analytics")
require("firebase/performance")

const firebaseConfig = {
  apiKey: "AIzaSyA2Zh7agJPBfwU_VX4rHYazUqrFBWEfuuU",
  authDomain: "mvpes-25aef.firebaseapp.com",
  projectId: "mvpes-25aef",
  storageBucket: "mvpes-25aef.appspot.com",
  messagingSenderId: "79524683437",
  appId: "1:79524683437:web:e7f9512195f1e011aa3024",
  measurementId: "G-1JQ4GHY4GZ"
}
firebase.initializeApp(firebaseConfig);
firebase.analytics()
firebase.performance()
firebase.firestore().enablePersistence()

const db = firebase.firestore()
const firestore = firebase.firestore
const auth = firebase.auth()
const storageRef = firebase.storage().ref()
const currentUser = auth.currentUser
const functions = firebase.functions()


const usersCollection = db.collection('users')
const oldUsersCollection = db.collection('oldUsers')
const tipsCollection = db.collection('tips')
const foodCollection = db.collection('food')
const jobsCollection = db.collection('jobs')
const questionsCollection = db.collection('questions')
const mailCollection = db.collection('mail')
const eventsCollection = db.collection('events')
const seriesCollection = db.collection('series')
const seriesDaysCollection = db.collection('seriesDays')
const venuesCollection = db.collection('venues')
const applicationsCollection = db.collection('applications')
const venueFollowersCollection = db.collection('venueFollowers')
const eventStaffCollection = db.collection('eventStaff')
const eventDaysCollection = db.collection('eventDays')
const userDaysCollection = db.collection('userDays')
const noticesCollection = db.collection('notices')
const assignmentsCollection = db.collection('assignments')
const leadsCollection = db.collection('leads')
const shiftsCollection = db.collection('shifts')
const clientsCollection = db.collection('clients')
const smsCollection = db.collection('sms')
const smsUpdatesCollection = db.collection('smsUpdates')
const emailUpdatesCollection = db.collection('emailUpdates')
const textsCollection = db.collection('texts')
const emailsCollection = db.collection('emails')
const userNotesCollection = db.collection('userNotes')
const faqsCollection = db.collection('faqs')
const oprCollection = db.collection('opr')
const mgrsCollection = db.collection('mgrs')
const eventTimesheetNotesCollection = db.collection('eventTimesheetNotes')
const accountingNotesCollection = db.collection('accountingNotes')
const coprCollection = db.collection('copr')
const payHelpCollection = db.collection('payHelp')
const groupsCollection = db.collection('groups')
const groupNotesCollection = db.collection('groupNotes')
const reviewsCollection = db.collection('reviews')
const userMessagesCollection = db.collection('userMessages')
const exportLogCollection = db.collection('exportLog')
const placementsLogCollection = db.collection('placementsLog')
const venueLogCollection = db.collection('venueLog')
const eventLogCollection = db.collection('eventLog')
const shiftUpdatesCollection = db.collection('shiftUpdates')
const groupUpdatesCollection = db.collection('groupUpdates')
const dropsCollection = db.collection('drops')
const contactsCollection = db.collection('contacts')
const contactNotesCollection = db.collection('contactNotes')
const clientNotesCollection = db.collection('clientNotes')
const referralsCollection = db.collection('referrals')
const idtriggerCollection = db.collection('idtrigger')
const pageTextCollection = db.collection('pageText')
const clientAccessCollection = db.collection('clientAccess')
const accessNotesCollection = db.collection('accessNotes')
const checkInMasterCollection = db.collection('checkInMaster')
const verificationsCollection = db.collection('verifications')
const tagsCollection = db.collection('tags')
const marketsCollection = db.collection('markets')
const marketingLeadsCollection = db.collection('marketingLeads')
const leadApplicationsCollection = db.collection('leadApplications')
const payrollSubmissionsCollection = db.collection('payrollSubmissions')
const weeksCollection = db.collection('weeks')

export {
  db,
  auth,
  storageRef,
  firestore,
  currentUser,
  functions,
  usersCollection,
  oldUsersCollection,
  tipsCollection,
  foodCollection,
  jobsCollection,
  questionsCollection,
  mailCollection,
  eventsCollection,
  venuesCollection,
  applicationsCollection,
  venueFollowersCollection,
  eventDaysCollection,
  eventStaffCollection,
  userDaysCollection,
  noticesCollection,
  assignmentsCollection,
  leadsCollection,
  shiftsCollection,
  clientsCollection,
  smsCollection,
  smsUpdatesCollection,
  emailUpdatesCollection,
  textsCollection,
  emailsCollection,
  userNotesCollection,
  userMessagesCollection,
  exportLogCollection,
  placementsLogCollection,
  venueLogCollection,
  eventLogCollection,
  faqsCollection,
  seriesCollection,
  seriesDaysCollection,
  oprCollection,
  accountingNotesCollection,
  mgrsCollection,
  coprCollection,
  payHelpCollection,
  groupsCollection,
  groupNotesCollection,
  reviewsCollection,
  dropsCollection,
  shiftUpdatesCollection,
  groupUpdatesCollection,
  contactsCollection,
  contactNotesCollection,
  clientNotesCollection,
  referralsCollection,
  idtriggerCollection,
  pageTextCollection,
  clientAccessCollection,
  accessNotesCollection,
  checkInMasterCollection,
  eventTimesheetNotesCollection,
  verificationsCollection,
  tagsCollection,
  marketsCollection,
  marketingLeadsCollection,
  leadApplicationsCollection,
  payrollSubmissionsCollection,
  weeksCollection
}