package com.peerio.app;

import android.content.Intent;
import android.net.Uri;

public class Utils {
    static String getUriFromIntent(Intent intent) {
        if (intent.getExtras() != null) {
            if (Intent.ACTION_SEND.equals(intent.getAction()) && intent.getType() != null) {
                Uri fileUri = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
                
                if (fileUri != null) {
                    return fileUri.toString();
                }
            }
        }
        return "";
    }
}
