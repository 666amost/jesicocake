'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface HealthStatus {
  status: string;
  timestamp: string;
  responseTime: string;
  services: {
    database: string;
    auth: string;
    storage: string;
  };
}

interface PingStatus {
  success: boolean;
  timestamp: string;
  responseTime: string;
  tables: {
    products: string;
    orders: string;
  };
}

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [ping, setPing] = useState<PingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const [healthRes, pingRes] = await Promise.all([
        fetch('/api/health-check'),
        fetch('/api/ping-db')
      ]);
      
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      }
      
      if (pingRes.ok) {
        const pingData = await pingRes.json();
        setPing(pingData);
      }
    } catch (error) {
      console.error('Status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'up' || status === 'active') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ClockIcon className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
          <p>Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          JESICO CAKE System Status
        </h1>

        {/* Overall Health */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          {health && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  health.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {health.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Time:</span>
                <span className="text-sm text-gray-600">{health.responseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Check:</span>
                <span className="text-sm text-gray-600">
                  {new Date(health.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Services Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Core Services</h3>
            {health && (
              <div className="space-y-3">
                {Object.entries(health.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="capitalize">{service}:</span>
                    <div className="flex items-center">
                      <StatusIcon status={status} />
                      <span className="ml-2 text-sm">{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Database Tables</h3>
            {ping && (
              <div className="space-y-3">
                {Object.entries(ping.tables).map(([table, status]) => (
                  <div key={table} className="flex items-center justify-between">
                    <span className="capitalize">{table}:</span>
                    <div className="flex items-center">
                      <StatusIcon status={status} />
                      <span className="ml-2 text-sm">{status}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>DB Response:</span>
                    <span>{ping.responseTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auto-refresh info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800 text-sm">
            🔄 Status updates automatically every 30 seconds<br />
            🕐 Cron jobs run every 6 hours to keep Supabase active
          </p>
        </div>
      </div>
    </div>
  );
}
