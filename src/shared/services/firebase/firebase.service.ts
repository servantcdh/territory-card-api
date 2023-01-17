import { Injectable } from '@nestjs/common';
import { Messaging } from 'firebase-admin/messaging';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('serviceAccountKey.json')
});

@Injectable()
export class FirebaseService {
  constructor() {}

  sendPush(pushTokens: string[], title: string, body: string) {
    return new Messaging().sendToDevice(pushTokens, {
      notification: { title, body },
    });
  }
}
