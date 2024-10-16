

import {Component} from "@angular/core";
import {CapacitorSQLite, SQLiteConnection} from "@capacitor-community/sqlite";
import {BiometricService} from "../services/biometric.service";
import {PushNotifications, Token} from "@capacitor/push-notifications";
import {LocalNotifications} from "@capacitor/local-notifications";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerTypeHint
} from "@capacitor/barcode-scanner";
import {Camera} from "@capacitor/camera";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  title = 'notifications';
  sqlite: SQLiteConnection;
  data: any[] = [];
  qrContent: string = '';
  storedData: string | null = null;
  socketEntity: WebSocket | null = null;
  response: string = '';
  websocketMessage: string = 'Hello WebSocket!';

  constructor(private biometricService: BiometricService) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  ngOnInit() {
    this.initializePushNotifications();
    this.initializeLocalNotifications();
    this.initializeDatabase();
  }

  // Method for initializing push notifications
  initializePushNotifications() {
    // Request permissions
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        // Device registration
        PushNotifications.register();
      }
    });

    // Getting a token to send messages to the device
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Registered with token: ', token.value);
    });

    // Error handling
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration error: ', error);
    });

    // Receiving push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push notification received: ', notification);
      alert('Notification received in foreground: ' + JSON.stringify(notification));
    });

    // Handling clicks on push notifications
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Push notification action performed: ', notification);
      alert('Notification action: ' + JSON.stringify(notification));
    });
  }

  // Method for initializing local notifications
  async initializeLocalNotifications() {
    // Request permissions for local notifications
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Local notifications permission granted');
      this.scheduleLocalNotification();  // Test notification
    } else {
      console.log('Local notifications permission denied');
    }

    // Listening for local notification events
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Local notification received:', notification);
      alert('Local notification received: ' + JSON.stringify(notification));
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      console.log('Local notification action performed:', notificationAction);
      alert('Notification action performed: ' + JSON.stringify(notificationAction));
    });
  }

  // Scheduling a test local notification
  async scheduleLocalNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,  // Unique notification identifier
          title: "Тестовое уведомление",
          body: "Это тестовое локальное уведомление!",
          schedule: { at: new Date(Date.now() + 5000) },  // In 5 seconds
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
      // Create a database connection with an additional readonly argument
      const db = await this.sqlite.createConnection('myDB', false, 'no-encryption', 1, false);
      await db.open();

      // Create a table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS test (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL
        );
      `);

      // Insert data
      await db.run('INSERT INTO test (name) VALUES (?)', ['testName']);

      // We execute a request to obtain data
      const result = await db.query('SELECT * FROM test');

      // We check if there is a result and values
      this.data = result.values ? result.values : [];

      console.log('Data from test table: ', this.data);

    } catch (error) {
      console.error('Error initializing database: ', error);
    }
  }

  async startScan(): Promise<void> {
    try {
      const cameraPermission = await this.checkCameraPermission(); // Method for checking permissions

      if (cameraPermission) {
        const result = await CapacitorBarcodeScanner.scanBarcode({
          cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
          scanInstructions: 'Hold your camera up to the QR code',
          scanButton: false,
          hint: CapacitorBarcodeScannerTypeHint.ALL
        });

        if (result && result.ScanResult) {
          this.qrContent = result.ScanResult;
          console.log('QR Code Content:', result.ScanResult);
        } else {
          this.qrContent = 'No QR Code content found';
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  }

  async checkCameraPermission(): Promise<boolean> {
    const permission = await Camera.requestPermissions();
    return permission.camera === 'granted';
  }


  async authenticateAndStoreData() {
    const biometricAvailable = await this.biometricService.isBiometricAvailable();
    if (biometricAvailable) {
      const authenticated = await this.biometricService.authenticate();
      if (authenticated) {
        console.log('Biometric authentication successful');
        await this.biometricService.saveToSecureStorage('secureKey', 'ConfidentialData');
        this.storedData = await this.biometricService.getFromSecureStorage('secureKey');
        console.log('Retrieved data from secure storage:', this.storedData);
      } else {
        console.log('Biometric authentication failed');
      }
    } else {
      console.log('Biometric authentication is not available');
    }
  }

  // WebSocket
  // Method for establishing a WebSocket connection
  connectWebSocket() {
    if (this.socketEntity) {
      console.log('WebSocket already connected');
      return;
    }

    this.socketEntity = new WebSocket('wss://echo.websocket.org/');

    this.socketEntity.onopen = (event: Event) => {
      this.response = 'Connection established';
      console.log('WebSocket connection opened', event);
    };

    this.socketEntity.onmessage = (event: MessageEvent) => {
      this.response = `Received: ${event.data}`;
      console.log('Message received', event);
    };

    this.socketEntity.onclose = (event: CloseEvent) => {
      this.response = `Connection closed: ${event.reason}`;
      console.log('WebSocket connection closed', event);
      this.socketEntity = null;  // Set null if connection is closed
    };

    this.socketEntity.onerror = (error: Event) => {
      this.response = 'Error occurred';
      console.error('WebSocket error', error);
    };
  }

  // Method for sending message via WebSocket
  sendMessage() {
    if (this.socketEntity && this.socketEntity.readyState === WebSocket.OPEN) {
      this.socketEntity.send(JSON.stringify({ message: this.websocketMessage }));
      console.log('Message sent:', this.websocketMessage);
    } else {
      console.log('WebSocket is not open');
    }
  }

  // Method for closing the connection
  disconnectWebSocket() {
    if (this.socketEntity) {
      this.socketEntity.close();
    }
  }
}
