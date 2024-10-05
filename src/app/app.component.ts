import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'notifications';

  ngOnInit() {
    this.initializePushNotifications();
  }

  // Метод для инициализации push-уведомлений
  initializePushNotifications() {
    // Запрос разрешений
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        // Регистрация устройства
        PushNotifications.register();
      }
    });

    // Получение токена для отправки сообщений на устройство
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Registered with token: ', token.value);
    });

    // Обработка ошибок
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration error: ', error);
    });

    // Получение уведомлений
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push notification received: ', notification);
      alert('Notification received in foreground: ' + JSON.stringify(notification));
    });

    // Обработка нажатий на уведомления
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Push notification action performed: ', notification);
      alert('Notification action: ' + JSON.stringify(notification));
    });
  }
}
