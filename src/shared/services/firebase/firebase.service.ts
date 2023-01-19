import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('serviceAccountKey.json'),
});

@Injectable()
export class FirebaseService {
  constructor() {}

  sendPush(pushTokens: string[], title: string, body: string) {
    return admin.messaging().sendMulticast({
      tokens: pushTokens,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          title,
          body,
          icon: 'https://www.jwterritory.co.kr/android-chrome-512x512.png',
        },
        fcmOptions: {
          link: 'https://www.jwterritory.co.kr',
        },
      },
    });
  }
}
