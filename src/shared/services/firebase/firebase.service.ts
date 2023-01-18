import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('serviceAccountKey.json'),
});

@Injectable()
export class FirebaseService {
  constructor() {}

  sendPush(pushTokens: string[], title: string, body: string) {
    const push = {
      data: { icon: './android-chrome-512x512.png' },
      token: '',
      notification: {
        title,
        body,
      },
      webpush: {
        fcmOptions: {
          link: 'https://www.jwterritory.co.kr',
        },
      },
    };
    return admin.messaging().sendAll(pushTokens.map((token) => ({ ...push, token })));
    // return admin.messaging().sendToDevice(pushTokens, {
    //   notification: { title, body, icon: './android-chrome-512x512.png' },
    //   data: { title, body, icon: './android-chrome-512x512.png' },
    // });
  }
}
