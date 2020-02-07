import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { DocumentReference } from '@google-cloud/firestore';
const db = admin.firestore();

export class Priviledge{
    async tNPriviledge(data: any, context: functions.https.CallableContext):Promise<void>{
        const childUID:string = data.UID
        const childDisplayName:string = data.displayName
        const childGoupID:string = data.groupID

        const groupDoc:DocumentReference = db.collection("groups").doc(childGoupID)
        return db.runTransaction(t =>{
            return t.get(groupDoc).then(doc =>{
                if(doc.exists){
                    const ddata= doc.data()
                    if(ddata !==undefined)
                    if("Priviledge" in ddata){
                        const priviledge = doc.data()!.Priviledge
                        priviledge[childUID] ={"DisplayName": childDisplayName, "Priviledge": 1}
                        t.update(groupDoc, {"Priviledge" : priviledge})
                    }else{
                        t.update(groupDoc, {"Priviledge":{[childUID]:{"DisplayName": childDisplayName, "Priviledge": 1}}})
                    }
                }
                
                
            })
        })
    }
    async leiterPriviledge(data: any, context: functions.https.CallableContext):Promise<void>{
        const childUID:string = data.childUID
        const childDisplayName:string = data.displayName
        const childGoupID:string = data.groupID

        const groupDoc:DocumentReference = db.collection("groups").doc(childGoupID)
        return db.runTransaction(t =>{
            return t.get(groupDoc).then(doc =>{
                t.update(groupDoc, {[childUID]:{"DisplayName": childDisplayName, "Priviledge": 3}})
            })
        })
    }
}