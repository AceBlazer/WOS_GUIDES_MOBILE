package com.wosguides;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Path;
import android.graphics.PixelFormat;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class AutoClickerService extends AccessibilityService {
    private static final String TAG = "AutoClickerService";
    private static final String ACTION_START_CLICKING = "com.wosguides.START_CLICKING";
    private static final String ACTION_STOP_CLICKING = "com.wosguides.STOP_CLICKING";
    private static final String ACTION_SET_CLICK_POSITION = "com.wosguides.SET_CLICK_POSITION";
    public static final String ACTION_CLICK_PERFORMED = "com.wosguides.CLICK_PERFORMED";

    private Handler clickHandler;
    private boolean isClicking = false;
    private int clickX = 500; // Default click position
    private int clickY = 500;
    private static final int CLICK_INTERVAL = 500; // 500ms interval

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_START_CLICKING.equals(action)) {
                startClicking();
            } else if (ACTION_STOP_CLICKING.equals(action)) {
                stopClicking();
            } else if (ACTION_SET_CLICK_POSITION.equals(action)) {
                clickX = intent.getIntExtra("x", clickX);
                clickY = intent.getIntExtra("y", clickY);
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        clickHandler = new Handler(Looper.getMainLooper());

        // Register broadcast receiver
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_START_CLICKING);
        filter.addAction(ACTION_STOP_CLICKING);
        filter.addAction(ACTION_SET_CLICK_POSITION);
        LocalBroadcastManager.getInstance(this).registerReceiver(receiver, filter);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopClicking();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(receiver);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // We don't need to handle accessibility events for auto clicking
    }

    @Override
    public void onInterrupt() {
        stopClicking();
    }

    private void startClicking() {
        if (!isClicking) {
            isClicking = true;
            performClick();
        }
    }

    private void stopClicking() {
        isClicking = false;
        if (clickHandler != null) {
            clickHandler.removeCallbacksAndMessages(null);
        }
    }

    private void performClick() {
        if (!isClicking) return;

        // Create a gesture path for clicking
        Path clickPath = new Path();
        clickPath.moveTo(clickX, clickY);

        GestureDescription.StrokeDescription clickStroke = new GestureDescription.StrokeDescription(clickPath, 0, 50);
        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        gestureBuilder.addStroke(clickStroke);

        // Broadcast that click is about to be performed
        Intent clickIntent = new Intent(ACTION_CLICK_PERFORMED);
        LocalBroadcastManager.getInstance(this).sendBroadcast(clickIntent);

        // Perform the gesture
        boolean success = dispatchGesture(gestureBuilder.build(), new GestureResultCallback() {
            @Override
            public void onCompleted(GestureDescription gestureDescription) {
                super.onCompleted(gestureDescription);
                // Schedule next click
                if (isClicking) {
                    clickHandler.postDelayed(() -> performClick(), CLICK_INTERVAL);
                }
            }

            @Override
            public void onCancelled(GestureDescription gestureDescription) {
                super.onCancelled(gestureDescription);
                // Still schedule next click if we're supposed to be clicking
                if (isClicking) {
                    clickHandler.postDelayed(() -> performClick(), CLICK_INTERVAL);
                }
            }
        }, null);

        if (!success) {
            // Try again after interval
            if (isClicking) {
                clickHandler.postDelayed(() -> performClick(), CLICK_INTERVAL);
            }
        }
    }

    public static void sendStartClicking(Context context) {
        Intent intent = new Intent(ACTION_START_CLICKING);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    public static void sendStopClicking(Context context) {
        Intent intent = new Intent(ACTION_STOP_CLICKING);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }

    public static void sendSetClickPosition(Context context, int x, int y) {
        Intent intent = new Intent(ACTION_SET_CLICK_POSITION);
        intent.putExtra("x", x);
        intent.putExtra("y", y);
        LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
    }
}