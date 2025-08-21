/**
 * Advanced Error Reporting and Logging System
 * สำหรับติดตามและรายงานปัญหาแบบ real-time
 * 
 * Created: 2025-01-27
 * Purpose: ช่วยตรวจพบและแก้ไขปัญหาได้อย่างรวดเร็ว
 */

export interface ErrorReport {
  id: string;
  timestamp: string;
  type: 'javascript' | 'api' | 'render' | 'network' | 'performance' | 'user';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: {
    url: string;
    userAgent: string;
    component?: string;
    userId?: string;
    sessionId: string;
    buildVersion?: string;
  };
  metadata: {
    apiEndpoint?: string;
    responseStatus?: number;
    requestData?: any;
    responseData?: any;
    renderTime?: number;
    memoryUsage?: number;
    networkStatus?: string;
    userAction?: string;
  };
  tags: string[];
  resolved: boolean;
  acknowledgedBy?: string;
  resolution?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  message: string;
  data?: any;
  context: {
    component?: string;
    function?: string;
    file?: string;
    line?: number;
  };
}

export class ErrorReportingSystem {
  private static instance: ErrorReportingSystem;
  private errors: Map<string, ErrorReport> = new Map();
  private logs: LogEntry[] = [];
  private observers: Set<(error: ErrorReport) => void> = new Set();
  private logObservers: Set<(log: LogEntry) => void> = new Set();
  private sessionId: string;
  private isEnabled = true;
  private maxLogs = 1000;
  private maxErrors = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
  }

  static getInstance(): ErrorReportingSystem {
    if (!ErrorReportingSystem.instance) {
      ErrorReportingSystem.instance = new ErrorReportingSystem();
    }
    return ErrorReportingSystem.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 1. Global Error Handlers Setup
  private setupGlobalErrorHandlers(): void {
    // JavaScript runtime errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        severity: 'high',
        message: event.message,
        stack: event.error?.stack,
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: this.sessionId
        },
        metadata: {
          file: event.filename,
          line: event.lineno,
          column: event.colno
        },
        tags: ['runtime-error', 'javascript']
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'javascript',
        severity: 'high',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: this.sessionId
        },
        metadata: {
          promiseRejection: true,
          reason: event.reason
        },
        tags: ['promise-rejection', 'javascript']
      });
    });

    // Network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        // Log slow API calls
        if (endTime - startTime > 2000) {
          this.logWarning('Performance', `Slow API call: ${args[0]}`, {
            duration: endTime - startTime,
            endpoint: args[0]
          });
        }

        // Log API errors
        if (!response.ok) {
          this.reportError({
            type: 'api',
            severity: response.status >= 500 ? 'high' : 'medium',
            message: `API Error: ${response.status} ${response.statusText}`,
            context: {
              url: window.location.href,
              userAgent: navigator.userAgent,
              sessionId: this.sessionId
            },
            metadata: {
              apiEndpoint: args[0] as string,
              responseStatus: response.status,
              requestData: args[1]
            },
            tags: ['api-error', 'network']
          });
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        
        this.reportError({
          type: 'network',
          severity: 'high',
          message: `Network Error: ${error.message}`,
          stack: error.stack,
          context: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.sessionId
          },
          metadata: {
            apiEndpoint: args[0] as string,
            requestData: args[1],
            duration: endTime - startTime,
            networkStatus: navigator.onLine ? 'online' : 'offline'
          },
          tags: ['network-error', 'fetch-failed']
        });
        
        throw error;
      }
    };
  }

  // 2. Performance Monitoring
  private setupPerformanceMonitoring(): void {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.logWarning('Performance', 'Long task detected', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask API not supported
      }
    }

    // Memory usage monitoring
    setInterval(() => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        
        if (usedMB > 100) { // More than 100MB
          this.logWarning('Performance', 'High memory usage detected', {
            usedJSHeapSize: usedMB,
            totalJSHeapSize: memory.totalJSHeapSize / 1024 / 1024,
            jsHeapSizeLimit: memory.jsHeapSizeLimit / 1024 / 1024
          });
        }
      }
    }, 30000); // Check every 30 seconds
  }

  // 3. Error Reporting Methods
  reportError(errorData: Partial<ErrorReport>): string {
    if (!this.isEnabled) return '';

    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const error: ErrorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      type: errorData.type || 'javascript',
      severity: errorData.severity || 'medium',
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'development',
        ...errorData.context
      },
      metadata: errorData.metadata || {},
      tags: errorData.tags || [],
      resolved: false
    };

    this.errors.set(errorId, error);
    
    // Maintain max errors limit
    if (this.errors.size > this.maxErrors) {
      const oldestKey = this.errors.keys().next().value;
      this.errors.delete(oldestKey);
    }

    // Notify observers
    for (const observer of this.observers) {
      observer(error);
    }

    // Auto-send critical errors
    if (error.severity === 'critical') {
      this.sendErrorToServer(error);
    }

    console.error(`[ErrorReporting] ${error.severity.toUpperCase()}: ${error.message}`, error);
    
    return errorId;
  }

  reportApiError(endpoint: string, status: number, responseData?: any, requestData?: any): string {
    return this.reportError({
      type: 'api',
      severity: status >= 500 ? 'high' : 'medium',
      message: `API Error: ${status} at ${endpoint}`,
      metadata: {
        apiEndpoint: endpoint,
        responseStatus: status,
        responseData,
        requestData
      },
      tags: ['api-error', `status-${status}`]
    });
  }

  reportRenderError(component: string, error: Error): string {
    return this.reportError({
      type: 'render',
      severity: 'high',
      message: `Render Error in ${component}: ${error.message}`,
      stack: error.stack,
      context: {
        component,
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      },
      tags: ['render-error', 'react', component.toLowerCase()]
    });
  }

  reportUserAction(action: string, context?: any): string {
    return this.reportError({
      type: 'user',
      severity: 'low',
      message: `User Action: ${action}`,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      },
      metadata: {
        userAction: action,
        actionContext: context
      },
      tags: ['user-action', action.toLowerCase()]
    });
  }

  // 4. Logging Methods
  private createLogEntry(level: LogEntry['level'], category: string, message: string, data?: any, context?: any): LogEntry {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    return {
      id: logId,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      context: context || {}
    };
  }

  logDebug(category: string, message: string, data?: any, context?: any): void {
    const entry = this.createLogEntry('debug', category, message, data, context);
    this.addLogEntry(entry);
    console.debug(`[${category}] ${message}`, data);
  }

  logInfo(category: string, message: string, data?: any, context?: any): void {
    const entry = this.createLogEntry('info', category, message, data, context);
    this.addLogEntry(entry);
    console.info(`[${category}] ${message}`, data);
  }

  logWarning(category: string, message: string, data?: any, context?: any): void {
    const entry = this.createLogEntry('warn', category, message, data, context);
    this.addLogEntry(entry);
    console.warn(`[${category}] ${message}`, data);
  }

  logError(category: string, message: string, data?: any, context?: any): void {
    const entry = this.createLogEntry('error', category, message, data, context);
    this.addLogEntry(entry);
    console.error(`[${category}] ${message}`, data);
  }

  private addLogEntry(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify log observers
    for (const observer of this.logObservers) {
      observer(entry);
    }
  }

  // 5. Observer Pattern
  addErrorObserver(callback: (error: ErrorReport) => void): void {
    this.observers.add(callback);
  }

  removeErrorObserver(callback: (error: ErrorReport) => void): void {
    this.observers.delete(callback);
  }

  addLogObserver(callback: (log: LogEntry) => void): void {
    this.logObservers.add(callback);
  }

  removeLogObserver(callback: (log: LogEntry) => void): void {
    this.logObservers.delete(callback);
  }

  // 6. Data Access and Management
  getAllErrors(): ErrorReport[] {
    return Array.from(this.errors.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getErrorsByType(type: ErrorReport['type']): ErrorReport[] {
    return this.getAllErrors().filter(error => error.type === type);
  }

  getErrorsBySeverity(severity: ErrorReport['severity']): ErrorReport[] {
    return this.getAllErrors().filter(error => error.severity === severity);
  }

  getUnresolvedErrors(): ErrorReport[] {
    return this.getAllErrors().filter(error => !error.resolved);
  }

  getLogs(level?: LogEntry['level'], category?: string): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    
    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // 7. Error Resolution
  resolveError(errorId: string, resolution: string, acknowledgedBy: string): boolean {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      error.resolution = resolution;
      error.acknowledgedBy = acknowledgedBy;
      return true;
    }
    return false;
  }

  // 8. Export and Reporting
  exportErrorReport(): {
    sessionId: string;
    timestamp: string;
    errors: ErrorReport[];
    logs: LogEntry[];
    summary: {
      totalErrors: number;
      criticalErrors: number;
      unresolvedErrors: number;
      apiErrors: number;
      renderErrors: number;
    };
  } {
    const errors = this.getAllErrors();
    
    return {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      errors,
      logs: this.logs,
      summary: {
        totalErrors: errors.length,
        criticalErrors: errors.filter(e => e.severity === 'critical').length,
        unresolvedErrors: errors.filter(e => !e.resolved).length,
        apiErrors: errors.filter(e => e.type === 'api').length,
        renderErrors: errors.filter(e => e.type === 'render').length
      }
    };
  }

  downloadErrorReport(): void {
    const report = this.exportErrorReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.sessionId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 9. Server Communication
  private async sendErrorToServer(error: ErrorReport): Promise<void> {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
    } catch (e) {
      console.error('Failed to send error to server:', e);
    }
  }

  async sendBulkErrorsToServer(): Promise<void> {
    const unresolvedErrors = this.getUnresolvedErrors();
    if (unresolvedErrors.length === 0) return;

    try {
      await fetch('/api/errors/bulk-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          errors: unresolvedErrors
        })
      });
    } catch (e) {
      console.error('Failed to send bulk errors to server:', e);
    }
  }

  // 10. Configuration
  configure(options: {
    enabled?: boolean;
    maxLogs?: number;
    maxErrors?: number;
    autoSendCritical?: boolean;
  }): void {
    if (options.enabled !== undefined) this.isEnabled = options.enabled;
    if (options.maxLogs !== undefined) this.maxLogs = options.maxLogs;
    if (options.maxErrors !== undefined) this.maxErrors = options.maxErrors;
  }

  // Clear all data
  clear(): void {
    this.errors.clear();
    this.logs = [];
  }

  // Get system health
  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    errorRate: number;
    criticalErrorsCount: number;
    lastError?: ErrorReport;
  } {
    const errors = this.getAllErrors();
    const criticalErrors = errors.filter(e => e.severity === 'critical');
    const recentErrors = errors.filter(e => 
      new Date(e.timestamp).getTime() > Date.now() - 60000 // Last minute
    );

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (criticalErrors.length > 0) {
      status = 'critical';
    } else if (recentErrors.length > 5) {
      status = 'warning';
    }

    return {
      status,
      errorRate: recentErrors.length,
      criticalErrorsCount: criticalErrors.length,
      lastError: errors[0]
    };
  }
}

// React Hook for easy integration
export function useErrorReporting() {
  const errorReporter = ErrorReportingSystem.getInstance();

  return {
    reportError: (errorData: Partial<ErrorReport>) => errorReporter.reportError(errorData),
    reportApiError: (endpoint: string, status: number, responseData?: any, requestData?: any) => 
      errorReporter.reportApiError(endpoint, status, responseData, requestData),
    reportRenderError: (component: string, error: Error) => 
      errorReporter.reportRenderError(component, error),
    reportUserAction: (action: string, context?: any) => 
      errorReporter.reportUserAction(action, context),
    logInfo: (category: string, message: string, data?: any) => 
      errorReporter.logInfo(category, message, data),
    logWarning: (category: string, message: string, data?: any) => 
      errorReporter.logWarning(category, message, data),
    logError: (category: string, message: string, data?: any) => 
      errorReporter.logError(category, message, data),
    getSystemHealth: () => errorReporter.getSystemHealth(),
    exportReport: () => errorReporter.exportErrorReport(),
    downloadReport: () => errorReporter.downloadErrorReport()
  };
}

// Export singleton instance
export const errorReporter = ErrorReportingSystem.getInstance();

