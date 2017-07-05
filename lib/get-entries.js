import db from './db'
import firebase from 'firebase'

export default async () => {
  var ref = firebase.database().ref('entries')
  const markers = ref.once('value')
    .then(function(dataSnapshot) {
      let entries = []

      dataSnapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key
        var childData = childSnapshot.val()
        console.log('childData', childData.position)
        entries.push({
          key: childKey,
          position: childData.position,
          audio: childData.audio
        })
      })

      return entries
    })

  return markers
}
