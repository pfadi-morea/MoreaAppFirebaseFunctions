import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { GroupMap } from './groupMap';

const db = admin.firestore();

export class UserMap{
    async create(data:any, context: functions.https.CallableContext){
        return db.collection("user").doc(data.UID).create(data.content)
    }
    async update(data:any, context: functions.https.CallableContext){
        return db.collection("user").doc(data.UID).set(data)
    }

    async updateAllParents(data:any, context: functions.https.CallableContext){
        const elternList = data.elternList
        for(let elternUID of elternList){
            let elternUserMap = (await db.collection('user').doc(elternUID).get()).data()
            if(elternUserMap !== undefined){
                let elternKinderMap = elternUserMap['Kinder']
                elternKinderMap[data.vorname] = data.UID
                elternUserMap['Kinder'] = elternKinderMap
                await db.collection('user').doc(elternUID).update(elternUserMap)
            }
        }
        return null
    }

    async delete(data:any, context: functions.https.CallableContext){
        return db.collection('user').doc(data.UID).delete()
    }

    async deviceTokenUpdate(data:any, context: functions.https.CallableContext){
        const clientUID: string = data.UID
        const devtoken: string = data.devtoken
        let clientData: any = undefined
        do{
            clientData = (await db.collection("user").doc(clientUID).get()).data()
        }while(typeof clientData === undefined)
        
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
                const userDoc:any = dSuserDoc.data()
                userDoc["groupID"]= groupID
                return t.update(userDocRef, userDoc)
            }).catch((error)=>{
                console.error(error)
            })
        })
    }
    async makeLeiter(data: any, context: functions.https.CallableContext) {
        const requestString: string = data.request
        const requestRef:FirebaseFirestore.DocumentReference = db.collection("request").doc(requestString)
        const rawRequest: any = await requestRef.get()
        if(rawRequest.exists){
        const requestData = rawRequest.data()
        const clientRef:FirebaseFirestore.DocumentReference =db.collection("user").doc(requestData.UID)
        requestRef.delete().catch((e) => console.error(e))
        let clientData:any
        db.runTransaction(t=>{
            return t.get(clientRef).then((clientDoc)=>{
                clientData = clientDoc.data()
                clientData["Pos"] = "Leiter"
                return t.update(clientRef, clientData)
            }).catch((err)=> console.error(err))
        }).catch((err)=> console.error(err))
        clientData.groupID=data.groupID
        if("Pfadinamen" in clientData)
            clientData.DisplayName = clientData.Pfadinamen
        else
            clientData.DisplayName = clientData.Vorname
            const groupMap = new GroupMap()
            return groupMap.makeLeiter(clientData, context)
        }
        console.error("request wasn't generated")
        return Promise.resolve()
    }
}