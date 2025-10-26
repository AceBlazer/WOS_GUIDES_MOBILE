package com.wosguides;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AutoClickerModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "AutoClickerModule";

    public AutoClickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void startOverlayService(Promise promise) {
        try {
            if (canDrawOverlays()) {
                Intent serviceIntent = new Intent(getReactApplicationContext(), OverlayService.class);
                getReactApplicationContext().startService(serviceIntent);
                promise.resolve("Overlay service started");
            } else {
                promise.reject("PERMISSION_DENIED", "Overlay permission not granted");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopOverlayService(Promise promise) {
        try {
            Intent serviceIntent = new Intent(getReactApplicationContext(), OverlayService.class);
            getReactApplicationContext().stopService(serviceIntent);
            promise.resolve("Overlay service stopped");
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(getReactApplicationContext())) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getReactApplicationContext().startActivity(intent);
                    promise.resolve("Permission request sent");
                } else {
                    promise.resolve("Permission already granted");
                }
            } else {
                promise.resolve("Permission not required for this Android version");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void checkOverlayPermission(Promise promise) {
        try {
            boolean hasPermission = canDrawOverlays();
            promise.resolve(hasPermission);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void checkAccessibilityService(Promise promise) {
        try {
            boolean isEnabled = isAccessibilityServiceEnabled();
            promise.resolve(isEnabled);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void requestAccessibilityService(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
            promise.resolve("Accessibility settings opened");
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setClickPosition(int x, int y, Promise promise) {
        try {
            AutoClickerService.sendSetClickPosition(getReactApplicationContext(), x, y);
            promise.resolve("Click position set to: " + x + ", " + y);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    private boolean canDrawOverlays() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(getReactApplicationContext());
        }
        return true; // Pre-Android M doesn't require this permission
    }

    private boolean isAccessibilityServiceEnabled() {
        String settingValue = Settings.Secure.getString(
            getReactApplicationContext().getContentResolver(),
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );

        if (settingValue != null) {
            String serviceName = getReactApplicationContext().getPackageName() + "/com.wosguides.AutoClickerService";
            return settingValue.contains(serviceName);
        }
        return false;
    }
}