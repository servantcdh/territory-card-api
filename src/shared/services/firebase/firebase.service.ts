import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('serviceAccountKey.json'),
});

@Injectable()
export class FirebaseService {
  constructor() {}

  sendPush(pushTokens: string[], title: string, body: string) {
    return admin.messaging().sendToDevice(pushTokens, {
      notification: { title, body, icon: 'android-chrome-512x512' },
      data: { title, body, icon: 'android-chrome-512x512' },
    });
  }
}
