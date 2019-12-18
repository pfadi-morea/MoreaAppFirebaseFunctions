import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const db = admin.firestore();

export class UserMap{
    async deviceTokenUpdate(data:any, context: functions.https.CallableContext){
        const clientUID: string = data.UID
        const devToken: string = data.devToken
        let clientData: any = (await db.collection("user").doc(clientUID).get()).data()
        if(typeof clientData.devToken === undefined){
            clientData.devToken = [devToken]
        }else{
            const devTokenArray: Array<string> = clientData.devToken
            if(devTokenArray.includes(devToken))
            return

            devTokenArray.push(devToken)
            clientData.devToken = devTokenArray
        }
        return db.collection("user").doc(clientUID).set(clientData)
    }

}