import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { GroupMap } from './groupMap';

const db = admin.firestore();

export class ParentPendAccept {

    async writeParentUserData(childUserData: any, parentUserData: any) {
        const childName: string = childUserData.Vorname
        const childUID: string = childUserData.UID
        const parentUID: string = parentUserData.UID
        const newData = parentUserData

        if (typeof newData.Kinder === "undefined") {
            newData.Kinder = { [childUID]: childName }
        }
        else {
            newData.Kinder[childUID] = childName
        }
        if (typeof newData.subscribedGroups === "undefined"){
            newData.subscribedGroups = [childUserData.groupID]
        } else {
            newData.subscribedGroups.add(childUserData.groupID)
        }
        return await db.collection("user").doc(parentUID).set(newData)
    }
     async writeChildUserData(childUserData:any, parentUserData:any){
        const parentUID:string = parentUserData.UID;
        const parentName:string = parentUserData.Vorname;
        const childUID:string = childUserData.UID
        const childData = childUserData
        if(typeof childData.Elten === "undefined"){
            childData.Eltern = {[parentUID] : parentName}
        }else{
            childData.Eltern[parentUID] = parentName
        }
        return await db.collection("user").doc(childUID).set(childData)
     }
     async deleteRequest(requestString: string){
        await db.collection("request").doc(requestString).delete()
     }

    async accept(Tdata: any, context: functions.https.CallableContext) {
        const requestString: string = Tdata.request
        const rawRequest: any = await db.collection("request").doc(requestString).get()
        if(rawRequest.exists){
        const requestData = rawRequest.data()
        const childUserData: any = (await db.collection("user").doc(requestData.UID).get()).data();
        const parentUserData: any = (await db.collection("user").doc(Tdata.UID).get()).data();
        await this.deleteRequest(requestString)
        console.log("pend parent: "+ parentUserData.UID + " and child: "+ childUserData.UID)
        await this.writeChildUserData(childUserData, parentUserData);
        await this.writeParentUserData(childUserData, parentUserData);  
        const groupMap = new GroupMap
        return groupMap.priviledgeEltern({'UID': parentUserData.UID, 'groupID': childUserData.groupID, 'DisplayName': parentUserData.Vorname}, context)
        }
        console.error("request wasn't generated")
        return Promise.resolve()
    }


}