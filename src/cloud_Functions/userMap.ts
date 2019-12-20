import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const db = admin.firestore();

export class UserMap{
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

}