# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep public class com.horcrux.svg.** {*;}
-keep class com.facebook.jni.** { *; }
-keepattributes *Annotation*
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep class org.webrtc.** { *; }
-keep class com.twilio.** { *; }
-keep class tvi.webrtc.** { *; }
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
-keep class com.arthenica.mobileffmpeg.Config {
    native <methods>;
    void log(long, int, byte[]);
    void statistics(long, int, float, float, long , int, double, double);
}
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.arthenica.mobileffmpeg.AbiDetect {
    native <methods>;
}
-keep class com.facebook.hermes.unicode.** { *; }
-dontwarn com.appsflyer.**
-keep public class com.google.firebase.messaging.FirebaseMessagingService {
  public *;
}
