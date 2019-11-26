import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
admin.initializeApp()
import {Cloud_Teleblitz} from './cloud_Teleblitz'
export {Cloud_Teleblitz} from './cloud_Teleblitz'
<<<<<<< HEAD
import {ChildPendRequest} from './cloud_Functions/childPendRequest'
export {ChildPendRequest} from './cloud_Functions/childPendRequest'
import {ParentPendAccept} from './cloud_Functions/parendPendRequest'
export {ParentPendAccept} from './cloud_Functions/parendPendRequest'
=======
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4

//const db = admin.firestore();

export const anmeldungTeleblitz = functions.firestore.
<<<<<<< HEAD
document("events/{eventID}/Anmeldungen/{anmeldeUID}").onWrite(async (change, context)=>{
    const tlbz = new Cloud_Teleblitz
    return await tlbz.initfunction(change, context)
})
export const childPendRequest = functions.https.onCall(async (data:any, context: functions.https.CallableContext) => {
    const request = new ChildPendRequest
    return await request.request(data, context)
})
export const parendPendAccept = functions.https.onCall(async (data:any, context: functions.https.CallableContext) => {
    const accept = new ParentPendAccept
    return await accept.accept(data, context)
=======
document("events/{eventID}/Anmeldungen/{anmeldeUID}").onWrite((change, context)=>{
    const tlbz = new Cloud_Teleblitz
    return tlbz.initfunction(change, context)
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4
})
export const deleteUser = functions.firestore
    .document('user/{userID}')
    .onDelete((snap, context) => {
      return admin.auth().deleteUser(snap.id)
          .then(() => console.log('Deleted user with ID:' + snap.id))
          .catch((error) => console.error('There was an error while deleting user:', error));
    });