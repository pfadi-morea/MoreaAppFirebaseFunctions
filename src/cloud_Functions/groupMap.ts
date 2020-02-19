import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import { UserMap } from './userMap';

const db = admin.firestore();

export class GroupMap{
    async getPriviledgeUsers(groupID: string): Promise<Array<string>>{
        var arr = new Array<string>()
            await db.collection("groups").doc(groupID).get().then(async snap =>{
            if(!snap.exists){
                console.error("DevToken should not be empty --> teleblitz_create.ts")
                return arr
            }     
            const groupData = snap.data()
            if(groupData == undefined){
                console.error("groupData is undefined --> teleblitz_create.ts")
                return arr
            }
                
            if(!("Priviledge" in groupData)){
                console.log("Group: " + groupID + "has no Priviledge users")
                return arr
            }
                
            
            const userIDs:Array<string> = Object.keys(groupData.Priviledge)
            arr = userIDs
            return userIDs
        }).catch(err =>{
            console.error(err)
        })
        return arr
    }
    async getChildAndHisParentsDevTokens(childuserIDs:Array<string>):Promise<Array<string>>{
        var arr = new Array<string>()
        console.log(childuserIDs)
        for(const i in childuserIDs){
            const childUserID:string = childuserIDs[i]
            const child: any = await db.collection("user").doc(childUserID).get()
            if(child.exists){
                const childData:any = child.data()
                if("devtoken" in childData){
                    console.log(arr)
                    arr.push(...childData.devtoken)}
                else if("devToken" in childData){
                    arr.push(...childData.devToken)
                    console.error("Attention wrong key in userMap found. Change devToken to devtoken. --> groupMap.ts")
                }
            if("Eltern" in childData)
                arr.push(...(await this.getDeviceTokenFromChildParents(childData)))
            }else
                console.error("child with userID: " + childUserID + "does not exists")
        }
        console.log(arr)
        return arr  
    }

    async getDeviceTokenFromChildParents(childMap:any): Promise<Array<string>>{
        var arr = new Array<string>()
        if(!("Eltern" in childMap))
            return arr
        
        arr = new Array<string>(...Object.keys(childMap.Eltern))
        var arr2 = new Array<string>()
        console.log(arr)
        for(const i in arr){
            const parentUserID:string = arr[i]
            const parent: any = await db.collection("user").doc(parentUserID).get()
            if(parent.exists){
                const parentData:any = parent.data()
                console.log(parentData)
                if("devtoken" in parentData)
                    arr2.push(...parentData.devtoken)
                else if("devToken" in parentData){
                    arr2.push(...parentData.devToken)
                    console.error("Attention wrong key in userMap found. Change devToken to devtoken. --> groupMap.ts")
                }}else
                    console.error("parent with userID: " + parentUserID + " does not exists")
        }    
        console.log(arr2)
        return arr2
    }
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