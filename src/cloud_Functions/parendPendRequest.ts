import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
//import { DocumentSnapshot } from '@google-cloud/firestore';


const db = admin.firestore();

export class ParentPendAccept{

    async writeParentUserData(childUserData:any, parentUserData:any){
       const childName:string = childUserData.Vorname
       const childUID:string = childUserData.UID
       const parentUID: string = parentUserData.UID
       let newData:any = parentUserData
       if(newData.Kinder == undefined)
       newData= newData + {"Kinder":{childName:childUID}}
       else
       newData= newData + {childName:childUID}
       console.log("pend: " +childName)
       console.log(newData)
       return await db.collection("user").doc(parentUID).set(newData)
    }
   /* async writeChildUserData(childUserData:any, parentUserData:any){

    }*/
    
    async accept(Tdata:any, context: functions.https.CallableContext){      
        const requestString:string = Tdata.request 
        const requestData:any= (await db.collection("request").doc(requestString).get()).data()  
        const childUserData:any = (await db.collection("user").doc(requestData.data.UID).get()).data();
        const parentUserData:any = (await db.collection("user").doc(Tdata.UID).get()).data();
        console.log(parentUserData)
        console.log(childUserData)
        //this.writeChildUserData(childUserData, parentUserData);
        return await this.writeParentUserData(childUserData, parentUserData);
    }


}