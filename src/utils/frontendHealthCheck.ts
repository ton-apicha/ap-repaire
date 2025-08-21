/**
 * Frontend Health Check System
 * สำหรับตรวจสอบสุขภาพของ frontend components แบบ real-time
 * 
 * Created: 2025-01-27
 * Purpose: ช่วยตรวจพบปัญหา frontend ได้ทันที
 */

export interface ComponentHealthStatus {
  componentName: string;
  status: 'healthy' | 'warning' | 'error';
  issues: HealthIssue[];
  lastChecked: string;
  renderTime?: number;
  memoryUsage?: number;
}

export interface HealthIssue {
  type: 'performance' | 'rendering' | 'data' | 'styling' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  solution?: string;
  affectedElements?: string[];
}

export class FrontendHealthChecker {
  private static instance: FrontendHealthChecker;
  private healthStatuses: Map<string, ComponentHealthStatus> = new Map();
  private observers: Set<(status: ComponentHealthStatus[]) => void> = new Set();
  private isMonitoring = false;

  static getInstance(): FrontendHealthChecker {
    if (!FrontendHealthChecker.instance) {
      FrontendHealthChecker.instance = new FrontendHealthChecker();
    }
    return FrontendHealthChecker.instance;
  }

  // 1. Component Registration และ Monitoring
  registerComponent(componentName: string): void {
    if (!this.healthStatuses.has(componentName)) {
      this.healthStatuses.set(componentName, {
        componentName,
        status: 'healthy',
        issues: [],
        lastChecked: new Date().toISOString()
      });
    }
  }

  unregisterComponent(componentName: string): void {
    this.healthStatuses.delete(componentName);
    this.notifyObservers();
  }

  // 2. Health Checks
  checkComponentHealth(componentName: string): ComponentHealthStatus {
    const startTime = performance.now();
    const issues: HealthIssue[] = [];

    // Check 1: DOM Presence
    const domIssues = this.checkDOMHealth(componentName);
    issues.push(...domIssues);

    // Check 2: Performance
    const perfIssues = this.checkPerformance(componentName);
    issues.push(...perfIssues);

    // Check 3: Data Loading
    const dataIssues = this.checkDataHealth(componentName);
    issues.push(...dataIssues);

    // Check 4: Styling
    const styleIssues = this.checkStylingHealth(componentName);
    issues.push(...styleIssues);

    // Check 5: Accessibility
    const a11yIssues = this.checkAccessibilityHealth(componentName);
    issues.push(...a11yIssues);

    const renderTime = performance.now() - startTime;
    
    // Determine overall status
    const status = this.determineOverallStatus(issues);

    const healthStatus: ComponentHealthStatus = {
      componentName,
      status,
      issues,
      lastChecked: new Date().toISOString(),
      renderTime,
      memoryUsage: this.estimateMemoryUsage()
    };

    this.healthStatuses.set(componentName, healthStatus);
    this.notifyObservers();

    return healthStatus;
  }

  private checkDOMHealth(componentName: string): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check if component exists in DOM
    const elements = document.querySelectorAll(`[data-component="${componentName}"]`);
    
    if (elements.length === 0) {
      // Fallback: check by className or common patterns
      const fallbackSelectors = [
        `.${componentName.toLowerCase()}`,
        `[class*="${componentName}"]`,
        `#${componentName.toLowerCase()}`
      ];

      let found = false;
      for (const selector of fallbackSelectors) {
        if (document.querySelector(selector)) {
          found = true;
          break;
        }
      }

      if (!found) {
        issues.push({
          type: 'rendering',
          severity: 'critical',
          message: `Component ${componentName} not found in DOM`,
          solution: 'Check if component is properly rendered and mounted'
        });
      }
    }

    // Check for loading states
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"]');
    if (loadingElements.length > 0) {
      issues.push({
        type: 'data',
        severity: 'medium',
        message: 'Loading states detected',
        solution: 'Check if data fetching is completing properly',
        affectedElements: Array.from(loadingElements).map(el => el.className)
      });
    }

    // Check for error states
    const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
    if (errorElements.length > 0) {
      issues.push({
        type: 'data',
        severity: 'high',
        message: 'Error states detected',
        solution: 'Check API responses and error handling',
        affectedElements: Array.from(errorElements).map(el => el.textContent?.slice(0, 50) || el.className)
      });
    }

