package com.cgpacalculator.app;

import android.animation.ValueAnimator;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.animation.LinearInterpolator;

public class SplashActivity extends Activity {

    private StrokeTextView strokeView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        strokeView = new StrokeTextView(this);
        setContentView(strokeView);

        // After animation completes, launch the TWA
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(this, LauncherActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            startActivity(intent);
            overridePendingTransition(0, 0);
            finish();
        }, 2800);
    }

    /**
     * Custom View that draws "CGPA Calculator" with a stroke-tracing animation.
     * The text outline appears first, then fills in from left to right.
     */
    static class StrokeTextView extends View {
        private final Paint outlinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint fillPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint bgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private Path textPath = new Path();
        private Path fillPath = new Path();

        private float strokeWidth = 0f;
        private float fillProgress = 0f;   // 0..1 controls how much of the text is filled
        private float scaleValue = 0.92f;
        private float alphaOutline = 0f;
        private float alphaFill = 0f;

        private String line1 = "CGPA";
        private String line2 = "Calculator";

        StrokeTextView(android.content.Context ctx) {
            super(ctx);
            setLayerType(LAYER_TYPE_SOFTWARE, null);
            setBackgroundColor(Color.WHITE);
        }

        @Override
        protected void onDraw(Canvas canvas) {
            super.onDraw(canvas);

            // Background
            bgPaint.setColor(Color.WHITE);
            canvas.drawRect(0, 0, getWidth(), getHeight(), bgPaint);

            float w = getWidth();
            float h = getHeight();

            // --- Line 1: "CGPA" ---
            float size1 = w * 0.22f;
            Typeface bold = Typeface.DEFAULT_BOLD;
            Typeface mono = Typeface.create(bold, Typeface.BOLD);

            outlinePaint.setTextSize(size1);
            outlinePaint.setTypeface(mono);
            outlinePaint.setStyle(Paint.Style.STROKE);
            outlinePaint.setStrokeWidth(strokeWidth * w * 0.004f);
            outlinePaint.setColor(Color.parseColor("#059669"));
            outlinePaint.setStrokeCap(Paint.Cap.ROUND);
            outlinePaint.setStrokeJoin(Paint.Join.ROUND);
            outlinePaint.setAlpha((int) (alphaOutline * 255));

            fillPaint.setTextSize(size1);
            fillPaint.setTypeface(mono);
            fillPaint.setStyle(Paint.Style.FILL);
            fillPaint.setColor(Color.parseColor("#059669"));
            fillPaint.setAlpha((int) (alphaFill * 255));

            float tw1 = outlinePaint.measureText(line1);
            float x1 = (w - tw1) / 2f;
            float y1 = h * 0.42f;

            // Draw outline stroke
            outlinePaint.getTextPath(line1, 0, line1.length(), x1, y1, textPath);
            canvas.drawPath(textPath, outlinePaint);

            // Draw filled text clipped to fillProgress
            fillPaint.getTextPath(line1, 0, line1.length(), x1, y1, fillPath);
            canvas.save();
            canvas.clipRect(0, 0, w * fillProgress, h);
            canvas.drawPath(fillPath, fillPaint);
            canvas.restore();

            // --- Line 2: "Calculator" ---
            float size2 = w * 0.10f;

            outlinePaint.setTextSize(size2);
            outlinePaint.setTypeface(bold);
            outlinePaint.setAlpha((int) (alphaOutline * 255));

            fillPaint.setTextSize(size2);
            fillPaint.setTypeface(bold);
            fillPaint.setAlpha((int) (alphaFill * 255));

            float tw2 = outlinePaint.measureText(line2);
            float x2 = (w - tw2) / 2f;
            float y2 = y1 + size1 * 0.75f;

            outlinePaint.getTextPath(line2, 0, line2.length(), x2, y2, textPath);
            canvas.drawPath(textPath, outlinePaint);

            fillPaint.getTextPath(line2, 0, line2.length(), x2, y2, fillPath);
            canvas.save();
            canvas.clipRect(0, 0, w * fillProgress, h);
            canvas.drawPath(fillPath, fillPaint);
            canvas.restore();

            // --- Underline accent ---
            if (strokeWidth > 0.1f) {
                Paint linePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                linePaint.setColor(Color.parseColor("#059669"));
                linePaint.setStrokeWidth(size2 * 0.08f);
                linePaint.setStrokeCap(Paint.Cap.ROUND);
                linePaint.setAlpha((int) (alphaOutline * 180));

                float lineW = tw2 * fillProgress;
                float lineX1 = x2;
                float lineX2 = x2 + lineW;
                float lineY = y2 + size2 * 0.35f;
                canvas.drawLine(lineX1, lineY, lineX2, lineY, linePaint);
            }
        }

        void startAnimation() {
            // Phase 1: Stroke appears (0 -> 800ms)
            ValueAnimator strokeAnim = ValueAnimator.ofFloat(0f, 1f);
            strokeAnim.setDuration(800);
            strokeAnim.setInterpolator(new LinearInterpolator());
            strokeAnim.addUpdateListener(a -> {
                strokeWidth = (float) a.getAnimatedValue();
                alphaOutline = (float) a.getAnimatedValue();
                invalidate();
            });

            // Phase 2: Fill traces left-to-right (400ms -> 2200ms)
            ValueAnimator fillAnim = ValueAnimator.ofFloat(0f, 1f);
            fillAnim.setStartDelay(400);
            fillAnim.setDuration(1800);
            fillAnim.setInterpolator(new LinearInterpolator());
            fillAnim.addUpdateListener(a -> {
                fillProgress = (float) a.getAnimatedValue();
                alphaFill = Math.min(1f, fillProgress * 1.5f);
                invalidate();
            });

            // Phase 3: Subtle scale pulse at the end
            ValueAnimator scaleAnim = ValueAnimator.ofFloat(0.92f, 1f);
            scaleAnim.setStartDelay(2000);
            scaleAnim.setDuration(500);
            scaleAnim.setInterpolator(new android.view.animation.OvershootInterpolator(1.2f));
            scaleAnim.addUpdateListener(a -> {
                scaleValue = (float) a.getAnimatedValue();
                setScaleX(scaleValue);
                setScaleY(scaleValue);
            });

            strokeAnim.start();
            fillAnim.start();
            scaleAnim.start();
        }

        @Override
        protected void onAttachedToWindow() {
            super.onAttachedToWindow();
            post(this::startAnimation);
        }
    }
}
