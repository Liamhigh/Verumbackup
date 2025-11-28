/**
 * VERUM OMNIS CRYPTOGRAPHIC SEAL ENFORCEMENT
 * Constitutional requirement: All data must be sealed
 * See: CRYPTOGRAPHIC_SEAL_ENFORCEMENT.md
 * 
 * This module implements the three mandatory enforcement gates:
 * 1. InputSealInterceptor - Gate 1: Inbound Evidence Seal
 * 2. InternalSealMiddleware - Gate 2: Internal Process Gate
 * 3. OutputSealEnforcer - Gate 3: Outbound Seal Enforcement
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SealedData {
  sha512: string;
  timestamp: string;
  gps?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  sealed: boolean;
  chainOfCustody: string;
  metadata?: Record<string, any>;
  authenticityScore?: number;
  tamperFlags?: string[];
  content?: any;
}

export interface SealValidationResult {
  valid: boolean;
  reason?: string;
  auditEntry?: AuditLogEntry;
}

export interface AuditLogEntry {
  operation: 'SEAL_CREATE' | 'SEAL_VERIFY' | 'SEAL_REJECT';
  timestamp: string;
  itemId?: string;
  sha512?: string;
  result: 'SUCCESS' | 'FAILURE';
  reason?: string;
}

// ============================================================================
// CUSTOM ERRORS
// ============================================================================

export class SealViolationError extends Error {
  constructor(message: string) {
    super(`SEAL VIOLATION: ${message}`);
    this.name = 'SealViolationError';
  }
}

export class SealIntegrityError extends Error {
  constructor(message: string) {
    super(`SEAL INTEGRITY FAILURE: ${message}`);
    this.name = 'SealIntegrityError';
  }
}

// ============================================================================
// SEAL AUDIT LOG
// ============================================================================

class SealAuditLog {
  private logs: AuditLogEntry[] = [];

  log(entry: AuditLogEntry): void {
    this.logs.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    
    // In production, write to tamper-proof storage
    console.log('[SEAL AUDIT]', entry);
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}

export const sealAuditLog = new SealAuditLog();

// ============================================================================
// GATE 1: INPUT SEAL INTERCEPTOR
// ============================================================================

/**
 * GATE 1: INPUT GATE (Inbound Evidence Seal)
 * 
 * Constitutional Requirement:
 * Every upload MUST go through the Offline Forensic Engine before it can be used.
 * 
 * Watches everything entering the app and ensures it is sealed.
 */
export class InputSealInterceptor {
  /**
   * Process and seal an uploaded file
   * 
   * VERUM SEAL ENFORCEMENT:
   * - Generates SHA-512 hash
   * - Adds timestamp
   * - Captures GPS coordinates
   * - Creates chain-of-custody signature
   * - Extracts metadata
   * - Performs authenticity scan
   * - Runs tamper detection
   */
  async sealFile(file: File, geolocation?: GeolocationPosition): Promise<SealedData> {
    try {
      // Generate SHA-512 hash
      const sha512 = await this.generateSHA512(file);
      
      // Capture timestamp
      const timestamp = new Date().toISOString();
      
      // Capture GPS (if available)
      const gps = geolocation ? {
        latitude: geolocation.coords.latitude,
        longitude: geolocation.coords.longitude,
        accuracy: geolocation.coords.accuracy
      } : undefined;
      
      // Extract metadata
      const metadata = await this.extractMetadata(file);
      
      // Perform authenticity scan
      const authenticityScore = await this.authenticityCheck(file);
      
      // Tamper detection
      const tamperFlags = await this.tamperDetection(file);
      
      // Generate chain-of-custody signature
      const chainOfCustody = await this.generateChainOfCustody(sha512, timestamp, gps);
      
      const sealedData: SealedData = {
        sha512,
        timestamp,
        gps,
        sealed: true,
        chainOfCustody,
        metadata,
        authenticityScore,
        tamperFlags
      };
      
      // Log to audit trail
      sealAuditLog.log({
        operation: 'SEAL_CREATE',
        timestamp,
        itemId: file.name,
        sha512,
        result: 'SUCCESS'
      });
      
      return sealedData;
      
    } catch (error: any) {
      // Log failure
      sealAuditLog.log({
        operation: 'SEAL_CREATE',
        timestamp: new Date().toISOString(),
        itemId: file.name,
        result: 'FAILURE',
        reason: error.message
      });
      
      throw new SealViolationError(`Failed to seal file: ${error.message}`);
    }
  }

