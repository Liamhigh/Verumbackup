# Verum Omnis - Forensic Engine

Verum Omnis is a powerful, fully offline forensic analysis engine designed for processing legal documents, images, and other evidence. It generates comprehensive forensic reports entirely on-device, ensuring complete privacy and data security.

Built as a Progressive Web App (PWA) and native Android application via Capacitor, it operates 100% offline with no cloud dependencies, API keys, or external services required.

## Key Features

-   **100% Offline Operation:** All analysis is performed locally on your device with no internet required
-   **No API Keys Needed:** Works out-of-the-box without any configuration or setup
-   **Multi-format Evidence Support:** Analyzes text files, PDFs, images, and more
-   **Automated Forensic Checks:** Detects suspicious patterns, validates integrity, and flags potential issues
-   **Professional Reports:** Generates court-ready forensic reports in Markdown and PDF formats
-   **Local Data Storage:** All evidence and reports are stored in IndexedDB on your device
-   **Privacy First:** No data ever leaves your device - complete confidentiality guaranteed
-   **Cross-Platform:** Works in any modern web browser and as a native Android app

## Download Android APK

Get the Verum Omnis Android app for your device:

### Option 1: Download Pre-built APK (Recommended)
Download the latest pre-built APK directly from this repository:
-   **[Download verum-omnis-engine.apk](verum-omnis-engine.apk)** (Click "Download" or "View raw")

### Option 2: GitHub Releases
Download the latest release APK with version information:
-   Go to [Releases](../../releases) and download the APK from the latest release

### Option 3: Build Artifacts
Download APKs from recent builds:
1. Go to [Actions](../../actions/workflows/production.yml)
2. Click on the most recent successful workflow run
3. Scroll down to "Artifacts" section
4. Download the `verum-omnis-release` artifact

### Installation Instructions
1. Download the APK file using one of the methods above
2. On your Android device, go to **Settings** > **Security** and enable **"Install from Unknown Sources"** or **"Install Unknown Apps"** for your browser/file manager
3. Open the downloaded APK file
4. Tap **Install** and follow the prompts
5. Once installed, you can find "Verum Omnis" in your app drawer
6. **No API key or configuration needed** - just install and use!

**Note:** The APK is unsigned for development purposes. Your device may show a security warning - this is normal for apps not distributed through the Play Store.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **PDF Generation:** jsPDF
-   **Markdown Processing:** marked
-   **Storage:** IndexedDB (fully offline)
-   **Native Runtime:** Capacitor
-   **Web Hosting:** Vercel
-   **CI/CD:** GitHub Actions

## Project Structure

```
/
├── .github/workflows/         # GitHub Actions for CI/CD
├── dist/                      # Production build output (generated)
├── src/
│   ├── index.tsx              # Main React application
│   └── storage.ts             # IndexedDB storage layer
├── android/                   # Native Android project (Capacitor)
├── capacitor.config.json      # Capacitor configuration
├── vercel.json                # Vercel hosting configuration
├── index.html                 # Main HTML entry point
├── package.json
└── README.md                  # This file
```

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm (v8 or later)

### Local Development

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Liamhigh/Verumbackup.git
    cd Verumbackup
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Build and Deployment

### Production Web Build

To create an optimized production build of the web app:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

### Vercel Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration required

The `vercel.json` file contains all necessary settings for proper routing and headers.

## Mobile Development (Capacitor)

To build and run the application as a native Android app:

1.  **Build the Web Assets:**
    ```bash
    npm run build
    ```

2.  **Initialize the Android Platform** (if not already done):
    ```bash
    npx cap add android
    ```

3.  **Sync Web Assets with Android Project:**
    ```bash
    npx cap sync
    ```

4.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```
    From Android Studio, you can run the app on an emulator or a connected physical device.

## Usage

1. **Enter a Case ID** to identify your forensic analysis
2. **Upload Evidence Files** (documents, images, PDFs, etc.)
3. **Click "Analyze Evidence"** to perform offline forensic analysis
4. **Review the Report** generated with detailed findings
5. **Download as PDF** for court submission or archival
6. **Access Previous Cases** from local storage at any time

All data is stored locally on your device and never uploaded to any server.

## Contributing

Contributions are welcome. Please open an issue to discuss any changes or submit a pull request with a clear description of your improvements.

## License

This project is licensed under the MIT License.

    ```
    The application will be available at `http://localhost:5173`.

## Build and Deployment

### Production Web Build

To create an optimized production build of the web app:

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

### Firebase Hosting

This project is configured for continuous deployment to Firebase Hosting. Every push to the `main` branch triggers the GitHub Actions workflow defined in `.github/workflows/firebase-hosting.yml`. This workflow automatically builds and deploys the application.

For the workflow to succeed, you must configure the following secrets in your GitHub repository settings:
-   `VITE_API_KEY`: Your Google Gemini API key.
-   `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_ENGINE`: The JSON content of your Firebase service account key.

## Mobile Development (Capacitor)

To build and run the application as a native Android app:

1.  **Build the Web Assets:**
    Ensure you have a fresh production build.
    ```bash
    npm run build
    ```

2.  **Initialize the Android Platform:**
    This only needs to be done once to add the native Android project.
    ```bash
    npx cap add android
    ```

3.  **Sync Web Assets with Android Project:**
    This command copies your web build from `dist/` into the native Android project. Run this command every time you update your web code.
    ```bash
    npx cap sync
    ```

4.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```
    From Android Studio, you can run the app on an emulator or a connected physical device.

## Contributing

Contributions are welcome. Please open an issue to discuss any changes or submit a pull request with a clear description of your improvements.

## License

This project is licensed under the MIT License.
