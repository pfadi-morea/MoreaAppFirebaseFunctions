import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const db = admin.firestore();

export class ParentPendAccept {

    async writeParentUserData(childUserData: any, parentUserData: any) {
        const childName: string = childUserData.Vorname
        const childUID: string = childUserData.UID
        const parentUID: string = parentUserData.UID
        let newData = parentUserData

        if (typeof newData.Kinder === "undefined") {
            newData.Kinder = { [childName]: childUID }
        }
        else {
            newData.Kinder[childName] = childUID
        }
        return await db.collection("user").doc(parentUID).set(newData)
    }
     async writeChildUserData(childUserData:any, parentUserData:any){
        const parentUID:string = parentUserData.UID;
        const parentName:string = parentUserData.Vorname;
        const childUID:string = childUserData.UID
        let childData = childUserData
        if(typeof childData.Elten === "undefined"){
            childData.Eltern = {[parentName] : parentUID}
        }else{
            childData.Eltern[parentName] = parentUID
        }
        return await db.collection("user").doc(childUID).set(childData)
     }

    async accept(Tdata: any, context: functions.https.CallableContext) {
        const requestString: string = Tdata.request
        const requestData: any = (await db.collection("request").doc(requestString).get()).data()
        const childUserData: any = (await db.collection("user").doc(requestData.data.UID).get()).data();
        const parentUserData: any = (await db.collection("user").doc(Tdata.UID).get()).data();
        console.log("pend parent: "+ parentUserData.UID + " and child: "+ childUserData.UID)
        await this.writeChildUserData(childUserData, parentUserData);
        return await this.writeParentUserData(childUserData, parentUserData);   
    }


}