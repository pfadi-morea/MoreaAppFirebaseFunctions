import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GroupMap } from "../cloud_Functions/groupMap";

const notification = admin.messaging();

export class PushNotificationByTeleblitzCreated {
  async init(data: any, context: functions.EventContext) {
    const groupID: string = context.params.groupID;
    const messageTitle: string = "Anmeldung Teleblitz";
    const messageBody: string =
      "Ein neuer Teleblitz wurde hochgeladen. Bitte an und abmelden";

    const payload = {
      notification: {
        title: messageTitle,
        body: messageBody
      }
    };
    const groupMap = new GroupMap();
    const devToken: Array<string> = await groupMap.getChildAndHisParentsDevTokens(
      await groupMap.getPriviledgeUsers(groupID)
    );
    console.log("devTokens: " + devToken.toString);
    console.log(devToken);
    return this.send(devToken, payload);
  }

  async send(devToken: Array<string>, payload: any) {
    return notification.sendToDevice(devToken, payload);
  }
}
