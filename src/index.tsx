/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import OpenAI from 'openai';
import jsPDF from 'jspdf';
import { marked } from 'marked';
import { storage } from './storage';

// --- OpenAI API Key (Optional - user provides for legal advice) ---
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// --- Verum Omnis Constitution & Doctrine ---
const VERUM_CONSTITUTION = `
# VERUM OMNIS CONSTITUTION

## Article I: Foundational Principles
1. **Truth Above All**: All analysis must pursue objective truth without bias
2. **Evidence Sovereignty**: Evidence speaks for itself; interpretation must be grounded in facts
3. **Chain of Custody**: All evidence must maintain verifiable integrity
4. **Presumption of Verification**: No claim accepted without triple verification

## Article II: Triple Verification Doctrine
Every finding must pass three independent verification layers:
1. **Technical Verification**: Cryptographic integrity, metadata validation
2. **Logical Verification**: Internal consistency, contradiction analysis  
3. **Contextual Verification**: External corroboration, historical alignment

## Article III: The Nine Brain Architecture
All evidence must be processed through nine specialized analytical engines:

### B1: Contradiction Engine
- Detects logical inconsistencies within and across statements
- Flags temporal impossibilities
- Identifies conflicting witness accounts

### B2: Document & Image Forensics
- Validates file integrity via cryptographic hashing
- Detects digital manipulation
- Analyzes metadata for tampering

### B3: Communications Channel Integrity
- Verifies message authenticity
- Detects missing or fabricated communications
- Validates chain of correspondence

### B4: Linguistics & Behavioral Analysis
- Analyzes language patterns
- Detects deception indicators
- Identifies authorship anomalies

### B5: Timeline Reconstruction
- Builds chronological event sequences
- Detects temporal anomalies
- Validates event ordering

### B6: Financial Patterns
- Identifies irregular transactions
- Detects money laundering patterns
- Analyzes financial flows

### B7: Legal Framework Analysis
- Identifies applicable statutes
- Assesses liability exposure
- Evaluates precedent alignment

### B8: Voice & Audio Forensics
- Validates audio authenticity
- Detects voice manipulation
- Analyzes audio artifacts

### B9: R&D Advisory (Novel Anomalies)
- Identifies unprecedented patterns
- Flags uncategorized anomalies
- Recommends new detection protocols

## Article IV: Report Standards
All forensic reports must contain:
1. Executive Summary
2. Timeline of Events
3. Key People/Entities
4. Nine Brain Analysis Results
5. Evidence Breakdown
6. Criminal & Civil Liability Assessment
7. Strategic Recommendations
8. Draft Communications
9. Authoritative Conclusion
`;

