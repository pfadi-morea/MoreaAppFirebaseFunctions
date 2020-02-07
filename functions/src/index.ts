import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
admin.initializeApp()
import {Cloud_Teleblitz} from './cloud_Teleblitz'
export {Cloud_Teleblitz} from './cloud_Teleblitz'
import {ChildPendRequest} from './cloud_Functions/childPendRequest'
export {ChildPendRequest} from './cloud_Functions/childPendRequest'
import {ParentPendAccept} from './cloud_Functions/parendPendRequest'
import { Account } from './cloud_Functions/account'
import { UserMap } from './cloud_Functions/userMap'
import { GroupMap} from './cloud_Functions/groupMap'
import { ChildUserMap } from './cloud_Functions/childUserMap'
export {ParentPendAccept} from './cloud_Functions/parendPendRequest'

//const db = admin.firestore();

export const anmeldungTeleblitz = functions.firestore.
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
})
export const deleteUser = functions.firestore
    .document('user/{userID}')
    .onDelete(async (snap, context) => {
        const test = await admin.auth().getUser(snap.id)
        if(test !== undefined){
            return admin.auth().deleteUser(snap.id)
          .then(() => console.log('Deleted user with ID:' + snap.id))
          .catch((error) => console.error('There was an error while deleting user:', error));
        } else {
            return null
        }
    });
export const createAccount = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const accont = new Account
    return accont.create(data)
})
export const uploadDevTocken = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const userMap = new UserMap
    return userMap.deviceTokenUpdate(data, context)
})
export const updateUserProfile = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const userMap = new UserMap
    return userMap.update(data, context)
})

export const goToNewGroup = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const groupMap = new GroupMap;
    return groupMap.goToNewGroup(data, context)
})
export const priviledgeTN = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const groupMap = new GroupMap;
    return groupMap.priviledgeTN(data, context)
})
export const makeLeiter = functions.https.onCall(async (data:any, context: functions.https.CallableContext)=>{
    const groupMap = new GroupMap;
    return groupMap.makeLeiter(data, context)
})
export const createChildUserMap = functions.https.onCall(async (data:any, context: functions.https.CallableContext) => {
    const childusermap = new ChildUserMap
    return childusermap.create(data, context)
})

export const priviledgeEltern = functions.https.onCall(async (data:any, context: functions.https.CallableContext) => {
    const groupMap = new GroupMap
    return groupMap.priviledgeEltern(data, context)
})

export const createUserMap = functions.https.onCall(async (data:any, context: functions.https.CallableContext) => {
    const userMap = new UserMap
    return userMap.create(data, context)
})