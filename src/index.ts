import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
admin.initializeApp()
import {Cloud_Teleblitz} from './cloud_Teleblitz'
export {Cloud_Teleblitz} from './cloud_Teleblitz'

//const db = admin.firestore();

export const anmeldungTeleblitz = functions.firestore.
document("events/{eventID}/Anmeldungen/{anmeldeUID}").onWrite((change, context)=>{
    const tlbz = new Cloud_Teleblitz
    return tlbz.initfunction(change, context)
})
export const deleteUser = functions.firestore
    .document('user/{userID}')
    .onDelete((snap, context) => {
      return admin.auth().deleteUser(snap.id)
          .then(() => console.log('Deleted user with ID:' + snap.id))
          .catch((error) => console.error('There was an error while deleting user:', error));
    });