# Verum Omnis V5 - Forensic Analysis Engine

Verum Omnis is a sophisticated forensic analysis engine featuring the **9 Brain Architecture**, **Triple Verification Doctrine**, and **Verum Constitutional Framework**. It performs comprehensive offline evidence analysis and integrates with OpenAI for advanced legal strategy recommendations.

## Constitutional Framework

Verum Omnis operates under a strict constitutional framework that ensures:
- **Truth Above All**: Objective truth without bias
- **Evidence Sovereignty**: Facts-first interpretation
- **Chain of Custody**: Verifiable integrity
- **Triple Verification**: Technical, Logical, and Contextual verification for every finding

## The 9 Brain Architecture

All evidence is processed through nine specialized analytical engines:

1. **B1: Contradiction Engine** - Detects logical inconsistencies and temporal impossibilities
2. **B2: Document & Image Forensics** - Validates file integrity via cryptographic hashing
3. **B3: Communications Integrity** - Verifies message authenticity and chain of correspondence
4. **B4: Linguistics & Behavioral** - Analyzes language patterns and deception indicators
5. **B5: Timeline Reconstruction** - Builds chronological sequences and detects anomalies
6. **B6: Financial Patterns** - Identifies irregular transactions and money laundering
7. **B7: Legal Framework** - Assesses liability and evaluates precedent alignment
8. **B8: Voice & Audio Forensics** - Validates audio authenticity
9. **B9: R&D Advisory** - Flags unprecedented patterns and novel anomalies

## Key Features

-   **100% Offline Forensic Analysis:** Initial analysis with 9 Brain Architecture requires no internet
-   **Triple Verification Doctrine:** Every finding verified through technical, logical, and contextual layers
-   **Cryptographic Evidence Sealing:** SHA-256 hashing for tamper-proof chain of custody
-   **Comprehensive Reports:** Court-ready forensic reports with detailed narratives
-   **OpenAI Legal Integration:** Optional advanced legal analysis and strategy (requires API key)
-   **Professional PDF Generation:** Download sealed reports for legal proceedings
-   **Local Data Storage:** All evidence stored in IndexedDB - complete privacy
-   **Cross-Platform:** Works in browsers and as native Android app

## Download Android APK

### Option 1: Download Pre-built APK (Recommended)
-   **[Download verum-omnis-engine.apk](verum-omnis-engine.apk)** (Click "Download" or "View raw")

### Option 2: GitHub Releases
-   Go to [Releases](../../releases) and download the APK from the latest release

### Option 3: Build Artifacts
1. Go to [Actions](../../actions/workflows/production.yml)
2. Click on the most recent successful workflow run
3. Download the `verum-omnis-release` artifact

### Installation
1. Download the APK
2. Enable "Install from Unknown Sources" on your Android device
3. Install the APK
4. **No setup required** - forensic analysis works immediately offline
5. **Optional**: Add OpenAI API key for legal advice features

## Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **PDF Generation:** jsPDF
-   **Markdown Processing:** marked
-   **Storage:** IndexedDB (fully offline)
-   **AI Integration:** OpenAI API (optional, user-provided key)
-   **Native Runtime:** Capacitor
-   **Web Hosting:** Vercel
-   **CI/CD:** GitHub Actions

## Usage Workflow

### 1. Evidence Upload & Forensic Analysis (Offline)
1. Enter a Case ID
2. Upload evidence files (documents, images, PDFs, audio, etc.)
3. Click "Run Forensic Analysis (9 Brains)"
4. System processes evidence through all 9 analytical engines
5. Generates comprehensive sealed forensic report with:
   - Executive Summary
   - Timeline of Events
   - 9 Brain Analysis Results
   - Evidence Breakdown
   - Preliminary Liability Assessment
   - Strategic Recommendations

### 2. Legal Analysis & Strategy (OpenAI Integration)
1. Review sealed forensic report
2. Optionally provide OpenAI API key
3. Ask specific legal questions or request full analysis
4. Receive:
   - Detailed content interpretation
   - Applicable statute identification
   - Criminal and civil liability assessment
   - Litigation strategy recommendations
   - Draft legal communications

### 3. Report Management
- Download forensic report as sealed PDF
- Download legal analysis as PDF
- Access previous cases from local storage
- Maintain complete chain of custody

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

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Application available at `http://localhost:5173`

4.  **Optional - OpenAI Integration:**
    - Obtain API key from [OpenAI Platform](https://platform.openai.com/)
    - Enter key in the application when requesting legal analysis
    - Or set `VITE_OPENAI_API_KEY` environment variable

## Build and Deployment

### Production Web Build
```bash
npm run build
```
Output in `dist/` directory.

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Automatic deployment on push to main
3. Zero configuration required (`vercel.json` included)

### Android APK Build
1.  **Build Web Assets:**
    ```bash
    npm run build
    ```

2.  **Sync with Capacitor:**
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```

## Security & Privacy

- ✅ All forensic analysis performed offline
- ✅ Evidence never uploaded unless you choose OpenAI integration
- ✅ Cryptographic sealing with SHA-256
- ✅ Complete chain of custody documentation
- ✅ Local-only storage (IndexedDB)
- ✅ User-controlled API keys (never stored in code)

## V5 Rules Engine

The system implements sophisticated detection rules across all 9 brains:
- Contradiction detection with severity levels (CRITICAL, HIGH, MEDIUM)
- Automated recovery procedures
- Escalation protocols
- Cross-brain verification

## Contributing

Contributions welcome. Open an issue to discuss changes or submit a pull request.

## License

MIT License

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
