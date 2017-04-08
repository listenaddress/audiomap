import firebase from 'firebase'
import firebaseConfig from './firebase-config'

console.log('here');
try {
  firebase.initializeApp(firebaseConfig)
} catch (err) {
  console.log('err', err);
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

const root = firebase
  .database()
  .ref('v0')

export default root
