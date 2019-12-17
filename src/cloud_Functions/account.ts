import * as admin from 'firebase-admin'

export class Account{
    async create(credential:any):Promise<string>{
        const user = await admin.auth().createUser({
        email: credential.email,
        password: credential.password     
        })
        return user.uid;
    }
}