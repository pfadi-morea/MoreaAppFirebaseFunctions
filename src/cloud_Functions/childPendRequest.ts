import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as crypto from 'crypto'
const db = admin.firestore();

export class ChildPendRequest{
    async generateRequestString(strLength:number):Promise<string>{
        let str:string
        do{
            str = crypto.randomBytes(strLength).toString('hex')
        }while(await this.checkIfRequestexists(str))
        console.log("Request String: " + str)
        return str;
    }
    async checkIfRequestexists(randomString:string):Promise<boolean>{
        if(await db.collection("request").doc(randomString).get().then(doc => doc.exists))
            return true
        else
            return false
    }
    
    async request(data:any, context: functions.https.CallableContext):Promise<String>{
        const requeststr:string =  await this.generateRequestString(20) 
        await db.collection("request").doc(requeststr).set({data})
        return requeststr
    }
    
    
    


}