package com.onedollarxclub.casual.dating.date.single.flirt.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashScreenActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

    Intent intent = new Intent(this, MainActivity.class);

    // Pass along FCM messages/notifications etc.
    Bundle extras = getIntent().getExtras();
    if (extras != null) {
      intent.putExtras(extras);
    }

    startActivity(intent);
    finish();
  }
}
