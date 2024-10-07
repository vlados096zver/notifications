package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Инициализация Firebase
        FirebaseApp.initializeApp(this);

        // Явная регистрация плагина не требуется для официального плагина @capacitor/local-notifications
    }
}
