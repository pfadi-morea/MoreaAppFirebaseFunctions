import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();
import { Cloud_Teleblitz } from "./cloud_Teleblitz";
export { Cloud_Teleblitz } from "./cloud_Teleblitz";
import { ChildPendRequest } from "./cloud_Functions/childPendRequest";
export { ChildPendRequest } from "./cloud_Functions/childPendRequest";
import { ParentPendAccept } from "./cloud_Functions/parendPendRequest";
import { Account } from "./cloud_Functions/account";
import { UserMap } from "./cloud_Functions/userMap";
import { GroupMap } from "./cloud_Functions/groupMap";
import { PushNotificationByTeleblitzCreated } from "./push_notification/teleblitz_create";
export { PushNotificationByTeleblitzCreated } from "./push_notification/teleblitz_create";
import { ChildUserMap } from "./cloud_Functions/childUserMap";
import { Messages } from "./cloud_Functions/messages";
export { ParentPendAccept } from "./cloud_Functions/parendPendRequest";

//const db = admin.firestore();
//Changed from Imac
export const anmeldungTeleblitz = functions.region("europe-west1").firestore
    .document("events/{eventID}/Anmeldungen/{anmeldeUID}")
    .onWrite(async (change, context) => {
        const tlbz = new Cloud_Teleblitz();
        return await tlbz.initfunction(change, context);
    });
export const childPendRequest = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const request = new ChildPendRequest();
        return await request.request(data, context);
    }
);
export const parendPendAccept = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const accept = new ParentPendAccept();
        return await accept.accept(data, context);
    }
);
export const deleteUser = functions.region("europe-west1").firestore
    .document("user/{userID}")
    .onDelete(async (snap, context) => {
        if (snap.id.length < 25) {
            return null;
        } else {
            return admin
                .auth()
                .deleteUser(snap.id)
                .then(() => console.log("Deleted user with ID:" + snap.id))
                .catch(error =>
                    console.error(
                        "There was an error while deleting user:",
                        error
                    )
                );
        }
    });
export const createAccount = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const accont = new Account();
        return accont.create(data);
    }
);
export const uploadDevTocken = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        return userMap.deviceTokenUpdate(data, context);
    }
);
export const updateUserProfile = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        return userMap.update(data, context);
    }
);

export const goToNewGroup = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        return groupMap.goToNewGroup(data, context);
    }
);
export const priviledgeTN = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        const userMap = new UserMap();
        await userMap.groupIDUpdate(data, context);
        return groupMap.priviledgeTN(data, context);
    }
);
export const makeLeiter = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        return groupMap.makeLeiter(data, context);
    }
);
export const pushNotificationOnTeleblitzCreate = functions.region("europe-west1").firestore
    .document("groups/{groupID}")
    .onWrite(async (change, context) => {
        const pushNotification = new PushNotificationByTeleblitzCreated();
        return pushNotification.groupLevelInit(change, context);
    });

export const pushNotificationOnTeleblitzWrite = functions.region("europe-west1").firestore
    .document("events/{eventID}")
    .onWrite(async (change, context) => {
        const pushNotification = new PushNotificationByTeleblitzCreated();
        return pushNotification.eventLevelInit(change);
    });
export const createChildUserMap = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const childusermap = new ChildUserMap();
        return childusermap.create(data, context);
    }
);

export const priviledgeEltern = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        return groupMap.priviledgeEltern(data, context);
    }
);
export const upgradeChildMap = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        await userMap.updateAllParents(data, context);
        return userMap.create(data, context);
    }
);

export const createUserMap = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        return userMap.create(data, context);
    }
);

export const deleteUserMap = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        const groupMap = new GroupMap();
        await groupMap.deSubFromGroup(data, context);
        return userMap.delete(data, context);
    }
);

export const desubFromGroup = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        return groupMap.deSubFromGroup(data, context)
    }
)

export const deleteChildMap = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        return userMap.delete(data, context);
    }
);

export const updatePriviledge = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const groupMap = new GroupMap();
        const dataupdate = {
            UID: data.UID,
            groupID: data.groupID,
            DisplayName: data.DisplayName
        };
        const datadesub = {
            UID: data.oldUID,
            groupID: data.groupID
        };
        await groupMap.priviledgeTN(dataupdate, context);
        return groupMap.deSubFromGroup(datadesub, context);
    }
);

export const uploadAndNotifyMessage = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const messages = new Messages();
        console.log(data);
        await messages.uploadMessage(data, context);
        return messages.sendNotificationForMessage(data, context);
    }
);

export const deactivateDeviceNotification = functions.region("europe-west1").https.onCall(
    async (data: any, context: functions.https.CallableContext) => {
        const userMap = new UserMap();
        return userMap.deactivateDeviceNotification(data, context);
    }
);
