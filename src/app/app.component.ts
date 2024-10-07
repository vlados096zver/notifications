import { Component, OnInit } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'notifications';
  sqlite: SQLiteConnection;
  data: any[] = []; 

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  ngOnInit() {
    this.initializePushNotifications();
    this.initializeLocalNotifications();
    this.initializeDatabase();
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

    // Получение push-уведомлений
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push notification received: ', notification);
      alert('Notification received in foreground: ' + JSON.stringify(notification));
    });

    // Обработка нажатий на push-уведомления
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Push notification action performed: ', notification);
      alert('Notification action: ' + JSON.stringify(notification));
    });
  }

  // Метод для инициализации локальных уведомлений
  async initializeLocalNotifications() {
    // Запрос разрешений для локальных уведомлений
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Local notifications permission granted');
      this.scheduleLocalNotification();  // Тестовое уведомление
    } else {
      console.log('Local notifications permission denied');
    }

    // Прослушивание событий локальных уведомлений
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Local notification received:', notification);
      alert('Local notification received: ' + JSON.stringify(notification));
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      console.log('Local notification action performed:', notificationAction);
      alert('Notification action performed: ' + JSON.stringify(notificationAction));
    });
  }

  // Планирование тестового локального уведомления
  async scheduleLocalNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,  // Уникальный идентификатор уведомления
          title: "Тестовое уведомление",
          body: "Это тестовое локальное уведомление!",
          schedule: { at: new Date(Date.now() + 5000) },  // Через 5 секунд
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null,
        }
      ]
    });
    console.log('Local notification scheduled');
  }

       async initializeDatabase() {
    try {
      // Создаем подключение к базе данных с дополнительным аргументом readonly
      const db = await this.sqlite.createConnection('myDB', false, 'no-encryption', 1, false);
      await db.open();

      // Создаем таблицу
      await db.execute(`
        CREATE TABLE IF NOT EXISTS test (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL
        );
      `);

      // Вставляем данные
      await db.run('INSERT INTO test (name) VALUES (?)', ['testName']);

      // Выполняем запрос для получения данных
      const result = await db.query('SELECT * FROM test');

      // Проверяем, есть ли результат и значения
      this.data = result.values ? result.values : [];

      console.log('Data from test table: ', this.data);

    } catch (error) {
      console.error('Error initializing database: ', error);
    }
  }
}
