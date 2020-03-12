
import * as admin from 'firebase-admin'
//import * as functions from 'firebase-functions'

export class DWIFirestore{
     async read(path: string, docName: string):Promise<FirebaseFirestore.DocumentSnapshot>{
         try{
            return await admin.firestore().collection(path).doc(docName).get();
         }catch(e){
            throw Error("Error while file reading: " + e)
         }
        }
    async write(path: string, docName: string, doc: FirebaseFirestore.DocumentData){
        return admin.firestore().collection(path)
        .doc(docName).set(doc).then(e =>{
            console.log("File written succsessfully")
            }
        )
        .catch(e =>{
            console.log(e);
        });
    }
    async deleteDoc(path: string, docName: string):Promise<FirebaseFirestore.WriteResult>{
        return await admin.firestore().collection(path).doc(docName).delete();
    }
    

}