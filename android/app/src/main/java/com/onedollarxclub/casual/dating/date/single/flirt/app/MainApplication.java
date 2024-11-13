package com.onedollarxclub.casual.dating.date.single.flirt.app;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.rctaudiotoolkit.AudioPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import org.wonday.orientation.OrientationActivityLifecycle;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.twiliorn.library.TwilioPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
          new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
              @SuppressWarnings("UnnecessaryLocalVariable")
              List<ReactPackage> packages = new PackageList(this).getPackages();
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // packages.add(new MyReactNativePackage());
              packages.add(new TwilioPackage());
              return packages;
            }

            @Override
            protected String getJSMainModuleName() {
              return "index";
            }


            @Override
            protected JSIModulePackage getJSIModulePackage() {
              return new ReanimatedJSIModulePackage(); // <- add
            }
          };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
  }

}
