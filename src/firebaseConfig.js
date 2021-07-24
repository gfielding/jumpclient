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
const tipsCollection = db.collection('tips')
const foodCollection = db.collection('food')
const jobsCollection = db.collection('jobs')
const questionsCollection = db.collection('questions')
const mailCollection = db.collection('mail')
const eventsCollection = db.collection('events')
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
const placementsCollection = db.collection('placements')
const faqsCollection = db.collection('faqs')

export {
  db,
  auth,
  storageRef,
  firestore,
  currentUser,
  functions,
  usersCollection,
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
  placementsCollection,
  faqsCollection
}