    return issues;
  }

  private checkPerformance(componentName: string): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check for excessive DOM nodes
    const allElements = document.querySelectorAll('*');
    if (allElements.length > 5000) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Large DOM tree detected',
        solution: 'Consider virtualization or lazy loading for large lists'
      });
    }

    // Check for memory leaks (basic check)
    if (this.estimateMemoryUsage() > 50) { // MB
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'High memory usage detected',
        solution: 'Check for memory leaks in event listeners and component cleanup'
      });
    }

    // Check for slow rendering (if render time is available)
    const healthStatus = this.healthStatuses.get(componentName);
    if (healthStatus?.renderTime && healthStatus.renderTime > 100) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Slow rendering detected',
        solution: 'Optimize component rendering with React.memo or useMemo'
      });
    }

    return issues;
  }

  private checkDataHealth(componentName: string): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check for empty states that might indicate data issues
    const emptyElements = document.querySelectorAll('[class*="empty"], [class*="no-data"]');
    if (emptyElements.length > 0) {
      issues.push({
        type: 'data',
        severity: 'low',
        message: 'Empty states detected',
        solution: 'Verify data loading and API responses'
      });
    }

    // Check for console errors related to data
    const originalConsoleError = console.error;
    const errors: string[] = [];
    console.error = (...args) => {
      errors.push(args.join(' '));
      originalConsoleError.apply(console, args);
    };

    // Restore console.error after a short delay
    setTimeout(() => {
      console.error = originalConsoleError;
      if (errors.length > 0) {
        issues.push({
          type: 'data',
          severity: 'high',
          message: 'Console errors detected',
          solution: 'Check browser console for detailed error messages',
          affectedElements: errors.slice(0, 3) // Show first 3 errors
        });
      }
    }, 1000);

    return issues;
  }

  private checkStylingHealth(componentName: string): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check for missing Tailwind classes
    const allElements = document.querySelectorAll('*');
    const tailwindPattern = /border-gray-300|text-gray-500|bg-blue-600/;
    
    for (const element of Array.from(allElements).slice(0, 100)) { // Check first 100 elements
      const classes = element.className;
      if (typeof classes === 'string' && tailwindPattern.test(classes)) {
        const computedStyle = window.getComputedStyle(element);
        
        // Check if Tailwind classes are actually applied
        if (classes.includes('border-gray-300') && computedStyle.borderColor === 'initial') {
          issues.push({
            type: 'styling',
            severity: 'medium',
            message: 'Tailwind CSS classes not applying',
            solution: 'Check Tailwind configuration and CSS imports',
            affectedElements: [classes]
          });
          break; // Don't spam with duplicate issues
        }
      }
    }

    // Check for layout shift indicators
    const elements = document.querySelectorAll('[style*="width: 0"], [style*="height: 0"]');
    if (elements.length > 2) {
      issues.push({
        type: 'styling',
        severity: 'low',
        message: 'Potential layout shift detected',
        solution: 'Use proper loading skeletons and fixed dimensions'
      });
    }

    return issues;
  }

  private checkAccessibilityHealth(componentName: string): HealthIssue[] {
    const issues: HealthIssue[] = [];

    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push({
        type: 'accessibility',
        severity: 'medium',
        message: 'Images missing alt text',
        solution: 'Add descriptive alt attributes to all images'
      });
    }

    // Check for missing form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const unlabeledInputs = Array.from(inputs).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label && input.type !== 'hidden';
    });

    if (unlabeledInputs.length > 0) {
      issues.push({
        type: 'accessibility',
        severity: 'medium',
        message: 'Form inputs missing labels',
        solution: 'Add proper labels or aria-label attributes to form controls'
      });
    }

    // Check color contrast (basic check)
    const elements = document.querySelectorAll('[class*="text-gray-500"]');
    if (elements.length > 0) {
      issues.push({
        type: 'accessibility',
        severity: 'low',
        message: 'Potential color contrast issues',
        solution: 'Verify color contrast meets WCAG guidelines'
      });
    }

    return issues;
  }

  private determineOverallStatus(issues: HealthIssue[]): 'healthy' | 'warning' | 'error' {
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    const highIssues = issues.filter(issue => issue.severity === 'high');

    if (criticalIssues.length > 0) {
      return 'error';
    } else if (highIssues.length > 0 || issues.length > 5) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  private estimateMemoryUsage(): number {
    // Rough estimation based on DOM size and performance
    const elementCount = document.querySelectorAll('*').length;
    const estimatedMB = (elementCount * 0.01) + ((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0);
    return Math.round(estimatedMB);
  }

  // 3. Monitoring และ Real-time Updates
  startMonitoring(interval: number = 5000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    const monitoringInterval = setInterval(() => {
      for (const [componentName] of this.healthStatuses) {
        this.checkComponentHealth(componentName);
      }
    }, interval);

    // Stop monitoring when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(monitoringInterval);
        this.isMonitoring = false;
      }
    });
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  // 4. Observer Pattern for Health Status Changes
  addObserver(callback: (status: ComponentHealthStatus[]) => void): void {
    this.observers.add(callback);
  }

  removeObserver(callback: (status: ComponentHealthStatus[]) => void): void {
    this.observers.delete(callback);
  }

  private notifyObservers(): void {
    const allStatuses = Array.from(this.healthStatuses.values());
    for (const observer of this.observers) {
      observer(allStatuses);
    }
  }

  // 5. Health Dashboard Data
  getHealthSummary(): {
    healthy: number;
    warning: number;
    error: number;
    total: number;
    issues: HealthIssue[];
  } {
    const statuses = Array.from(this.healthStatuses.values());
    const allIssues = statuses.flatMap(status => status.issues);

    return {
      healthy: statuses.filter(s => s.status === 'healthy').length,
      warning: statuses.filter(s => s.status === 'warning').length,
      error: statuses.filter(s => s.status === 'error').length,
      total: statuses.length,
      issues: allIssues
    };
  }

  getAllStatuses(): ComponentHealthStatus[] {
    return Array.from(this.healthStatuses.values());
  }

  // 6. Quick Fixes
  suggestFixes(): { issue: HealthIssue; quickFix: () => void }[] {
    const allStatuses = Array.from(this.healthStatuses.values());
    const allIssues = allStatuses.flatMap(status => status.issues);
    const fixableIssues: { issue: HealthIssue; quickFix: () => void }[] = [];

    for (const issue of allIssues) {
      switch (issue.type) {
        case 'styling':
          if (issue.message.includes('Tailwind')) {
            fixableIssues.push({
              issue,
              quickFix: () => {
                console.warn('Quick Fix: Check your tailwind.config.js and ensure CSS is imported properly');
                // Could trigger automatic CSS reload if needed
              }
            });
          }
          break;
        case 'accessibility':
          if (issue.message.includes('alt text')) {
            fixableIssues.push({
              issue,
              quickFix: () => {
                const images = document.querySelectorAll('img:not([alt])');
                Array.from(images).forEach((img, index) => {
                  (img as HTMLImageElement).alt = `Image ${index + 1}`;
                });
                console.info('Quick Fix: Added placeholder alt text to images');
              }
            });
          }
          break;
      }
    }

    return fixableIssues;
  }
}

// React Hook for easy integration
export function useComponentHealth(componentName: string) {
  const [healthStatus, setHealthStatus] = React.useState<ComponentHealthStatus | null>(null);
  const healthChecker = FrontendHealthChecker.getInstance();

  React.useEffect(() => {
    healthChecker.registerComponent(componentName);
    
    const updateStatus = (statuses: ComponentHealthStatus[]) => {
      const status = statuses.find(s => s.componentName === componentName);
      setHealthStatus(status || null);
    };

    healthChecker.addObserver(updateStatus);
    
    // Initial check
    const initialStatus = healthChecker.checkComponentHealth(componentName);
    setHealthStatus(initialStatus);

    return () => {
      healthChecker.removeObserver(updateStatus);
      healthChecker.unregisterComponent(componentName);
    };
  }, [componentName]);

  return {
    healthStatus,
    recheckHealth: () => healthChecker.checkComponentHealth(componentName),
    isHealthy: healthStatus?.status === 'healthy',
    hasWarnings: healthStatus?.status === 'warning',
    hasErrors: healthStatus?.status === 'error',
    issues: healthStatus?.issues || []
  };
}

// Export singleton instance
export const frontendHealthChecker = FrontendHealthChecker.getInstance();

