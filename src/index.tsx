/// <reference types="vite/client" />
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import { marked } from 'marked';
import { storage } from './storage';

// --- Offline Forensic Analysis Engine ---
interface ForensicAnalysis {
    summary: string;
    findings: string[];
    metadata: {
        timestamp: string;
        fileCount: number;
        analysisTime: number;
    };
}

interface EvidenceFile {
    name: string;
    type: string;
    size: number;
    content: string | ArrayBuffer;
}

/**
 * Performs offline forensic analysis on uploaded evidence
 */
async function analyzeEvidenceOffline(files: File[]): Promise<ForensicAnalysis> {
    const startTime = Date.now();
    const findings: string[] = [];
    const evidenceFiles: EvidenceFile[] = [];

    // Process each file
    for (const file of files) {
        const evidence: EvidenceFile = {
            name: file.name,
            type: file.type,
            size: file.size,
            content: ''
        };

        // Read file content based on type
        if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            evidence.content = await file.text();
            findings.push(`✓ Text file detected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        } else if (file.type.startsWith('image/')) {
            evidence.content = await file.arrayBuffer();
            findings.push(`✓ Image file detected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            evidence.content = await file.arrayBuffer();
            findings.push(`✓ PDF document detected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        } else {
            evidence.content = await file.arrayBuffer();
            findings.push(`✓ Binary file detected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        }

        evidenceFiles.push(evidence);
    }

    // Basic forensic checks
    findings.push('');
    findings.push('## Forensic Analysis Results');
    findings.push('');
    findings.push('### File Integrity');
    
    for (const file of evidenceFiles) {
        // Check file size
        if (file.size === 0) {
            findings.push(`⚠️  WARNING: ${file.name} is empty (0 bytes)`);
        } else if (file.size > 10 * 1024 * 1024) {
            findings.push(`ℹ️  NOTICE: ${file.name} is large (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        }

        // Basic content analysis for text files
        if (typeof file.content === 'string' && file.content.length > 0) {
            const wordCount = file.content.split(/\s+/).length;
            const lineCount = file.content.split('\n').length;
            findings.push(`📄 ${file.name}: ${wordCount} words, ${lineCount} lines`);
            
            // Check for suspicious patterns
            if (file.content.toLowerCase().includes('password')) {
                findings.push(`⚠️  ALERT: ${file.name} contains password references`);
            }
            if (file.content.match(/\d{3}-\d{2}-\d{4}/)) {
                findings.push(`⚠️  ALERT: ${file.name} may contain SSN patterns`);
            }
            if (file.content.match(/\d{16}/)) {
                findings.push(`⚠️  ALERT: ${file.name} may contain credit card patterns`);
            }
        }
    }

    findings.push('');
    findings.push('### Summary');
    findings.push(`- Total files analyzed: ${evidenceFiles.length}`);
    findings.push(`- Total size: ${(evidenceFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)} KB`);
    findings.push(`- Analysis completed in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);

    const summary = `Forensic analysis completed on ${evidenceFiles.length} file(s). ` +
                   `All files were processed and analyzed for potential issues. ` +
                   `Review the detailed findings below for specific alerts and notices.`;

    return {
        summary,
        findings,
        metadata: {
            timestamp: new Date().toISOString(),
            fileCount: evidenceFiles.length,
            analysisTime: Date.now() - startTime
        }
    };
}

// --- React Application ---
function App() {
    const [caseId, setCaseId] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files);
        }
    };

    const handleAnalyze = async () => {
        if (!caseId) {
            setError('Please enter a case ID');
            return;
        }

        if (!files || files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        setLoading(true);
        setError('');
        setReport('');

        try {
            // Convert FileList to array
            const fileArray = Array.from(files);
            
            // Perform offline analysis
            const analysis = await analyzeEvidenceOffline(fileArray);

            // Generate report
            const reportContent = `# Forensic Analysis Report
## Case ID: ${caseId}
## Generated: ${new Date().toLocaleString()}

---

## Executive Summary
${analysis.summary}

---

## Detailed Findings
${analysis.findings.join('\n')}

---

## Metadata
- **Timestamp**: ${analysis.metadata.timestamp}
- **Files Analyzed**: ${analysis.metadata.fileCount}
- **Analysis Duration**: ${(analysis.metadata.analysisTime / 1000).toFixed(2)} seconds
- **Report Generated By**: Verum Omnis Offline Forensic Engine

---

## Chain of Custody
This report was generated using fully offline forensic analysis. All evidence was processed locally on-device.

**Report Hash**: ${generateSimpleHash(caseId + analysis.metadata.timestamp)}
`;

            setReport(reportContent);

            // Save to local storage
            await storage.saveReport(caseId, reportContent, fileArray.map(f => f.name));
            await loadCases();

        } catch (e: any) {
            setError(`Analysis failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!report) return;

        try {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const lineHeight = 7;
            let y = margin;

            // Title
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Verum Omnis Forensic Report', margin, y);
            y += lineHeight * 2;

            // Content
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            
            const lines = report.split('\n');
            for (const line of lines) {
                if (y > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }

                // Handle markdown headers
                if (line.startsWith('###')) {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(11);
                    pdf.text(line.replace(/^###\s*/, ''), margin, y);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                } else if (line.startsWith('##')) {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(12);
                    pdf.text(line.replace(/^##\s*/, ''), margin, y);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                } else if (line.startsWith('#')) {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(14);
                    pdf.text(line.replace(/^#\s*/, ''), margin, y);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
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

            pdf.save(`forensic-report-${caseId}-${Date.now()}.pdf`);
        } catch (e: any) {
            setError(`PDF generation failed: ${e.message}`);
        }
    };

    const loadCase = async (caseIdToLoad: string) => {
        try {
            const reports = await storage.getReports(caseIdToLoad);
            if (reports && reports.length > 0) {
                setCaseId(caseIdToLoad);
                setReport(reports[reports.length - 1].content);
            }
        } catch (e) {
            console.error('Failed to load case:', e);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>🔍 Verum Omnis</h1>
                <p style={styles.subtitle}>Offline Forensic Analysis Engine</p>
            </header>

            <main style={styles.main}>
                {error && (
                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <div style={styles.section}>
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
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>
                        Evidence Files:
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={styles.fileInput}
                        />
                    </label>
                    {files && (
                        <div style={styles.fileList}>
                            <p>Selected files: {files.length}</p>
                            <ul>
                                {Array.from(files).map((file, i) => (
                                    <li key={i}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                >
                    {loading ? '🔄 Analyzing...' : '🔍 Analyze Evidence'}
                </button>

                {report && (
                    <div style={styles.reportSection}>
                        <div style={styles.reportHeader}>
                            <h2>Forensic Report</h2>
                            <button onClick={downloadPDF} style={styles.downloadButton}>
                                📄 Download PDF
                            </button>
                        </div>
                        <div
                            style={styles.reportContent}
                            dangerouslySetInnerHTML={{ __html: marked(report) as string }}
                        />
                    </div>
                )}

                {cases.length > 0 && (
                    <div style={styles.casesSection}>
                        <h3>Previous Cases</h3>
                        <ul style={styles.casesList}>
                            {cases.map((c) => (
                                <li key={c}>
                                    <button
                                        onClick={() => loadCase(c)}
                                        style={styles.caseButton}
                                    >
                                        📁 {c}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>

            <footer style={styles.footer}>
                <p>🔒 All data is stored locally on your device. No cloud uploads.</p>
                <p>Version 2.0 - Offline Mode</p>
            </footer>
        </div>
    );
}

// Simple hash function for report verification
function generateSimpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase();
}

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
        fontSize: '1.1rem',
        color: '#8b949e',
    },
    main: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
    },
    section: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
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
        transition: 'background-color 0.2s',
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
        marginTop: '2rem',
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