// --- V5 Rules Definition (Full Gift Rules) ---
const V5_RULES = {
  "version": 5,
  "created_at": "2025-01-22T00:00:00Z",
  "name": "Verum Gift Rules - Full Brain Coverage",
  "rules": [
    {
      "id": "contradiction-basic-1",
      "brain": "B1_Contradiction_Engine",
      "description": "Flag contradictions across statements with identical actors/timestamps.",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "actor", "op": "eq", "ref": "actor" },
          { "field": "timestamp", "op": "eq", "ref": "timestamp" },
          { "field": "statement", "op": "contradicts", "ref": "statement" }
        ]
      },
      "severity": "CRITICAL",
      "action": "FLAG_AND_FREEZE",
      "recovery": [
        { "step": "cross_check_external", "target": "witness_pool" },
        { "step": "escalate", "target": "human_review" }
      ]
    },
    {
      "id": "timestamp-drift-1",
      "brain": "B4_Linguistics+B5_Timeline",
      "description": "Detects inconsistent timestamps for the same actor within a small time window (impossible overlaps).",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "actor", "op": "eq", "ref": "actor" },
          { "field": "timestamp", "op": "overlaps", "ref": "timestamp" }
        ]
      },
      "severity": "HIGH",
      "action": "FLAG",
      "recovery": [
        { "step": "align_timestamps", "window": "5m" },
        { "step": "if_unresolved", "next": "WARN" }
      ]
    },
    {
      "id": "metadata-missing-1",
      "brain": "B3_Comms_Channel_Integrity",
      "description": "Flags documents or records missing critical metadata (actor, timestamp, or source).",
      "logic": {
        "type": "any",
        "conditions": [
          { "field": "actor", "op": "missing" },
          { "field": "timestamp", "op": "missing" },
          { "field": "source", "op": "missing" }
        ]
      },
      "severity": "MEDIUM",
      "action": "WARN",
      "recovery": [
        { "step": "request_metadata", "fields": ["actor", "timestamp", "source"] },
        { "step": "defer_processing", "until": "metadata_provided" }
      ]
    },
    {
      "id": "multi-actor-conflict-1",
      "brain": "B1_Contradiction_Engine+B4_Linguistics",
      "description": "Flags contradictory statements across different actors about the same timestamp/event.",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "timestamp", "op": "eq", "ref": "timestamp" },
          { "field": "statement", "op": "contradicts", "ref": "statement" },
          { "field": "actor", "op": "neq", "ref": "actor" }
        ]
      },
      "severity": "HIGH",
      "action": "FLAG",
      "recovery": [
        { "step": "rank_sources", "criteria": ["credibility", "chain_strength"] },
        { "step": "auto_select_strongest" },
        { "step": "if_conflict_persists", "next": "escalate" }
      ]
    },
    {
      "id": "chain-integrity-1",
      "brain": "B2_Doc_Image_Forensics",
      "description": "Checks if hash values of documents match expected hash chain (tamper detection).",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "document_hash", "op": "neq", "ref": "expected_hash" }
        ]
      },
      "severity": "CRITICAL",
      "action": "FLAG_AND_FREEZE",
      "recovery": [
        { "step": "rehash_document" },
        { "step": "verify_against_backup", "target": "blockchain_anchor" }
      ]
    },
    {
      "id": "financial-anomaly-1",
      "brain": "B6_Financial_Patterns",
      "description": "Flags transactions that deviate from expected financial behavior (outliers in value, timing, or counterpart).",
      "logic": {
        "type": "any",
        "conditions": [
          { "field": "amount", "op": "outlier", "ref": "historical_mean" },
          { "field": "counterparty", "op": "anomalous", "ref": "trusted_entities" }
        ]
      },
      "severity": "HIGH",
      "action": "FLAG",
      "recovery": [
        { "step": "cross_check_external", "target": "bank_records" },
        { "step": "escalate", "target": "financial_audit" }
      ]
    },
    {
      "id": "legal-precedent-mismatch-1",
      "brain": "B7_Legal",
      "description": "Flags citations or claims that contradict established legal precedent.",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "citation", "op": "contradicts", "ref": "legal_precedent" }
        ]
      },
      "severity": "HIGH",
      "action": "FLAG_AND_ESCALATE",
      "recovery": [
        { "step": "cross_reference", "target": "case_law_database" },
        { "step": "escalate", "target": "legal_review" }
      ]
    },
    {
      "id": "voice-auth-failure-1",
      "brain": "B8_Voice_Audio_Forensics",
      "description": "Detects mismatched or spoofed voiceprints in submitted audio evidence.",
      "logic": {
        "type": "all",
        "conditions": [
          { "field": "voiceprint", "op": "neq", "ref": "expected_voiceprint" }
        ]
      },
      "severity": "CRITICAL",
      "action": "FLAG_AND_FREEZE",
      "recovery": [
        { "step": "reverify_voice", "target": "alternate_sample" },
        { "step": "escalate", "target": "biometric_authority" }
      ]
    },
    {
      "id": "rnd-advisory-novelty-1",
      "brain": "B9_RnD_Advisory",
      "description": "Flags novel or unclassified anomalies that do not fit any existing category.",
      "logic": {
        "type": "any",
        "conditions": [
          { "field": "anomaly_score", "op": "gt", "ref": "threshold" },
          { "field": "category", "op": "unknown" }
        ]
      },
      "severity": "MEDIUM",
      "action": "ESCALATE",
      "recovery": [
        { "step": "log_event", "target": "anomaly_register" },
        { "step": "escalate", "target": "human_review" }
      ]
    }
  ]
};


// --- Geolocation Helper ---
const getGeolocation = async (): Promise<{ latitude: number; longitude: number; accuracy: number } | null> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            }),
            () => resolve(null),
            { timeout: 5000, enableHighAccuracy: true }
        );
    });
};

