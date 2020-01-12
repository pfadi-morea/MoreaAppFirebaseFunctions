import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const db = admin.firestore();

export class UserMap{
    async update(data:any, context: functions.https.CallableContext){
        return db.collection("user").doc(data.UID).set(data)
    }
    async deviceTokenUpdate(data:any, context: functions.https.CallableContext){
        const clientUID: string = data.UID
        const devtoken: string = data.devtoken
        let clientData: any = (await db.collection("user").doc(clientUID).get()).data()
        if(!("devtoken" in clientData)){
            clientData["devtoken"] = [devtoken]
        }else{
            const devtokenArray: Array<string> = clientData.devtoken
            if(devtokenArray.includes(devtoken))
            return

            devtokenArray.push(devtoken)
            clientData["devtoken"] = devtokenArray
        }
        return db.collection("user").doc(clientUID).set(clientData)
    }
    async groupIDUpdate(data:any, context: functions.https.CallableContext){
        const userUID:string = data.UID
        const groupID:string = data.groupID

        const userDocRef:FirebaseFirestore.DocumentReference = db.collection("user").doc(userUID)
        return db.runTransaction(t =>{
            return t.get(userDocRef).then((dSuserDoc)=>{
                let userDoc:any = dSuserDoc.data()
                userDoc["groupID"]= groupID
                return t.update(userDocRef, userDoc)
            }).catch((error)=>{
                console.error(error)
            })
        })
    }
}