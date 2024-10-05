import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;  // Добавляем импорт Bundle
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;  // Добавляем импорт FirebaseApp

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Инициализация Firebase
        FirebaseApp.initializeApp(this);
        
        // Создание канала уведомлений
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "default_channel_id";  // Должно совпадать с AndroidManifest.xml
            String channelName = "Default Channel";
            String channelDescription = "Default Channel for notifications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            channel.setDescription(channelDescription);
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}
