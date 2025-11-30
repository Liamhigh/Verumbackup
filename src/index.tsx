/// <reference types="vite/client" />
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';

// Main Application Component
const App: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [status, setStatus] = useState('Ready');

    const handleAnalyze = async () => {
        if (!caseId.trim()) {
            setStatus('Please enter a case ID');
            return;
        }

        setStatus('Analysis functionality has been removed');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Verum Omnis - Forensic Engine', 10, 10);
        doc.text('Analysis functionality has been removed', 10, 20);
        doc.save('report.pdf');
        setStatus('PDF exported');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '2em',
                    marginBottom: '10px',
                    color: '#333'
                }}>
                    Verum Omnis
                </h1>
                <p style={{
                    color: '#666',
                    marginBottom: '30px'
                }}>
                    Forensic Analysis Engine - Local Storage Mode
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        Case ID:
                    </label>
                    <input
                        type="text"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="Enter case identifier"
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={handleAnalyze}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Analyze
                    </button>
                    <button
                        onClick={handleExportPDF}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Export PDF
                    </button>
                </div>

                <div style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                }}>
                    <strong style={{ color: '#333' }}>Status:</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>{status}</p>
                </div>

                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px'
                }}>
                    <strong style={{ color: '#856404' }}>Note:</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#856404' }}>
                        AI analysis functionality has been removed from this version.
                        Only local storage and PDF export capabilities remain.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Initialize app
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