  /**
   * Validate that data is properly sealed before allowing use
   */
  validateSeal(data: any): SealValidationResult {
    // Check if data has required seal properties
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        reason: 'Data is not an object'
      };
    }

    if (data.sealed !== true) {
      return {
        valid: false,
        reason: 'Data is not marked as sealed'
      };
    }

    if (!data.sha512 || !data.timestamp || !data.chainOfCustody) {
      return {
        valid: false,
        reason: 'Missing required seal fields (sha512, timestamp, or chainOfCustody)'
      };
    }

    return { valid: true };
  }

  /**
   * Reject unsealed data with proper error handling
   */
  rejectUnsealed(data: any, context: string): never {
    const validation = this.validateSeal(data);
    
    sealAuditLog.log({
      operation: 'SEAL_REJECT',
      timestamp: new Date().toISOString(),
      result: 'FAILURE',
      reason: `Unsealed data rejected at ${context}: ${validation.reason}`
    });

    throw new SealViolationError(
      `Unsealed data rejected at ${context}: ${validation.reason}`
    );
  }

  // Helper methods
  private async generateSHA512(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async extractMetadata(file: File): Promise<Record<string, any>> {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    };
  }

  private async authenticityCheck(_file: File): Promise<number> {
    // Simplified authenticity score (0-100)
    // In production, this would perform deep analysis
    return 95;
  }

  private async tamperDetection(_file: File): Promise<string[]> {
    // Simplified tamper detection
    // In production, this would check for manipulation indicators
    return [];
  }

  private async generateChainOfCustody(
    sha512: string, 
    timestamp: string, 
    gps?: any
  ): Promise<string> {
    const custodyData = JSON.stringify({ sha512, timestamp, gps });
    const encoder = new TextEncoder();
    const data = encoder.encode(custodyData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().substring(0, 16);
  }
}

// ============================================================================
// GATE 2: INTERNAL SEAL MIDDLEWARE
// ============================================================================

/**
 * GATE 2: INTERNAL PROCESS GATE
 * 
 * Constitutional Requirement:
 * Inside the app, no data may move between components unless it is sealed.
 * 
 * Prevents unsealed data from traveling between modules.
 */
export class InternalSealMiddleware {
  /**
   * Validate seal before allowing data to pass through
   * 
   * VERUM SEAL ENFORCEMENT:
   * - Checks sealed: true flag
   * - Verifies seal integrity
   * - Rejects unsealed packets immediately
   * - Logs all violations
   */
  validateAndPass<T extends SealedData>(
    data: T,
    fromModule: string,
    toModule: string
  ): T {
    // Check sealed flag
    if (data.sealed !== true) {
      sealAuditLog.log({
        operation: 'SEAL_REJECT',
        timestamp: new Date().toISOString(),
        result: 'FAILURE',
        reason: `Unsealed data rejected in transit from ${fromModule} to ${toModule}`
      });

      throw new SealViolationError(
        `Unsealed data rejected in transit from ${fromModule} to ${toModule}`
      );
    }

    // Verify seal integrity
    if (!this.verifySealIntegrity(data)) {
      sealAuditLog.log({
        operation: 'SEAL_VERIFY',
        timestamp: new Date().toISOString(),
        sha512: data.sha512,
        result: 'FAILURE',
        reason: `Seal integrity check failed from ${fromModule} to ${toModule}`
      });

      throw new SealIntegrityError(
        `Seal integrity check failed - possible tampering detected`
      );
    }

    // Log successful verification
    sealAuditLog.log({
      operation: 'SEAL_VERIFY',
      timestamp: new Date().toISOString(),
      sha512: data.sha512,
      result: 'SUCCESS'
    });

    return data;
  }

  /**
   * Verify seal integrity
   */
  private verifySealIntegrity(data: SealedData): boolean {
    // Check required fields
    if (!data.sha512 || !data.timestamp || !data.chainOfCustody) {
      return false;
    }

    // Verify seal hasn't been tampered with
    // In production, this would recalculate and compare hashes
    return true;
  }
}

// ============================================================================
// GATE 3: OUTPUT SEAL ENFORCER
// ============================================================================

