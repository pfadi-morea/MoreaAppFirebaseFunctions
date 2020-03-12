import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GroupMap } from "./groupMap";
import { DocumentReference } from "@google-cloud/firestore";

const db = admin.firestore();

export class UserMap {
    async create(data: any, context: functions.https.CallableContext) {
        return db
            .collection("user")
            .doc(data.UID)
            .create(data.content);
    }
    async update(data: any, context: functions.https.CallableContext) {
        return db
            .collection("user")
            .doc(data.UID)
            .set(data);
    }

    async updateAllParents(
        data: any,
        context: functions.https.CallableContext
    ) {
        const elternList = data.elternList;
        const oldChildUID = data.oldChildUID;
        for (let elternUID of elternList) {
            let elternUserMap = (
                await db
                    .collection("user")
                    .doc(elternUID)
                    .get()
            ).data();
            if (elternUserMap !== undefined) {
                const elternRef: FirebaseFirestore.DocumentReference = db
                    .collection("user")
                    .doc(elternUID);
                await db.runTransaction(t => {
                    return t
                        .get(elternRef)
                        .then(dSgroup => {
                            let groupData: any = dSgroup.data();
                            delete groupData["Kinder"][oldChildUID];
                            groupData["Kinder"][data.UID] = data.vorname;
                            return t.set(elternRef, groupData);
                        })
                        .catch(error => {
                            console.error(error);
                            return error;
                        });
                });
            }
        }
        return null;
    }

    async delete(data: any, context: functions.https.CallableContext) {
        return db
            .collection("user")
            .doc(data.UID)
            .delete();
    }

    async deviceTokenUpdate(
        data: any,
        context: functions.https.CallableContext
    ) {
        const clientUID: string = data.UID;
        const devtoken: string = data.devtoken;
        const deviceID: string = data.deviceID;
        const nestedPath: string = "devtoken." + deviceID;
        return db
            .collection("user")
            .doc(clientUID)
            .update({ [nestedPath]: devtoken });
    }
    async groupIDUpdate(data: any, context: functions.https.CallableContext) {
        const userUID: string = data.UID;
        const groupID: string = data.groupID;

        const userDocRef: FirebaseFirestore.DocumentReference = db
            .collection("user")
            .doc(userUID);
        return db.runTransaction(t => {
            return t
                .get(userDocRef)
                .then(dSuserDoc => {
                    const userDoc: any = dSuserDoc.data();
                    userDoc["groupID"] = groupID;
                    return t.update(userDocRef, userDoc);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }
    async makeLeiter(data: any, context: functions.https.CallableContext) {
        const requestString: string = data.request;
        const requestRef: FirebaseFirestore.DocumentReference = db
            .collection("request")
            .doc(requestString);
        const rawRequest: any = await requestRef.get();
        if (rawRequest.exists) {
            const requestData = rawRequest.data();
            const clientRef: FirebaseFirestore.DocumentReference = db
                .collection("user")
                .doc(requestData.UID);
            requestRef.delete().catch(e => console.error(e));
            let clientData: any;
            db.runTransaction(t => {
                return t
                    .get(clientRef)
                    .then(clientDoc => {
                        clientData = clientDoc.data();
                        clientData["Pos"] = "Leiter";
                        return t.update(clientRef, clientData);
                    })
                    .catch(err => console.error(err));
            }).catch(err => console.error(err));
            clientData.groupID = data.groupID;
            if ("Pfadinamen" in clientData)
                clientData.DisplayName = clientData.Pfadinamen;
            else clientData.DisplayName = clientData.Vorname;
            const groupMap = new GroupMap();
            return groupMap.makeLeiter(clientData, context);
        }
        console.error("request wasn't generated");
        return Promise.resolve();
    }

    async deactivateDeviceNotification(
        data: any,
        context: functions.https.CallableContext
    ) {
        const uid: string = data.uid;
        const deviceID: string = data.deviceID;
        const ref: DocumentReference = db.collection("user").doc(uid);
        db.runTransaction(t => {
            return t
                .get(ref)
                .then(doc => {
                    const map = doc.data();
                    const field = doc.get("devtoken");
                    const newField: { [key: string]: any } = {};
                    for (const device of Object.keys(field)) {
                        if (device !== deviceID) {
                            newField[device] = field[device];
                        }
                    }
                    if (map !== undefined) {
                        map.devtoken = newField;
                    }
                    return t.set(ref, map);
                })
                .catch(err => console.error(err));
        }).catch(err => console.error(err));
    }
}
