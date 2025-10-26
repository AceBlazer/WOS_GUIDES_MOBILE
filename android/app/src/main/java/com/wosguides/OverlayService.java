package com.wosguides;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.OvershootInterpolator;
import android.widget.ImageButton;
import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class OverlayService extends Service {
    private static final String TAG = "OverlayService";

    private WindowManager windowManager;

    // Control button overlay
    private View controlOverlayView;
    private ImageButton startStopButton;
    private WindowManager.LayoutParams controlParams;

    // Target overlay (small draggable)
    private View targetContainer;
    private View clickTarget;
    private WindowManager.LayoutParams targetParams;

    private boolean isClicking = false;

    // For target dragging
    private int targetX = 525;  // Default position (will be adjusted for screen density)
    private int targetY = 525;
    private int containerCenterOffsetPx; // Offset to get from top-left to center of container in pixels

    // Broadcast receiver for click feedback
    private BroadcastReceiver clickReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (AutoClickerService.ACTION_CLICK_PERFORMED.equals(intent.getAction())) {
                animateClickFeedback();
            }
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        // Calculate pixel offset for container center (50dp container / 2 = 25dp)
        float density = getResources().getDisplayMetrics().density;
        containerCenterOffsetPx = (int) (25 * density); // 25dp converted to pixels

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        createOverlayView();

        // Register receiver for click feedback
        IntentFilter filter = new IntentFilter(AutoClickerService.ACTION_CLICK_PERFORMED);
        LocalBroadcastManager.getInstance(this).registerReceiver(clickReceiver, filter);
    }

    private void createOverlayView() {
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);

        // Create control button overlay
        createControlOverlay(inflater);

        // Create full-screen target overlay
        createTargetOverlay(inflater);
    }

    private void createControlOverlay(LayoutInflater inflater) {
        controlOverlayView = inflater.inflate(R.layout.control_button_layout, null);
        startStopButton = controlOverlayView.findViewById(R.id.startStopButton);
        updateButtonText();

        startStopButton.setOnClickListener(v -> {
            isClicking = !isClicking;
            updateButtonText();

            if (isClicking) {
                updateClickPosition();
                AutoClickerService.sendStartClicking(this);
            } else {
                AutoClickerService.sendStopClicking(this);
            }
        });

        // Set up control button window parameters
        int layoutType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutType = WindowManager.LayoutParams.TYPE_PHONE;
        }

        controlParams = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        // Position control button in center-left of screen
        controlParams.gravity = Gravity.CENTER_VERTICAL | Gravity.LEFT;
        controlParams.x = 20;
        controlParams.y = 0;

        // Add the control overlay to window manager
        windowManager.addView(controlOverlayView, controlParams);
    }

    private void createTargetOverlay(LayoutInflater inflater) {
        targetContainer = inflater.inflate(R.layout.draggable_target_layout, null);
        clickTarget = targetContainer.findViewById(R.id.clickTarget);

        // Set up target overlay window parameters (small draggable window)
        int layoutType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutType = WindowManager.LayoutParams.TYPE_PHONE;
        }

        targetParams = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        // Position target at default location (top-left corner of container)
        targetParams.gravity = Gravity.TOP | Gravity.LEFT;
        targetParams.x = 500; // Initial top-left position
        targetParams.y = 500;

        // Calculate center position for clicking
        targetX = targetParams.x + containerCenterOffsetPx;
        targetY = targetParams.y + containerCenterOffsetPx;

        // Add touch listener for target dragging to the container
        targetContainer.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = targetParams.x;
                        initialY = targetParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        clickTarget.setAlpha(0.7f);
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        targetParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        targetParams.y = initialY + (int) (event.getRawY() - initialTouchY);

                        // Update target position variables (adjust for container center offset in pixels)
                        targetX = targetParams.x + containerCenterOffsetPx; // Center of 50dp container
                        targetY = targetParams.y + containerCenterOffsetPx;

                        windowManager.updateViewLayout(targetContainer, targetParams);
                        updateClickPosition();
                        return true;

                    case MotionEvent.ACTION_UP:
                        clickTarget.setAlpha(1.0f);
                        updateClickPosition();
                        return true;

                    default:
                        return false;
                }
            }
        });

        // Add the target container to window manager
        windowManager.addView(targetContainer, targetParams);

        // Wait for the view to be measured, then calculate the actual center offset
        targetContainer.post(() -> {
            // Get the actual measured dimensions
            int containerWidth = targetContainer.getWidth();

            // Update offset to actual measured center
            containerCenterOffsetPx = containerWidth / 2;

            // The target is centered in the container, so container center = target center
            // Recalculate position with actual measurements
            targetX = targetParams.x + containerCenterOffsetPx;
            targetY = targetParams.y + containerCenterOffsetPx;

            // Initialize the click position
            updateClickPosition();
        });
    }

    private void updateButtonText() {
        if (startStopButton != null) {
            // Change icon and background based on clicking state
            if (isClicking) {
                startStopButton.setImageResource(R.drawable.ic_stop);
                startStopButton.setBackgroundResource(R.drawable.modern_stop_button);
            } else {
                startStopButton.setImageResource(R.drawable.ic_play);
                startStopButton.setBackgroundResource(R.drawable.modern_start_button);
            }
        }
    }

    private void updateClickPosition() {
        try {
            // Click position is the center of the visual target
            // targetX and targetY represent the center of the 50dp container
            int clickX = targetX;
            int clickY = targetY;

            // Send position to auto clicker service
            AutoClickerService.sendSetClickPosition(this, clickX, clickY);
        } catch (Exception e) {
            Log.e(TAG, "Error updating click position: " + e.getMessage());
        }
    }

    private void animateClickFeedback() {
        if (clickTarget != null) {
            // Scale animation - pulse effect
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(clickTarget, "scaleX", 1f, 1.4f, 1f);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(clickTarget, "scaleY", 1f, 1.4f, 1f);

            // Alpha animation - flash effect
            ObjectAnimator alpha = ObjectAnimator.ofFloat(clickTarget, "alpha", 1f, 0.5f, 1f);

            AnimatorSet animatorSet = new AnimatorSet();
            animatorSet.playTogether(scaleX, scaleY, alpha);
            animatorSet.setDuration(150); // Quick animation
            animatorSet.setInterpolator(new OvershootInterpolator());
            animatorSet.start();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // Unregister receiver
        LocalBroadcastManager.getInstance(this).unregisterReceiver(clickReceiver);

        if (windowManager != null) {
            if (controlOverlayView != null) {
                windowManager.removeView(controlOverlayView);
            }
            if (targetContainer != null) {
                windowManager.removeView(targetContainer);
            }
        }

        // Stop clicking when overlay is destroyed
        AutoClickerService.sendStopClicking(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY; // Restart service if killed
    }
}