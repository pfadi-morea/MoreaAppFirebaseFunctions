import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const db = admin.firestore();

export class ParentPendAccept{

    /*async writeParentUserData(){
                
    }
    async writeChildUserData(){

    }*/
    
    async accept(data:any, context: functions.https.CallableContext){
        console.log("dataType: " + typeof(data))
        console.log("data: " + data)
        
        const requestString:string = data.requests
        
        console.log("requestString: " + requestString)
        const requestData:any= await db.collection("requests").doc(requestString).get();
        console.log("requestData: " + requestData.data)
        
        /*
        const childUserData:any = (await db.collection("user").doc(requestData!.UID).get()).data();
        const parentUderData:any = (await db.collection("user").doc().get()).data();

        this.writeChildUserData(childUserData, parentUderData);
        return await writeParentUserData(childUserData, parentUderData);

*/
        return Promise.resolve
    }


}