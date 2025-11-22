# Downloads

This document provides information about downloading the pre-built Android APK files for Verum Omnis.

## Available Downloads

### Production APK
- **File:** `verum-omnis-engine.apk`
- **Size:** ~4MB
- **Description:** Production-ready Android application package
- **Download:** Available in [GitHub Releases](https://github.com/Liamhigh/Verumbackup/releases)

### Debug APK
- **File:** `app-debug.apk`
- **Size:** ~3.7MB
- **Description:** Debug version for development and testing
- **Download:** Available in [GitHub Releases](https://github.com/Liamhigh/Verumbackup/releases)

## How to Download

1. Visit the [Releases page](https://github.com/Liamhigh/Verumbackup/releases)
2. Find the latest release
3. Under "Assets", download the APK file you need:
   - `verum-omnis-engine.apk` - Production version
   - `app-debug.apk` - Debug version

## Installation Instructions

### Android Device Installation

1. Download the desired APK file to your Android device
2. Open the APK file from your downloads folder
3. If prompted, allow installation from unknown sources:
   - Go to **Settings** > **Security** > **Unknown Sources** and enable it
   - On Android 8.0+, you'll be prompted to allow installation from the specific source (browser, file manager, etc.)
4. Follow the on-screen prompts to complete the installation

### Using ADB (Android Debug Bridge)

If you have ADB installed, you can install the APK using:

```bash
adb install verum-omnis-engine.apk
```

or for the debug version:

```bash
adb install app-debug.apk
```

## Building from Source

If you prefer to build the APK yourself, follow the instructions in the [README.md](README.md) under the "Mobile Development (Capacitor)" section.

## Notes

- **Production APK (`verum-omnis-engine.apk`)**: Recommended for general use
- **Debug APK (`app-debug.apk`)**: Useful for development, testing, or debugging purposes
- Both APKs are signed and should work on any Android device with the appropriate permissions

## Troubleshooting

If you encounter issues installing or using the APK files:

1. Ensure you have enough storage space on your device
2. Check that you're downloading the correct APK for your needs
3. Try uninstalling any previous version before installing a new one
4. For the latest version, always check the [Releases page](https://github.com/Liamhigh/Verumbackup/releases)

## Security Note

Always download APK files from the official GitHub Releases page to ensure authenticity and security. Do not download APK files from third-party sources.
