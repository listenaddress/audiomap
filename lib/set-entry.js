import db from './db'
import firebase from 'firebase'

export default async (position, blob) => {
  let promise = new Promise((resolve, reject) => {
    var ref = firebase.database().ref('entries').push()
    var blobRef = firebase.storage().ref('blobs/' + ref.key)
    blobRef.put(blob).then(function(snapshot) {
      const audio = snapshot.a.downloadURLs[0]
      ref.set({ position, audio }).then(function(dataSnapshot) {
        resolve({ key: ref.key, audio, position })
      })
    })
  })

  return promise
}
