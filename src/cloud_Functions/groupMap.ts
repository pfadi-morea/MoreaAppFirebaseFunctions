import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { UserMap } from './userMap';

const db = admin.firestore();

export class GroupMap{
    async priviledgeTN(data:any, context: functions.https.CallableContext){
        const userID:string = data.UID
        const groupID:string = data.groupID
        const displayName:string = data.DisplayName

        const groupRef:FirebaseFirestore.DocumentReference = db.collection("groups").doc(groupID)

        return db.runTransaction(t =>{
            return t.get(groupRef).then((dSgroup)=>{
                let groupData:any = dSgroup.data()
                let priviledge:any
                if(groupData !== undefined)
                if("Priviledge" in groupData){
                    priviledge = groupData["Priviledge"]
                    priviledge[userID]={"DisplayName": displayName, 
                    "Priviledge": 1}
                }else{
                    priviledge = {[userID]:{"DisplayName": displayName, 
                    "Priviledge": 1}}
                    groupData["Priviledge"] = priviledge
                }
                return t.update(groupRef, groupData)
            }).catch((error)=>{
                console.error(error)
                return error
            })
        })
    }
    async deSubFromGroup(data:any, context: functions.https.CallableContext){
        const userID:string = data.UID
        const groupID:string = data.groupID

        const groupRef:FirebaseFirestore.DocumentReference = db.collection("groups").doc(groupID)

        return db.runTransaction(t =>{
            return t.get(groupRef).then((dSgroup)=>{
                let groupData:any = dSgroup.data() 
                delete groupData["Priviledge"][userID]
                return t.update(groupRef, groupData)
            }).catch((error)=>{
                console.error(error)
                return error
            })
        })
    }
    async goToNewGroup(data:any, context: functions.https.CallableContext){
        const oldGroup:string = data.oldGroup
        const newGroup:string = data.newGroup
        const userMap = new UserMap
        data.groupID = oldGroup
        await this.deSubFromGroup(data, context)
        data.groupID = newGroup
        await userMap.groupIDUpdate(data, context)
        return this.priviledgeTN(data, context)
    }
    async makeLeiter(data:any, context: functions.https.CallableContext){
        const userID:string = data.UID
        const groupID:string = data.groupID
        const displayName:string = data.DisplayName

        const groupRef:FirebaseFirestore.DocumentReference = db.collection("groups").doc(groupID)

        return db.runTransaction(t =>{
            return t.get(groupRef).then((dSgroup)=>{
                let groupData:any = dSgroup.data()
                let priviledge:any
                if("Priviledge" in groupData){
                    priviledge = groupData["Priviledge"]
                    priviledge[userID]={"DisplayName": displayName, 
                    "Priviledge": 3}
                }else{
                    priviledge = {userID:{"DisplayName": displayName, 
                    "Priviledge": 3}}
                    groupData["Priviledge"] = priviledge
                }
                return t.update(groupRef, groupData)
            }).catch((error)=>{
                console.error(error)
                return error
            })
        })
    }
    async priviledgeEltern(data:any, context: functions.https.CallableContext){
        const userID:string = data.UID
        const groupID:string = data.groupID
        const displayName:string = data.DisplayName

        const groupRef:FirebaseFirestore.DocumentReference = db.collection("groups").doc(groupID)

        return db.runTransaction(t =>{
            return t.get(groupRef).then((dSgroup)=>{
                let groupData:any = dSgroup.data()
                let priviledge:any
                if(groupData !== undefined)
                if("Priviledge" in groupData){
                    priviledge = groupData["Priviledge"]
                    priviledge[userID]={"DisplayName": displayName, 
                    "Priviledge": 2}
                }else{
                    priviledge = {[userID]:{"DisplayName": displayName, 
                    "Priviledge": 2}}
                    groupData["Priviledge"] = priviledge
                }
                return t.update(groupRef, groupData)
            }).catch((error)=>{
                console.error(error)
                return error
            })
        })
    }

}