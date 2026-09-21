package org.thotnote.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        disableWebViewLongClick();
        final View content = findViewById(android.R.id.content);
        if (content != null) {
            content.setBackgroundColor(Color.WHITE);
        }
        if (Build.VERSION.SDK_INT < 35 || content == null) {
            return;
        }
        ViewCompat.setOnApplyWindowInsetsListener(content, (v, windowInsets) -> {
            Insets bars = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        disableWebViewLongClick();
    }

    // Android WebView opens a hidden text-selection overlay on long-press.
    // Clicks then die while scrolling still works.
    private void disableWebViewLongClick() {
        if (getBridge() == null) return;
        WebView webView = getBridge().getWebView();
        if (webView == null) return;
        webView.setLongClickable(false);
        webView.setHapticFeedbackEnabled(false);
        webView.setOnLongClickListener(view -> true);
    }
}
