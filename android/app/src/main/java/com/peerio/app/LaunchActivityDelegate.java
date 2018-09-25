package com.peerio.app;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivityDelegate;

public class LaunchActivityDelegate extends ReactActivityDelegate {
    private final @Nullable Activity mainActivity;
    private Bundle initialProps = new Bundle();

    public LaunchActivityDelegate(Activity activity, String mainComponentName) {
        super(activity, mainComponentName);
        this.mainActivity = activity;
    }

    @Override
    protected Bundle getLaunchOptions() {
        return initialProps;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Intent intent = mainActivity.getIntent();
        String fileUri = Utils.getUriFromIntent(intent);
        if (fileUri != null) {
            initialProps.putString("sharedFile", fileUri.toString());
        }
        
        super.onCreate(savedInstanceState);
    }
}