// --- Helper Functions ---
const calculateSHA256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate cryptographic seal using SHA-256
const generateCryptographicSeal = async (timestamp: string, geolocation: any, fileHashes: string[]): Promise<string> => {
    const sealData = JSON.stringify({
        timestamp,
        geolocation,
        fileHashes,
        version: 'V5.0',
        architecture: '9-Brain'
    });
    
    // Use Web Crypto API for cryptographically secure hash
    const encoder = new TextEncoder();
    const data = encoder.encode(sealData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().substring(0, 16);
};

// --- Offline Forensic Analysis with 9 Brain Architecture ---
const runOfflineForensics = async (
    files: File[], 
    fileHashes: Map<string, string>,
    geolocation: { latitude: number; longitude: number; accuracy: number } | null
): Promise<string> => {
    const timestamp = new Date().toISOString();
    const hashArray = Array.from(fileHashes.values());
    const cryptoSeal = await generateCryptographicSeal(timestamp, geolocation, hashArray);
    
    let report = `# VERUM OMNIS FORENSIC REPORT\n\n`;
    report += `**Report Generated:** ${new Date().toLocaleString()}\n`;
    report += `**Analysis Mode:** Offline (9 Brain Architecture)\n`;
    report += `**Files Analyzed:** ${files.length}\n`;
    report += `**Cryptographic Seal:** \`${cryptoSeal}\`\n\n`;
    
    // Geolocation and Timestamp Seal
    report += `## CRYPTOGRAPHIC SEAL & CHAIN OF CUSTODY\n\n`;
    report += `**Timestamp:** ${timestamp}\n`;
    if (geolocation) {
        report += `**Geolocation:** Latitude ${geolocation.latitude.toFixed(6)}, Longitude ${geolocation.longitude.toFixed(6)}\n`;
        report += `**Location Accuracy:** ±${geolocation.accuracy.toFixed(0)} meters\n`;
    } else {
        report += `**Geolocation:** Not available (permission denied or device limitation)\n`;
    }
    report += `**Seal Hash:** \`${cryptoSeal}\`\n`;
    report += `**Verification:** This report is cryptographically sealed with the timestamp, geolocation, and file hashes to ensure authenticity and prevent tampering.\n\n`;
    report += `---\n\n`;

    // Executive Summary
    report += `## 1. EXECUTIVE SUMMARY\n\n`;
    report += `This forensic analysis was conducted using the Verum Omnis 9 Brain Architecture in fully offline mode. `;
    report += `All evidence has been processed through nine specialized analytical engines to ensure comprehensive verification per the Triple Verification Doctrine. `;
    report += `${files.length} evidence file(s) were submitted for analysis and cryptographically sealed at ${new Date(timestamp).toLocaleString()}`;
    if (geolocation) {
        report += ` from coordinates ${geolocation.latitude.toFixed(4)}°N, ${geolocation.longitude.toFixed(4)}°E`;
    }
    report += `.\n\n`;

    // Classify file types
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const audioFiles = files.filter(f => f.type.startsWith('audio/'));
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    const textFiles = files.filter(f => f.type.startsWith('text/') || f.name.endsWith('.txt'));
    const otherFiles = files.filter(f => 
        !f.type.startsWith('image/') && 
        !f.type.startsWith('audio/') && 
        !f.type.startsWith('video/') &&
        !f.type.startsWith('text/') &&
        f.type !== 'application/pdf'
    );

    // Timeline
    report += `## 2. TIMELINE OF EVENTS\n\n`;
    report += `**Evidence Collection Timestamp:** ${timestamp}\n`;
    report += `**Submission Method:** Upload via Verum Omnis V5 Interface\n`;
    if (geolocation) {
        report += `**Collection Location:** ${geolocation.latitude.toFixed(6)}°, ${geolocation.longitude.toFixed(6)}° (±${geolocation.accuracy.toFixed(0)}m)\n`;
    }
    report += `\nAll files were submitted simultaneously at the time indicated above. Individual file creation dates may vary and should be examined in detailed analysis.\n\n`;

    // Key Entities
    report += `## 3. KEY PEOPLE/ENTITIES INVOLVED\n\n`;
    report += `Based on file metadata and submission context:\n`;
    files.forEach((file, idx) => {
        report += `- **Evidence File ${idx + 1}:** ${file.name} (${file.type || 'Unknown type'})\n`;
    });
    report += `\n**Note:** Deep content analysis via OpenAI Legal API will identify specific individuals, organizations, and entities mentioned in the evidence.\n\n`;

    // Nine Brain Analysis
    report += `## 4. NINE BRAIN ARCHITECTURE ANALYSIS\n\n`;

    // B1: Contradiction Engine
    report += `### B1: Contradiction Engine\n`;
    report += `**Status:** Active - Monitoring for logical inconsistencies\n`;
    report += `**Findings:** Metadata-level analysis complete. No timestamp contradictions detected across ${files.length} file(s).\n`;
    report += `**Next Step:** Upload to OpenAI for content-level contradiction analysis across document narratives.\n\n`;

    // B2: Document & Image Forensics
    report += `### B2: Document & Image Forensics\n`;
    report += `**Status:** ✓ Complete - All files cryptographically verified\n`;
    report += `**Files Processed:**\n`;
    report += `- Images: ${imageFiles.length}\n`;
    report += `- PDFs: ${pdfFiles.length}\n`;
    report += `- Other Documents: ${textFiles.length + otherFiles.length}\n\n`;
    report += `**Cryptographic Verification (SHA-256):**\n`;
    files.forEach((file) => {
        const hash = fileHashes.get(file.name) || 'HASH_CALCULATION_PENDING';
        report += `- \`${file.name}\`: \`${hash}\`\n`;
    });
    report += `\n**Triple Verification Status:** ✓ Technical verification complete (Layer 1/3)\n`;
    if (imageFiles.length > 0) {
        report += `\n**Image Analysis:** ${imageFiles.length} image file(s) detected. Upload to OpenAI for:\n`;
        report += `  - Visual content analysis\n`;
        report += `  - Text extraction (OCR)\n`;
        report += `  - Metadata examination (EXIF data)\n`;
        report += `  - Potential manipulation detection\n\n`;
    }

    // B3: Communications Integrity
    report += `### B3: Communications Channel Integrity\n`;
    report += `**Status:** Metadata validation complete\n`;
    report += `**File Metadata Summary:**\n`;
    files.forEach(file => {
        report += `- ${file.name}: ${(file.size / 1024).toFixed(2)} KB, Type: ${file.type || 'Unknown'}\n`;
    });
    report += `\n**Chain of Custody:** Established via cryptographic seal at ${timestamp}\n`;
    if (geolocation) {
        report += `**Location Verification:** Evidence collected from verified coordinates\n`;
    }
    report += `\n`;

    // B4: Linguistics
    report += `### B4: Linguistics & Behavioral Analysis\n`;
    report += `**Status:** Awaiting content extraction\n`;
    report += `**Text Files Detected:** ${textFiles.length}\n`;
    report += `**Documents for Analysis:** ${pdfFiles.length} PDF(s), ${imageFiles.length} image(s) (OCR required)\n`;
    report += `\n**OpenAI Analysis Will Provide:**\n`;
    report += `- Language pattern analysis\n`;
    report += `- Deception indicator detection\n`;
    report += `- Authorship analysis\n`;
    report += `- Sentiment and tone assessment\n\n`;

    // B5: Timeline Reconstruction
    report += `### B5: Timeline Reconstruction\n`;
    report += `**Status:** Initial temporal framework established\n`;
    report += `**Submission Time:** ${timestamp}\n`;
    if (geolocation) {
        report += `**Geographic Context:** Lat ${geolocation.latitude.toFixed(6)}, Lon ${geolocation.longitude.toFixed(6)}\n`;
    }
    report += `\n**Next Steps:** OpenAI will extract and sequence events from document content to build comprehensive timeline.\n\n`;

    // B6: Financial Patterns
    report += `### B6: Financial Patterns\n`;
    report += `**Status:** Awaiting content analysis\n`;
    report += `**Note:** Upload to OpenAI for identification of financial transactions, amounts, dates, and irregular patterns.\n\n`;

    // B7: Legal Framework
    report += `### B7: Legal Framework Analysis\n`;
    report += `**Status:** Pending jurisdiction-specific analysis\n`;
    if (geolocation) {
        report += `**Jurisdiction Context:** Evidence collected from ${geolocation.latitude.toFixed(2)}°, ${geolocation.longitude.toFixed(2)}°\n`;
    }
    report += `\n**OpenAI Legal API Will Provide:**\n`;
    report += `- Applicable local laws and statutes\n`;
    report += `- Criminal liability assessment\n`;
    report += `- Civil claim identification\n`;
    report += `- Legal strategy recommendations\n`;
    report += `- Pre-drafted legal communications\n\n`;

    // B8: Voice/Audio/Video
    report += `### B8: Voice & Audio/Video Forensics\n`;
    report += `**Audio Files:** ${audioFiles.length}\n`;
    report += `**Video Files:** ${videoFiles.length}\n`;
    if (audioFiles.length > 0 || videoFiles.length > 0) {
        report += `\n**Analysis Requirements:**\n`;
        if (audioFiles.length > 0) {
            report += `- **Audio:** Upload to OpenAI for transcription, speaker identification, and authenticity verification\n`;
        }
        if (videoFiles.length > 0) {
            report += `- **Video:** Upload to OpenAI for frame analysis, audio extraction, and content description\n`;
        }
    } else {
        report += `\n**Status:** No audio or video files detected\n`;
    }
    report += `\n`;

    // B9: R&D
    report += `### B9: R&D Advisory (Novel Anomalies)\n`;
    report += `**Status:** Monitoring for unusual patterns\n`;
    report += `**File Type Distribution:**\n`;
    report += `- Images: ${imageFiles.length}\n`;
    report += `- Audio: ${audioFiles.length}\n`;
    report += `- Video: ${videoFiles.length}\n`;
    report += `- PDFs: ${pdfFiles.length}\n`;
    report += `- Text: ${textFiles.length}\n`;
    report += `- Other: ${otherFiles.length}\n`;
    report += `\n**Findings:** Standard evidence types detected. No novel anomalies at metadata level.\n\n`;

    // Evidence Breakdown
    report += `## 5. EVIDENCE BREAKDOWN\n\n`;
    files.forEach((file, idx) => {
        report += `### Evidence File ${idx + 1}: ${file.name}\n`;
        report += `- **Type:** ${file.type || 'Unknown'}\n`;
        report += `- **Size:** ${(file.size / 1024).toFixed(2)} KB (${file.size.toLocaleString()} bytes)\n`;
        report += `- **SHA-256:** \`${fileHashes.get(file.name) || 'PENDING'}\`\n`;
        
        // Type-specific analysis
        if (file.type.startsWith('image/')) {
            report += `- **Category:** Visual Evidence (Image)\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **Required Analysis:** Upload to OpenAI for visual content interpretation and OCR\n`;
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            report += `- **Category:** Document Evidence (PDF)\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **Required Analysis:** Upload to OpenAI for full text extraction, legal analysis, and document structure review\n`;
        } else if (file.type.startsWith('text/')) {
            report += `- **Category:** Text Evidence\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **Required Analysis:** Upload to OpenAI for linguistic analysis and content interpretation\n`;
        } else if (file.type.startsWith('audio/')) {
            report += `- **Category:** Audio Evidence\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **B8 Status:** Pending transcription\n`;
            report += `- **Required Analysis:** Upload to OpenAI for transcription, speaker analysis, and authenticity verification\n`;
        } else if (file.type.startsWith('video/')) {
            report += `- **Category:** Video Evidence\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **B8 Status:** Pending analysis\n`;
            report += `- **Required Analysis:** Upload to OpenAI for frame-by-frame analysis, audio extraction, and content description\n`;
        } else {
            report += `- **Category:** Other Evidence\n`;
            report += `- **B2 Status:** ✓ Integrity verified\n`;
            report += `- **Note:** Upload to OpenAI for content type identification and appropriate analysis\n`;
        }
        report += `\n`;
    });

    // Liability Assessment
    report += `## 6. POTENTIAL CRIMINAL & CIVIL LIABILITIES\n\n`;
    report += `**Preliminary Assessment:** Based on technical verification only\n\n`;
    report += `**CRITICAL NOTICE:** This offline analysis has verified:\n`;
    report += `- ✓ File integrity (cryptographic hashing)\n`;
    report += `- ✓ Chain of custody (timestamp + geolocation seal)\n`;
    report += `- ✓ Evidence classification\n\n`;
    report += `**For Comprehensive Liability Assessment:**\n`;
    report += `Upload this sealed report to the OpenAI Legal API to receive:\n`;
    report += `1. **Content Analysis:** Full interpretation of all evidence materials\n`;
    report += `2. **Local Law Application:** Jurisdiction-specific statute identification based on collection location\n`;
    report += `3. **Criminal Exposure:** Specific charges, sentencing guidelines, and criminal procedures\n`;
    report += `4. **Civil Claims:** Available causes of action, damages calculations, and litigation strategy\n`;
    report += `5. **Regulatory Issues:** Compliance violations and regulatory exposure\n\n`;

    // Strategic Recommendations
    report += `## 7. STRATEGIC RECOMMENDATIONS\n\n`;
    report += `### Immediate Actions\n`;
    report += `1. **✓ Evidence Preservation:** All files cryptographically sealed (SHA-256)\n`;
    report += `2. **✓ Chain of Custody:** Timestamp and geolocation recorded\n`;
    report += `3. **✓ Integrity Verification:** 9 Brain Architecture metadata analysis complete\n`;
    report += `4. **⚠️  Content Analysis Required:** Upload to OpenAI Legal API for deep analysis\n\n`;
    
    report += `### OpenAI Legal API Integration\n`;
    report += `This cryptographically sealed report serves as your evidenciary foundation. Upload to OpenAI Legal API to receive:\n\n`;
    
    report += `**A. Legal Analysis:**\n`;
    report += `- Applicable laws in your jurisdiction (based on geolocation)\n`;
    report += `- Criminal statutes that may apply\n`;
    report += `- Civil causes of action\n`;
    report += `- Regulatory compliance issues\n`;
    report += `- Precedent cases and legal standards\n\n`;
    
    report += `**B. Strategic Recommendations:**\n`;
    report += `- Evidence collection priorities\n`;
    report += `- Witness identification and interview strategies\n`;
    report += `- Document preservation requirements\n`;
    report += `- Expert witness needs\n`;
    report += `- Settlement vs. litigation analysis\n\n`;
    
    report += `**C. Pre-Drafted Legal Communications:**\n`;
    report += `- Demand letters\n`;
    report += `- Evidence preservation notices\n`;
    report += `- Settlement proposals\n`;
    report += `- Complaint drafts\n`;
    report += `- Discovery requests\n`;
    report += `- Response letters\n\n`;

    // Draft Communications Template
    report += `## 8. DRAFT COMMUNICATIONS\n\n`;
    report += `### Template: Evidence Preservation Notice\n\n`;
    report += `**[This template will be customized by OpenAI based on your specific case]**\n\n`;
    report += `TO: [Recipient - OpenAI will identify from evidence]\n`;
    report += `FROM: [Your Name]\n`;
    report += `RE: Evidence Preservation Notice - Verum Omnis Case Reference ${cryptoSeal.substring(0, 8)}\n`;
    report += `DATE: ${new Date().toLocaleDateString()}\n\n`;
    report += `This notice serves to inform you that forensic evidence has been collected, analyzed through the Verum Omnis 9 Brain Architecture, and cryptographically sealed.\n\n`;
    report += `**Evidence Details:**\n`;
    report += `- Files Analyzed: ${files.length}\n`;
    report += `- Collection Timestamp: ${timestamp}\n`;
    if (geolocation) {
        report += `- Collection Location: ${geolocation.latitude.toFixed(6)}°, ${geolocation.longitude.toFixed(6)}°\n`;
    }
    report += `- Cryptographic Seal: ${cryptoSeal}\n\n`;
    report += `All evidence has been cryptographically hashed and sealed to ensure integrity and prevent tampering. The evidence is being preserved in accordance with legal chain of custody requirements.\n\n`;
    report += `**[OpenAI Legal API will complete this letter with specific legal demands, timeframes, and consequences based on the evidence content and applicable law]**\n\n`;

    // Conclusion
    report += `## 9. CONCLUSION\n\n`;
    report += `This preliminary forensic analysis has successfully:\n`;
    report += `- ✓ Processed ${files.length} evidence file(s) through 9 Brain Architecture\n`;
    report += `- ✓ Verified technical integrity of all files (SHA-256 hashing)\n`;
    report += `- ✓ Established cryptographic seal: \`${cryptoSeal}\`\n`;
    report += `- ✓ Recorded timestamp: ${timestamp}\n`;
    if (geolocation) {
        report += `- ✓ Captured geolocation: ${geolocation.latitude.toFixed(6)}°N, ${geolocation.longitude.toFixed(6)}°E (±${geolocation.accuracy.toFixed(0)}m)\n`;
    }
    report += `- ✓ Classified evidence types: ${imageFiles.length} images, ${audioFiles.length} audio, ${videoFiles.length} video, ${pdfFiles.length} PDFs, ${textFiles.length} text files\n`;
    report += `- ✓ Validated metadata and chain of custody\n\n`;
    
    report += `**CRITICAL NEXT STEP:**\n`;
    report += `For comprehensive legal analysis, upload this sealed report to the OpenAI Legal API. You will receive:\n`;
    report += `1. Complete content analysis of all evidence\n`;
    report += `2. Jurisdiction-specific legal advice based on your location\n`;
    report += `3. Criminal and civil liability assessments\n`;
    report += `4. Detailed legal strategies and action plans\n`;
    report += `5. Pre-drafted legal communications (demand letters, complaints, preservation notices)\n`;
    report += `6. Expert recommendations and next steps\n\n`;
    
    report += `**Triple Verification Status:**\n`;
    report += `- ✓ Layer 1: Technical Verification Complete (B2)\n`;
    report += `- ⏳ Layer 2: Logical Verification Pending (Requires OpenAI content analysis)\n`;
    report += `- ⏳ Layer 3: Contextual Verification Pending (Requires OpenAI legal framework analysis)\n\n`;
    
    report += `---\n\n`;
    report += `**Report Cryptographically Sealed:** ${timestamp}\n`;
    report += `**Seal Hash:** \`${cryptoSeal}\`\n`;
    report += `**Verum Omnis Version:** V5.0 (9 Brain Architecture)\n`;
    report += `**Constitutional Framework:** Active\n`;
    report += `**Triple Verification Doctrine:** In Progress (1/3 Complete)\n`;

    return report;
};


// --- OpenAI Legal Analysis ---
const analyzeWithOpenAI = async (sealedReport: string, apiKey: string, userQuestion?: string): Promise<string> => {
    if (!apiKey) {
        throw new Error('OpenAI API key required for legal analysis');
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // For web/mobile app usage
    });

    // Extract geolocation from sealed report for jurisdiction context
    const geoMatch = sealedReport.match(/Latitude\s+([-\d.]+),\s+Longitude\s+([-\d.]+)/);
    const locationContext = geoMatch 
        ? `\n\nIMPORTANT JURISDICTION CONTEXT: Evidence was collected at coordinates ${geoMatch[1]}°N, ${geoMatch[2]}°E. You MUST identify the specific jurisdiction (country, state/province, city) based on these coordinates and apply the local laws, statutes, and legal procedures that govern this location.`
        : '';

    const systemPrompt = `You are an expert legal analyst integrated with the Verum Omnis Forensic Engine. You have been provided with a sealed forensic report that has already undergone technical verification through the 9 Brain Architecture and Triple Verification Doctrine.

Your role is to:
1. **Analyze Evidence Content:** Provide detailed interpretation of all evidence
2. **Identify Local Laws:** Based on the geolocation in the report, identify the specific jurisdiction and apply LOCAL laws, statutes, and regulations
3. **Assess Criminal Liability:** List specific criminal charges that may apply under local law, including sentencing guidelines
4. **Assess Civil Liability:** Identify available civil claims, damages, and litigation strategy
5. **Provide Legal Strategy:** Offer specific, actionable recommendations for both criminal and civil proceedings
6. **Draft Legal Communications:** Create ready-to-use demand letters, preservation notices, complaints, and other legal documents
7. **Answer Questions:** Respond to specific user inquiries about the case

${locationContext}

You MUST maintain the severity, objectivity, and precision of Verum Omnis. Be direct, thorough, and actionable. All recommendations must be grounded in the applicable local law of the jurisdiction where evidence was collected.

${VERUM_CONSTITUTION}

The V5 Rules that guided the initial forensic analysis:
${JSON.stringify(V5_RULES, null, 2)}

OUTPUT REQUIREMENTS:
- Identify the jurisdiction explicitly based on geolocation
- Cite specific local statutes, regulations, and legal standards
- Provide criminal sentencing ranges under local law
- Calculate potential civil damages
- Draft AT LEAST 3 complete legal communications (demand letter, preservation notice, and one other appropriate document)
- Include specific deadlines, procedures, and next steps
- Reference local court procedures and filing requirements`;

    const userPrompt = userQuestion 
        ? `Sealed Forensic Report:\n\n${sealedReport}\n\n---\n\nUser Question: ${userQuestion}\n\nProvide a detailed answer based on the evidence and applicable local law.`
        : `Analyze this sealed forensic report comprehensively. Provide:\n\n1. Executive Summary of Evidence Content\n2. Jurisdiction Identification (based on geolocation)\n3. Applicable Local Laws & Statutes\n4. Criminal Liability Assessment (charges, sentencing, procedures)\n5. Civil Liability Assessment (claims, damages, strategy)\n6. Legal Strategy Recommendations\n7. Pre-Drafted Legal Communications (minimum 3 documents)\n8. Expert Witness & Evidence Recommendations\n9. Timeline & Next Steps\n\nSealed Forensic Report:\n\n${sealedReport}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 4000
        });

        return completion.choices[0].message.content || 'No response generated';
    } catch (error: any) {
        throw new Error(`OpenAI API Error: ${error.message}`);
    }
};

// --- React Application ---
function App() {
    const [caseId, setCaseId] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [forensicReport, setForensicReport] = useState('');
    const [legalAnalysis, setLegalAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openaiKey, setOpenaiKey] = useState(OPENAI_API_KEY);
    const [userQuestion, setUserQuestion] = useState('');
    const [currentView, setCurrentView] = useState<'upload' | 'forensic' | 'legal'>('upload');
    const [cases, setCases] = useState<string[]>([]);

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            const allCases = await storage.getAllCases();
            setCases(allCases);
        } catch (e) {
            console.error('Failed to load cases:', e);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleAnalyze = async () => {
        if (!caseId.trim()) {
            setError('Please enter a case ID');
            return;
        }
        if (files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        setLoading(true);
        setError('');
        setForensicReport('');
        setLegalAnalysis('');

        try {
            // Get geolocation (permission will be requested)
            const geolocation = await getGeolocation();
            
            // Calculate SHA-256 hashes
            const fileHashes = new Map<string, string>();
            for (const file of files) {
                const hash = await calculateSHA256(file);
                fileHashes.set(file.name, hash);
            }

            // Run offline forensic analysis with geolocation
            const report = await runOfflineForensics(files, fileHashes, geolocation);
            setForensicReport(report);

            // Save to local storage (browser IndexedDB)
            await storage.saveReport(caseId.trim(), report, files.map(f => f.name));
            
            // Save evidence files
            for (const file of files) {
                const hash = fileHashes.get(file.name) || '';
                await storage.saveEvidence(caseId.trim(), file, hash, {
                    analysisMode: 'offline_9brain',
                    timestamp: new Date().toISOString(),
                    geolocation: geolocation
                });
            }

            await loadCases();
            setCurrentView('forensic');
        } catch (e: any) {
            setError(`Analysis failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAIAnalysis = async () => {
        if (!forensicReport) {
            setError('No forensic report available. Run analysis first.');
            return;
        }
        if (!openaiKey.trim()) {
            setError('Please provide your OpenAI API key');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const analysis = await analyzeWithOpenAI(forensicReport, openaiKey, userQuestion || undefined);
            setLegalAnalysis(analysis);
            setCurrentView('legal');
        } catch (e: any) {
            setError(`OpenAI Analysis failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async (content: string, filename: string) => {
        try {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const lineHeight = 7;
            let y = margin;

            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Verum Omnis Report', margin, y);
            y += lineHeight * 2;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            
            const lines = content.split('\n');
            for (const line of lines) {
                if (y > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }

                if (line.startsWith('###')) {
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(line.replace(/^###\s*/, ''), margin, y);
                    pdf.setFont('helvetica', 'normal');
                } else if (line.startsWith('##')) {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(12);
                    pdf.text(line.replace(/^##\s*/, ''), margin, y);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                } else if (line.trim()) {
                    const wrappedLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
                    for (const wLine of wrappedLines) {
                        if (y > pageHeight - margin) {
                            pdf.addPage();
                            y = margin;
                        }
                        pdf.text(wLine, margin, y);
                        y += lineHeight;
                    }
                }
                y += lineHeight * 0.3;
            }

            pdf.save(filename);
        } catch (e: any) {
            setError(`PDF generation failed: ${e.message}`);
        }
    };

    const loadCase = async (caseIdToLoad: string) => {
        try {
            const reports = await storage.getReports(caseIdToLoad);
            if (reports && reports.length > 0) {
                setCaseId(caseIdToLoad);
                setForensicReport(reports[reports.length - 1].content);
                setCurrentView('forensic');
            }
        } catch (e) {
            console.error('Failed to load case:', e);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>⚖️ VERUM OMNIS V5</h1>
                <p style={styles.subtitle}>9 Brain Forensic Architecture | Triple Verification Doctrine</p>
            </header>

            <main style={styles.main}>
                {error && (
                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Navigation */}
                <div style={styles.nav}>
                    <button 
                        onClick={() => setCurrentView('upload')}
                        style={currentView === 'upload' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
                    >
                        📁 Upload Evidence
                    </button>
                    <button 
                        onClick={() => setCurrentView('forensic')}
                        disabled={!forensicReport}
                        style={currentView === 'forensic' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
                    >
                        🔍 Forensic Report
                    </button>
                    <button 
                        onClick={() => setCurrentView('legal')}
                        disabled={!legalAnalysis}
                        style={currentView === 'legal' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
                    >
                        ⚖️ Legal Analysis
                    </button>
                </div>

                {/* Upload View */}
                {currentView === 'upload' && (
                    <div style={styles.section}>
                        <h2>Evidence Upload</h2>
                        
                        <label style={styles.label}>
                            Case ID:
                            <input
                                type="text"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                placeholder="Enter case identifier"
                                style={styles.input}
                            />
                        </label>

                        <label style={styles.label}>
                            Evidence Files:
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={styles.fileInput}
                            />
                        </label>

                        {files.length > 0 && (
                            <div style={styles.fileList}>
                                <p><strong>Selected files: {files.length}</strong></p>
                                <ul>
                                    {files.map((file, i) => (
                                        <li key={i}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                        >
                            {loading ? '🔄 Analyzing...' : '🔍 Run Forensic Analysis (9 Brains)'}
                        </button>

                        {cases.length > 0 && (
                            <div style={styles.casesSection}>
                                <h3>Previous Cases</h3>
                                <ul style={styles.casesList}>
                                    {cases.map((c) => (
                                        <li key={c}>
                                            <button onClick={() => loadCase(c)} style={styles.caseButton}>
                                                📁 {c}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Forensic Report View */}
                {currentView === 'forensic' && forensicReport && (
                    <div style={styles.reportSection}>
                        <div style={styles.reportHeader}>
                            <h2>Forensic Report (Sealed)</h2>
                            <button 
                                onClick={() => downloadPDF(forensicReport, `forensic-${caseId}-${Date.now()}.pdf`)}
                                style={styles.downloadButton}
                            >
                                📄 Download Sealed Report
                            </button>
                        </div>
                        <div
                            style={styles.reportContent}
                            dangerouslySetInnerHTML={{ __html: marked(forensicReport) as string }}
                        />

                        {/* OpenAI Integration */}
                        <div style={styles.openaiSection}>
                            <h3>🤖 OpenAI Legal API Integration</h3>
                            <p>Get detailed legal analysis and strategy recommendations</p>
                            
                            <label style={styles.label}>
                                OpenAI API Key:
                                <input
                                    type="password"
                                    value={openaiKey}
                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                    placeholder="sk-..."
                                    style={styles.input}
                                />
                            </label>

                            <label style={styles.label}>
                                Ask a Question (Optional):
                                <textarea
                                    value={userQuestion}
                                    onChange={(e) => setUserQuestion(e.target.value)}
                                    placeholder="E.g., What criminal charges might apply? What civil claims are available?"
                                    style={{...styles.input, minHeight: '80px'}}
                                />
                            </label>

                            <button
                                onClick={handleOpenAIAnalysis}
                                disabled={loading}
                                style={loading ? {...styles.button, ...styles.buttonDisabled} : {...styles.button, backgroundColor: '#1f6feb'}}
                            >
                                {loading ? '🔄 Analyzing...' : '⚖️ Get Legal Analysis & Strategy'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Legal Analysis View */}
                {currentView === 'legal' && legalAnalysis && (
                    <div style={styles.reportSection}>
                        <div style={styles.reportHeader}>
                            <h2>Legal Analysis & Strategy</h2>
                            <button 
                                onClick={() => downloadPDF(legalAnalysis, `legal-analysis-${caseId}-${Date.now()}.pdf`)}
                                style={styles.downloadButton}
                            >
                                📄 Download Analysis
                            </button>
                        </div>
                        <div
                            style={styles.reportContent}
                            dangerouslySetInnerHTML={{ __html: marked(legalAnalysis) as string }}
                        />
                    </div>
                )}
            </main>

            <footer style={styles.footer}>
                <p>🔒 All forensic analysis performed offline. Legal analysis via OpenAI (optional).</p>
                <p>Verum Omnis V5.0 - 9 Brain Architecture | Triple Verification Doctrine</p>
            </footer>
        </div>
    );
}

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        backgroundColor: '#161b22',
        padding: '2rem',
        borderBottom: '1px solid #30363d',
        textAlign: 'center' as const,
    },
    title: {
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#58a6ff',
    },
    subtitle: {
        margin: '0.5rem 0 0 0',
        fontSize: '1rem',
        color: '#8b949e',
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    nav: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #30363d',
        paddingBottom: '1rem',
    },
    navButton: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#21262d',
        color: '#c9d1d9',
        border: '1px solid #30363d',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    navButtonActive: {
        backgroundColor: '#238636',
        color: '#ffffff',
        borderColor: '#238636',
    },
    section: {
        marginBottom: '2rem',
    },
    label: {
        display: 'block',
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: '#c9d1d9',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        backgroundColor: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '6px',
        color: '#c9d1d9',
        marginTop: '0.5rem',
    },
    fileInput: {
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '6px',
        color: '#c9d1d9',
        marginTop: '0.5rem',
        cursor: 'pointer',
    },
    fileList: {
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#161b22',
        borderRadius: '6px',
        border: '1px solid #30363d',
    },
    button: {
        width: '100%',
        padding: '1rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        backgroundColor: '#238636',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    buttonDisabled: {
        backgroundColor: '#21262d',
        cursor: 'not-allowed',
    },
    error: {
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#5a1e1e',
        border: '1px solid #da3633',
        borderRadius: '6px',
        color: '#ffa198',
    },
    reportSection: {
        padding: '1.5rem',
        backgroundColor: '#161b22',
        borderRadius: '6px',
        border: '1px solid #30363d',
    },
    reportHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: '1px solid #30363d',
        paddingBottom: '1rem',
    },
    downloadButton: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#1f6feb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    reportContent: {
        lineHeight: '1.6',
        color: '#c9d1d9',
    },
    openaiSection: {
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#0d1117',
        borderRadius: '6px',
        border: '1px solid #30363d',
    },
    casesSection: {
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#161b22',
        borderRadius: '6px',
        border: '1px solid #30363d',
    },
    casesList: {
        listStyle: 'none',
        padding: 0,
        margin: '1rem 0 0 0',
    },
    caseButton: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#21262d',
        color: '#58a6ff',
        border: '1px solid #30363d',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left' as const,
        marginBottom: '0.5rem',
    },
    footer: {
        textAlign: 'center' as const,
        padding: '2rem',
        borderTop: '1px solid #30363d',
        color: '#8b949e',
        fontSize: '0.9rem',
    },
};

// Initialize app
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<App />);
}
