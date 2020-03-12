import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export class ChildUserMap{
    async create(data:any, context: functions.https.CallableContext){
        const newDocumentRef = await db.collection("user").add(data)
        const id: string = newDocumentRef.id
        data['childUID'] = id
        await newDocumentRef.update(data)
        return id
    }
}