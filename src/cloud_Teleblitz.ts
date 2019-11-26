import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
//import { Timestamp } from '@google-cloud/firestore';

//import {DWIFirestore} from './DWIFirestore';
//import {DWIBasics} from './DWIBasic';
//import { isString } from 'util';

const db = admin.firestore();


export class Cloud_Teleblitz{

    initfunction (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext):Promise<any>{
        if(change.after.data()){
            if(change.before.data()){
                return this.onUpdate(change.before.data(), change.after.data(), context).catch((err)=>{
                    console.error(err)
                })
            }else{
                return this.onCreate(change.after.data(), context).catch((err)=>{
                    console.error(err)
                })
            }
        }else{
            return this.onDelete(change.before.data(), context)
             
        } 

    }
    onCreate(newData: any, context: functions.EventContext):Promise<any>{
        return this.signUpTeleblitzHistory(newData, context).catch((err) =>{
            console.error("AnmeldeHistory ändern fehlgeschlagen" + err)
        })
       
    }
    onDelete(oldData: any, context: functions.EventContext){
        return Promise.resolve()
    }
    onUpdate(oldData: any, newData: any, context: functions.EventContext):Promise<any>{
<<<<<<< HEAD
        if(oldData.AnmeldeStatus !== newData.AnmeldeStatus){
=======
        if(oldData.AnmeldeStatus != newData.AnmeldeStatus){
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4
            return this.signUpTeleblitzHistory(newData, context).catch((err) =>{
                console.log("AnmeldeHistory ändern fehlgeschlagen" + err)
            })
        }else{
            console.error("Teleblitz änderung fehlgeschlagen, aufgrund gleichem AnmeldeStatus")
         return Promise.resolve()
        }
    }
    signUpTeleblitzHistory(newData: any, context: functions.EventContext):Promise<any>{
        const eventID     = context.params.eventID
        const anmeldeUID  = context.params.anmeldeUID

        const anmeldeHistoryRef = db.collection("events").
        doc(eventID).collection("AnmeldungHistory").doc(anmeldeUID)

        return db.runTransaction(t =>{
            return t.get(anmeldeHistoryRef).then((docSnapshot) =>{

                if(docSnapshot.exists){

<<<<<<< HEAD
                    const oldData = docSnapshot.data()
                    const anmeldeStamp: any[] = oldData!.Anmeldung
                    let aenderung:boolean=false
                    const newDate: Date = newData.Timestamp.toDate()    

                    for(const i in anmeldeStamp){
                        const i2:number = parseInt(i)
                        const oldDate: Date = anmeldeStamp[i2].Timestamp.toDate()
=======
                    let oldData = docSnapshot!.data()
                    let anmeldeStamp: any[] = oldData!.Anmeldung
                    let aenderung:boolean=false
                    let newDate: Date = newData.Timestamp.toDate()    

                    for(let i in anmeldeStamp){
                        let i2:number = parseInt(i)
                        let oldDate: Date = anmeldeStamp[i2].Timestamp.toDate()
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4
                        if(newDate < oldDate){
                            anmeldeStamp.splice(i2, 0, newData)
                            console.log("Aktivität, User: " + anmeldeUID + " " + anmeldeStamp[anmeldeStamp.length].AnmeldeStatus)
                            aenderung = true;
                            break
                        }
                    }


<<<<<<< HEAD
                    if(aenderung === false){
                        anmeldeStamp.push(newData)
                        console.log("Aktivität, User: " + anmeldeUID + " " + newData.AnmeldeStatus)
                    }
                    const anmeldeHistoryUpdate = {
=======
                    if(aenderung == false){
                        anmeldeStamp.push(newData)
                        console.log("Aktivität, User: " + anmeldeUID + " " + newData.AnmeldeStatus)
                    }
                    let anmeldeHistoryUpdate = {
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4
                        "Anmeldung": anmeldeStamp
                    };
                    t.update(anmeldeHistoryRef, anmeldeHistoryUpdate)
                }else{

<<<<<<< HEAD
                    const anmeldeStamp: Map<String, any>[] = [newData]
                    const anmeldeHistory: any = {
=======
                    let anmeldeStamp: Map<String, any>[] = [newData]
                    let anmeldeHistory: any = {
>>>>>>> 2cf670f83590d3c4dac4f29fe37aaf1edb1927d4
                        "Anmeldung": anmeldeStamp
                    };
                    console.log("Aktivität, User: " + anmeldeUID + " " + newData.AnmeldeStatus)
                    t.create(anmeldeHistoryRef, anmeldeHistory)
                }
            }).catch(err =>{
                console.error(err)
            })
        })
    
    }
}
