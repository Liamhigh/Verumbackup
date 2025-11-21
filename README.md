# Verum Omnis - Forensic Engine

Verum Omnis is a powerful, court-ready forensic analysis engine with AI capabilities trained on real-life legal cases. It performs deep analysis on legal documents, images, and other evidence, producing comprehensive, cryptographically-sealed forensic reports.

Built as a Progressive Web App (PWA) and native Android application via Capacitor, it runs entirely on-device, ensuring user data is never uploaded or stored on external servers. The app functions seamlessly in modern web browsers, on Vercel cloud hosting, and as a native Android application.

**🏆 Gold Standard:** Evidence from this system has been accepted in court by law enforcement and law firms in South Africa and UAE.

## 📱 Download Android APK

**Get the latest version:** [Download APK from Releases](https://github.com/Liamhigh/Verumbackup/releases/latest)

The Android APK is automatically built and published with every release. Simply download and install on your Android device.

**Features:**
- ✅ **100% Free** - No costs, no subscriptions
- ✅ **Works Offline** - Full forensic analysis without internet
- ✅ **Court-Admissible** - Cryptographically sealed reports
- ✅ **Multi-Modal** - Analyzes images, audio, video, documents
- ✅ **Global** - Works in every jurisdiction on earth

## Use Cases

### 🏦 Fraud Firewall for Banks & Institutions
Verum Omnis serves as a **fraud detection and prevention firewall** for financial institutions, banks, and organizations:
- **Real-time Fraud Detection:** Analyzes transactions, communications, and documents to identify fraudulent patterns
- **Contradiction Detection:** Flags inconsistencies in financial statements, wire transfers, and authorization documents
- **Chain of Custody:** Maintains cryptographic proof of all analyzed evidence for regulatory compliance
- **Multi-jurisdictional Compliance:** Works across all legal jurisdictions globally (SA, UAE, international)
- **Automated Risk Assessment:** Provides quantified fraud probability scores and financial exposure estimates
- **Regulatory Reporting:** Generates court-ready reports for SAPS, UAE authorities, and international regulators
- **Document Verification:** SHA-256 hashing verifies authenticity of contracts, agreements, and financial documents

### 👤 Access to Justice for All
- **Free for Private Citizens:** Democratizes access to professional legal forensic analysis worldwide
- **No Geographic Barriers:** Works in every jurisdiction on earth
- **Offline Capability:** Functions without internet in remote or restricted areas
- **Court-Admissible Output:** All reports meet legal standards for evidence submission

## Key Features

-   **Court-Accepted Legal AI:** Trained on real-life cross-border legal cases with evidence accepted in court by law enforcement and law firms in South Africa and UAE. Represents the gold standard in legal forensics.
-   **Triple Verification Doctrine:** Every finding is verified through (1) Direct evidence analysis, (2) Cross-reference verification, and (3) Constitutional compliance checks.
-   **Contradiction Engine:** Advanced detection of conflicting statements, timeline impossibilities, and metadata anomalies with severity ratings.
-   **Universal Cryptographic Sealing:** ALL documents (uploaded evidence AND generated reports) are cryptographically sealed with SHA-256 hashing for tamper-evidence and court admissibility.
-   **Dual AI Engine:** Choose between OpenAI GPT-4 (legal expert mode) or Google Gemini API (general forensics), or use offline rule-based analysis.
-   **Offline Forensics Mode:** Fully functional without internet connection. Uses rule-based forensic analysis (V5 rules) to analyze evidence, detect contradictions, verify file integrity, and generate cryptographically sealed reports even when offline.
-   **Multi-modal Evidence Analysis:** Comprehensive support for all evidence types:
    - **Documents:** Text files, `.txt`, `.pdf`, Word documents
    - **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp` - Visual evidence analysis, metadata extraction, forensic image verification
    - **Audio:** `.mp3`, `.wav`, `.m4a`, `.ogg` - Voice analysis, audio forensics, voiceprint detection, conversation transcription
    - **Video:** `.mp4`, `.webm`, `.mov`, `.avi` - Video forensics, frame analysis, timeline verification, visual evidence extraction
    - **Financial Documents:** Bank statements, transaction records, invoices, contracts
-   **Legal Strategy & Document Guidance:** Provides court-ready legal strategy, draft communications for law enforcement/legal counsel, and guidance on document preparation.
-   **Structured Forensic Reports:** Generates highly-structured reports in Markdown with professional greeting, legal analysis, liability assessment, and strategic recommendations.
-   **Chain of Custody:** Complete audit trail with timestamps, hashes, and verification records for all uploaded and generated documents.
-   **Offline-First & Installable:** Fully functional without an internet connection for case preparation. It can be installed on any device as a PWA.
-   **Local Data Storage:** Uses IndexedDB for storing cases, reports, and evidence files locally on device, with optional Firebase sync for multi-device access.
-   **Production Ready:** Configured for deployment on Vercel, Firebase Hosting, and as a native Android application with Capacitor.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **AI Engines:** 
    - OpenAI GPT-4 (court-accepted legal expert - primary)
    - Google Gemini API (alternative forensics engine)
    - Offline rule-based analysis (no API required)
-   **PDF Generation:** jsPDF with cryptographic sealing
-   **Cryptography:** Web Crypto API (SHA-256 hashing)
-   **Native Runtime:** Capacitor for Android
-   **Hosting:** Vercel (primary), Firebase Hosting (alternative)
-   **Storage:** IndexedDB (local), Firebase Firestore (optional sync)
-   **CI/CD:** GitHub Actions

## Project Structure

```
/
├── .github/workflows/         # GitHub Actions for CI/CD
├── dist/                      # Production build output (generated)
├── src/
│   └── index.tsx              # Main React application component
├── android/                   # Native Android project (generated by Capacitor)
├── capacitor.config.json      # Capacitor configuration
├── firebase.json              # Firebase Hosting configuration
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
    git clone https://github.com/your-repo/verum-omnis-engine.git
    cd verum-omnis-engine
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **API Key Configuration:**
    Create a `.env` file in the root directory with your API keys:
    
    ```env
    # OpenAI API (recommended - for court-accepted legal expert analysis)
    VITE_OPENAI_API_KEY=your_openai_api_key_here
    
    # Google Gemini API (alternative)
    VITE_API_KEY=your_gemini_api_key_here
    
    # Choose preferred API: 'openai' or 'gemini'
    VITE_PREFERRED_API=openai
    ```
    
    **Notes:**
    - The app works fully offline without any API keys (uses rule-based analysis)
    - OpenAI API is recommended for legal cases as it has court-accepted credentials
    - Gemini API can be used as an alternative
    - Set `VITE_PREFERRED_API` to choose which AI engine to use when both are configured

4.  **Run the Development Server:**
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

This project is optimized for deployment on Vercel. The `vercel.json` configuration file ensures proper routing for the SPA and security headers.

**Deploy to Vercel:**

1.  Install Vercel CLI (optional):
    ```bash
    npm i -g vercel
    ```

2.  Deploy from the command line:
    ```bash
    vercel
    ```

3.  Or connect your GitHub repository to Vercel for automatic deployments on every push.

**Environment Variables:**
Set the following environment variables in your Vercel project settings:
-   `VITE_OPENAI_API_KEY`: Your OpenAI API key (recommended for legal cases)
-   `VITE_API_KEY`: Your Google Gemini API key (alternative)
-   `VITE_PREFERRED_API`: Set to `openai` or `gemini` (defaults to `openai`)

**Note:** The app works fully offline without any API keys.

### Firebase Hosting

This project is also configured for continuous deployment to Firebase Hosting. Every push to the `main` branch triggers the GitHub Actions workflow defined in `.github/workflows/firebase-hosting.yml`.

For Firebase deployment, configure these secrets in your GitHub repository settings:
-   `VITE_OPENAI_API_KEY`: Your OpenAI API key (recommended)
-   `VITE_API_KEY`: Your Google Gemini API key (optional)
-   `VITE_PREFERRED_API`: Preferred AI engine (`openai` or `gemini`)
-   `FIREBASE_SERVICE_ACCOUNT_VERUM_OMNIS_ENGINE`: The JSON content of your Firebase service account key.

## Mobile Development (Capacitor)

### Download Pre-built APK

**📱 Download the latest Android APK:**

1. Go to the [Releases page](https://github.com/Liamhigh/Verumbackup/releases)
2. Download the latest `app-release-unsigned.apk`
3. Install on your Android device

**Note:** You may need to enable "Install from Unknown Sources" in your Android settings.

The APK is automatically built and released on every push to the `main` branch via GitHub Actions.

### Build from Source

To build and run the application as a native Android app from source:

1.  **Build the Web Assets:**
    Ensure you have a fresh production build.
    ```bash
    npm run build
    ```

2.  **Sync Web Assets with Android Project:**
    This command copies your web build from `dist/` into the native Android project.
    ```bash
    npx cap sync android
    ```

3.  **Build APK:**
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
    The APK will be available at `android/app/build/outputs/apk/release/app-release-unsigned.apk`

4.  **Open in Android Studio (for development):**
    ```bash
    npx cap open android
    ```
    From Android Studio, you can run the app on an emulator or a connected physical device.

## Contributing

Contributions are welcome. Please open an issue to discuss any changes or submit a pull request with a clear description of your improvements.

## License

This project is licensed under the MIT License.