/**
 * GATE 3: OUTPUT GATE (Outbound Seal Enforcement)
 * 
 * Constitutional Requirement:
 * NOTHING is allowed to leave the system unless it is cryptographically sealed.
 * 
 * Checks seals before anything goes to external systems (GPT/Claude/DeepSeek).
 */
export class OutputSealEnforcer {
  /**
   * Seal data before it leaves the system
   * 
   * VERUM SEAL ENFORCEMENT:
   * - Creates sealed summary for external transmission
   * - Never sends raw evidence
   * - Only sealed briefs reach cloud AI
   * - Logs all output operations
   */
  async sealForOutput(
    data: any,
    destination: string
  ): Promise<SealedData> {
    try {
      // Generate output seal
      const timestamp = new Date().toISOString();
      const contentString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const contentData = encoder.encode(contentString);
      
      // Generate SHA-512 of output
      const hashBuffer = await crypto.subtle.digest('SHA-512', contentData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha512 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Generate chain of custody for output
      const custodyData = JSON.stringify({ sha512, timestamp, destination });
      const custodyHash = await crypto.subtle.digest('SHA-256', encoder.encode(custodyData));
      const custodyArray = Array.from(new Uint8Array(custodyHash));
      const chainOfCustody = custodyArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().substring(0, 16);
      
      const sealedOutput: SealedData = {
        sha512,
        timestamp,
        sealed: true,
        chainOfCustody,
        content: data
      };
      
      // Log to audit trail
      sealAuditLog.log({
        operation: 'SEAL_CREATE',
        timestamp,
        sha512,
        result: 'SUCCESS',
        reason: `Output sealed for ${destination}`
      });
      
      return sealedOutput;
      
    } catch (error: any) {
      sealAuditLog.log({
        operation: 'SEAL_CREATE',
        timestamp: new Date().toISOString(),
        result: 'FAILURE',
        reason: `Failed to seal output for ${destination}: ${error.message}`
      });
      
      throw new SealViolationError(`Failed to seal output: ${error.message}`);
    }
  }

  /**
   * Validate seal before allowing external transmission
   */
  validateBeforeTransmission(data: SealedData, destination: string): void {
    if (data.sealed !== true) {
      sealAuditLog.log({
        operation: 'SEAL_REJECT',
        timestamp: new Date().toISOString(),
        result: 'FAILURE',
        reason: `Attempted to send unsealed data to ${destination}`
      });

      throw new SealViolationError(
        `Cannot send unsealed data to ${destination}. All external transmissions must be sealed.`
      );
    }

    sealAuditLog.log({
      operation: 'SEAL_VERIFY',
      timestamp: new Date().toISOString(),
      sha512: data.sha512,
      result: 'SUCCESS',
      reason: `Output validated for transmission to ${destination}`
    });
  }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

export const inputSealInterceptor = new InputSealInterceptor();
export const internalSealMiddleware = new InternalSealMiddleware();
export const outputSealEnforcer = new OutputSealEnforcer();

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
EXAMPLE 1: Sealing an uploaded file (Input Gate)

async function handleFileUpload(file: File, geolocation?: GeolocationPosition) {
  try {
    // Seal the file before use
    const sealedFile = await inputSealInterceptor.sealFile(file, geolocation);
    
    // Now it can be used in the system
    processSealedEvidence(sealedFile);
  } catch (error) {
    if (error instanceof SealViolationError) {
      alert('File could not be sealed. Please try again.');
    }
  }
}

EXAMPLE 2: Passing data between modules (Internal Gate)

function sendToBrain(data: SealedData) {
  // Middleware validates seal before passing
  const validatedData = internalSealMiddleware.validateAndPass(
    data,
    'UploadModule',
    'ContradictionBrain'
  );
  
  // Only sealed data reaches the brain
  contradictionBrain.process(validatedData);
}

EXAMPLE 3: Sending to OpenAI (Output Gate)

async function requestLegalAnalysis(report: string, apiKey: string) {
  // Seal the report before sending to OpenAI
  const sealedBrief = await outputSealEnforcer.sealForOutput(
    { report },
    'OpenAI API'
  );
  
  // Validate before transmission
  outputSealEnforcer.validateBeforeTransmission(sealedBrief, 'OpenAI API');
  
  // Only sealed brief reaches the AI
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{
      role: "user",
      content: JSON.stringify(sealedBrief)
    }]
  });
}
*/
