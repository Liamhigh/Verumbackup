# Release Notes

## How to Create a Release with APK Files

When you're ready to create a new release with the APK files, follow these steps:

### 1. Build the APKs

First, ensure you have the latest APK files:

#### Production APK
```bash
# Build the web assets
npm run build

# Sync with Capacitor
npx cap sync

# Open in Android Studio and build the release APK
npx cap open android
```

From Android Studio:
- Select **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
- The APK will be generated in `android/app/build/outputs/apk/release/`

#### Debug APK
The debug APK is typically located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. Create the GitHub Release

1. Go to the repository on GitHub
2. Click on **Releases** in the right sidebar
3. Click **Draft a new release**
4. Choose a tag version (e.g., `v1.0.0`)
5. Enter a release title and description
6. Upload the APK files:
   - Drag and drop or select `verum-omnis-engine.apk` (production)
   - Drag and drop or select `app-debug.apk` (debug)
7. Click **Publish release**

### 3. Update Documentation

Make sure the links in `DOWNLOADS.md` and `README.md` point to the correct release.

## APK File Naming Convention

- **Production APK**: `verum-omnis-engine.apk` or `verum-omnis-engine-v{version}.apk`
- **Debug APK**: `app-debug.apk` or `app-debug-v{version}.apk`

## Notes

- APK files are excluded from git tracking (listed in `.gitignore`)
- Always test APKs before releasing
- Include release notes describing changes, features, and bug fixes
- Consider using GitHub Actions to automate the APK build and release process in the future
