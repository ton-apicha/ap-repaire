'use client'

/**
 * Health Dashboard Component
 * แสดงสถานะสุขภาพของระบบแบบ real-time
 * 
 * Created: 2025-01-27
 * Purpose: ช่วยนักพัฒนาติดตามปัญหาได้ทันที
 */

import React, { useState, useEffect } from 'react';
import { useErrorReporting } from '@/utils/errorReporting';
import { FrontendHealthChecker } from '@/utils/frontendHealthCheck';

interface HealthMetrics {
  api: {
    status: 'healthy' | 'warning' | 'error';
    responseTime: number;
    successRate: number;
    lastChecked: string;
  };
  frontend: {
    status: 'healthy' | 'warning' | 'error';
    componentsHealthy: number;
    totalComponents: number;
    memoryUsage: number;
  };
  database: {
    status: 'healthy' | 'warning' | 'error';
    connectionTime: number;
    lastChecked: string;
  };
  errors: {
    total: number;
    critical: number;
    recent: number;
    resolved: number;
  };
}

export default function HealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { getSystemHealth, exportReport } = useErrorReporting();

  // Check system health
  const checkSystemHealth = async (): Promise<HealthMetrics> => {
    const healthChecker = FrontendHealthChecker.getInstance();
    const errorHealth = getSystemHealth();
    
    // API Health Check
    const apiStartTime = Date.now();
    let apiStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    let apiResponseTime = 0;
    
    try {
      const response = await fetch('/api/health');
      apiResponseTime = Date.now() - apiStartTime;
      
      if (!response.ok) {
        apiStatus = response.status >= 500 ? 'error' : 'warning';
      } else if (apiResponseTime > 1000) {
        apiStatus = 'warning';
      }
    } catch (error) {
      apiStatus = 'error';
      apiResponseTime = Date.now() - apiStartTime;
    }

    // Frontend Health Check
    const frontendSummary = healthChecker.getHealthSummary();
    let frontendStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    
    if (frontendSummary.error > 0) {
      frontendStatus = 'error';
    } else if (frontendSummary.warning > 0) {
      frontendStatus = 'warning';
    }

    // Database Health Check
    const dbStartTime = Date.now();
    let dbStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    let dbConnectionTime = 0;
    
    try {
      const response = await fetch('/api/customers');
      dbConnectionTime = Date.now() - dbStartTime;
      
      if (!response.ok) {
        dbStatus = 'error';
      } else if (dbConnectionTime > 500) {
        dbStatus = 'warning';
      }
    } catch (error) {
      dbStatus = 'error';
      dbConnectionTime = Date.now() - dbStartTime;
    }

    return {
      api: {
        status: apiStatus,
        responseTime: apiResponseTime,
        successRate: apiStatus === 'healthy' ? 100 : (apiStatus === 'warning' ? 75 : 0),
        lastChecked: new Date().toISOString()
      },
      frontend: {
        status: frontendStatus,
        componentsHealthy: frontendSummary.healthy,
        totalComponents: frontendSummary.total,
        memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
      },
      database: {
        status: dbStatus,
        connectionTime: dbConnectionTime,
        lastChecked: new Date().toISOString()
      },
      errors: {
        total: errorHealth.errorRate,
        critical: errorHealth.criticalErrorsCount,
        recent: errorHealth.errorRate,
        resolved: 0 // Could be calculated from error history
      }
    };
  };

  // Load metrics
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const newMetrics = await checkSystemHealth();
        setMetrics(newMetrics);
      } catch (error) {
        console.error('Failed to load health metrics:', error);
      }
    };

    loadMetrics();

    // Auto refresh
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadMetrics, 30000); // Every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  if (!metrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Loading health status...</span>
        </div>
      </div>
    );
  }

  const overallStatus = (() => {
    const statuses = [metrics.api.status, metrics.frontend.status, metrics.database.status];
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  })();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact View */}
      {!isExpanded && (
        <div 
          className={`bg-white rounded-lg shadow-lg border p-3 cursor-pointer hover:shadow-xl transition-all ${
            getStatusColor(overallStatus)
          }`}
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(overallStatus)}</span>
            <span className="text-sm font-medium">
              System {overallStatus}
            </span>
            <button className="text-xs text-gray-500 hover:text-gray-700">
              📊
            </button>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border max-w-md w-80">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getStatusIcon(overallStatus)}</span>
                <h3 className="font-semibold text-gray-900">System Health</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-xs px-2 py-1 rounded ${
                    autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {autoRefresh ? 'Auto' : 'Manual'}
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="p-4 space-y-4">
            {/* API Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getStatusIcon(metrics.api.status)}</span>
                <span className="text-sm font-medium">API</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  {metrics.api.responseTime}ms
                </div>
                <div className="text-xs text-gray-500">
                  {metrics.api.successRate}% success
                </div>
              </div>
            </div>

            {/* Frontend Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getStatusIcon(metrics.frontend.status)}</span>
                <span className="text-sm font-medium">Frontend</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  {metrics.frontend.componentsHealthy}/{metrics.frontend.totalComponents} components
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(metrics.frontend.memoryUsage)}MB memory
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getStatusIcon(metrics.database.status)}</span>
                <span className="text-sm font-medium">Database</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  {metrics.database.connectionTime}ms
                </div>
                <div className="text-xs text-gray-500">
                  Connection time
                </div>
              </div>
            </div>

            {/* Error Summary */}
            {metrics.errors.total > 0 && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-600">Errors</span>
                  <div className="text-right">
                    <div className="text-xs text-red-600">
                      {metrics.errors.critical} critical
                    </div>
                    <div className="text-xs text-gray-500">
                      {metrics.errors.total} total
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-3 border-t bg-gray-50 rounded-b-lg">
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  const newMetrics = await checkSystemHealth();
                  setMetrics(newMetrics);
                }}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Refresh
              </button>
              <button
                onClick={exportReport}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Export
              </button>
              <button
                onClick={() => window.open('/api/health', '_blank')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for easy integration
export function useHealthDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);

  // Auto-show dashboard when there are errors
  useEffect(() => {
    const { getSystemHealth } = useErrorReporting();
    const health = getSystemHealth();
    
    if (health.status === 'critical' || health.criticalErrorsCount > 0) {
      setShowDashboard(true);
    }
  }, []);

  return {
    showDashboard,
    setShowDashboard,
    HealthDashboard
  };
}

