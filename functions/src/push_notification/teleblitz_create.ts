import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GroupMap } from "../cloud_Functions/groupMap";

const notification = admin.messaging();

export class PushNotificationByTeleblitzCreated {
  async groupLevelInit(
    change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
    context: functions.EventContext
  ) {
    const groupID: string = context.params.groupID;
    const messageTitle: string = "Teleblitz";
    const messageBody: string =
      "Ein neuer Teleblitz wurde hochgeladen. Bitte an und abmelden";

    const payload = {
      notification: {
        title: messageTitle,
        body: messageBody
      }
    };
    const groupMap = new GroupMap();
    if (!this.validate(change, context)) return null;
    const devToken: Array<string> = await groupMap.getChildAndHisParentsDevTokens(
      await groupMap.getPriviledgeUsers(groupID)
    );
    console.log(
      "Send Teleblitz message to groupID: " +
        groupID +
        "devtokens: " +
        JSON.stringify(devToken)
    );
    console.log(devToken);
    return this.send(devToken, payload);
  }
  async eventLevelInit(
    change: functions.Change<FirebaseFirestore.DocumentSnapshot>
  ) {
    if (change.before.exists && change.after.exists) {
      const data: any = change.after.data()!;
      if ("groupIDs" in data) {
        const groupIDs: Array<string> = data.groupIDs;
        const messageTitle: string = "Teleblitz";
        const messageBody: string =
          "Der Teleblitz wurde geändert. Schaue ihn nochmals an.";
        const payload = {
          notification: {
            title: messageTitle,
            body: messageBody
          }
        };
        const groupMap = new GroupMap();

        groupIDs.forEach(async groupID => {
          const devToken: Array<string> = await groupMap.getChildAndHisParentsDevTokens(
            await groupMap.getPriviledgeUsers(groupID)
          );
          console.log(
            "Send Teleblitz message to groupID: " +
              groupID +
              "devtokens: " +
              JSON.stringify(devToken)
          );

          return this.send(devToken, payload);
        });
      }
    }
  }
  validate(
    change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
    context: functions.EventContext
  ): boolean {
    const oldGroupData: any = change.before.data()!;
    const newGroupData: any = change.after.data()!;

    //homeFeed was empty and now it is empty too
    if (!("homeFeed" in oldGroupData) && !("homeFeed" in newGroupData))
      return false;

    //homeFeed was empty and now it contains value?
    if (!("homeFeed" in oldGroupData) && "homeFeed" in newGroupData)
      if (newGroupData.homeFeed === undefined) return false;
      else if (newGroupData.homeFeed instanceof Array) return true;
      else return false;

    //homeFeed existed and now it is empty
    if ("homeFeed" in oldGroupData && !("homeFeed" in newGroupData))
      return false;

    //type Test
    if (!(newGroupData.homeFeed instanceof Array)) {
      console.exception(
        "homeFeed must be of type Array<string> (teleblitz_create.ts)"
      );
      return false;
    } else if (!(oldGroupData.homeFeed instanceof Array))
      //Trigger because it has changed
      return true;
    //Test values of Array
    else {
      const oldHomeFeed: Array<string> = oldGroupData.homeFeed;
      const newHomeFeed: Array<string> = newGroupData.homeFeed;

      //test if old was empty and new contains value
      if (oldHomeFeed.length === 0 && newHomeFeed.length > 0) return true;
      else if (newHomeFeed.length === 0) return false;
      else {
        //Check if element has changed ** not dependent on order of array
        for (let i in newHomeFeed)
          if (!oldHomeFeed.includes(newHomeFeed[i])) return true;
      }
    }
    return false;
    /*
    TODO Trigger could be improved by checking if a firestore document exists.
    I didn't included this feauture because it might be possible for this function to be triggerd before the event document is created
    */
  }

  async send(devToken: Array<string>, payload: any) {
    return notification.sendToDevice(devToken, payload);
  }
}
