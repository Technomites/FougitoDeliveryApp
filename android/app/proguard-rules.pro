# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ---------------------------------------------------------------------------
# R8 is on for release builds (Google Play "DEX code optimization /
# obfuscation"). React Native and most libraries ship their own consumer
# rules; the rules below are a safety net for code reached by reflection/JNI.
# ---------------------------------------------------------------------------

# React Native core / Hermes / JNI bridge
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod *; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactProp *; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactPropGroup *; }

# App
-keep class com.fougitodeliver.** { *; }

# Native modules linked by autolinking (kept whole: they are looked up by
# name from JS and several use reflection internally)
-keep class io.invertase.notifee.** { *; }
-keep class app.notifee.** { *; }
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.reactnativecommunity.clipboard.** { *; }
-keep class com.reactnativecommunity.checkbox.** { *; }
-keep class com.reactcommunity.rndatetimepicker.** { *; }
-keep class com.reactnativecommunity.geolocation.** { *; }
-keep class org.reactnative.maskedview.** { *; }
-keep class com.reactnativecommunity.netinfo.** { *; }
-keep class io.invertase.firebase.** { *; }
-keep class com.airbnb.android.react.lottie.** { *; }
-keep class com.rnbiometrics.** { *; }
-keep class com.learnium.RNDeviceInfo.** { *; }
-keep class com.dylanvann.fastimage.** { *; }
-keep class com.agontuk.RNFusedLocation.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.github.douglasjunior.reactNativeGetLocation.** { *; }
-keep class com.reactnative.ivpusic.imagepicker.** { *; }
-keep class com.rnmaps.maps.** { *; }
-keep class com.thebylito.navigationbarcolor.** { *; }
-keep class com.zoontek.rnpermissions.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.zmxv.RNSound.** { *; }
-keep class org.devio.rn.splashscreen.** { *; }
-keep class com.rnfingerprint.** { *; }
-keep class com.oblador.vectoricons.** { *; }
-keep class com.brentvatne.** { *; }
-keep class com.mrousavy.camera.** { *; }

# react-native-fast-image (Glide) — per the library README
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# react-native-image-crop-picker (uCrop) — per the library README
-keep class com.yalantis.ucrop** { *; }
-keep interface com.yalantis.ucrop** { *; }
-dontwarn com.yalantis.ucrop**
