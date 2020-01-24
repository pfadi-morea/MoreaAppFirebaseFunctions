import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as https from 'https'

const db = admin.firestore()

export class MailChimpManager{

    async updateProfile(data:any, context:functions.https.CallableContext){
        const apiKey:any = db.collection('config').doc('apiKeys').get().then((dr) => {
            const document = dr.data()
            if(document != undefined){
                return document['mailchimp']
            }
        })

        const options = {
            auth: "pfadimorea:${apiKey}",
            method: "PUT",
            hostname: data.hostname,
            path: data.path
        }

        const body = data.body

        const req = https.request(options)

        req.on('error', (e) => {
            console.error('problem with request: ${e.message}')
        })

        req.write(body)
        req.end()
    }

}