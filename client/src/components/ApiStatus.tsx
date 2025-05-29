import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

interface TestEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

export const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking API connection...');
  const [testResults, setTestResults] = useState<{path: string, success: boolean, data: any}[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('/api/departments');
  const [customResponse, setCustomResponse] = useState<any>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState(false);

  const testEndpoints: TestEndpoint[] = [
    { name: 'API Health', path: '/api/health', method: 'GET' },
    { name: 'API Root', path: '/api', method: 'GET' },
    { name: 'API Test', path: '/api/test', method: 'GET' },
    { name: 'Departments', path: '/api/departments', method: 'GET' },
    { name: 'Employees', path: '/api/employees', method: 'GET' },
  ];

  const checkApiStatus = async () => {
    try {
      setStatus('loading');
      setMessage('Checking API connection...');
      setTestResults([]);

      // Use direct axios call to test
      const response = await axios.get('/api/health');
      console.log('API Health Response:', response.data);

      setStatus('connected');
      setMessage(`API connected: ${new Date().toLocaleTimeString()}`);

      // Run tests on all endpoints
      runAllTests();
    } catch (error) {
      console.error('API Health Check Error:', error);
      setStatus('error');
      setMessage('Failed to connect to API');
    }
  };

  const runAllTests = async () => {
    const results = [];

    for (const endpoint of testEndpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: endpoint.path,
          data: endpoint.data
        });

        results.push({
          path: endpoint.path,
          success: true,
          data: response.data
        });
      } catch (error) {
        console.error(`Error testing ${endpoint.path}:`, error);
        results.push({
          path: endpoint.path,
          success: false,
          data: error
        });
      }
    }

    setTestResults(results);
  };

  const testCustomEndpoint = async () => {
    setCustomLoading(true);
    setCustomResponse(null);
    setCustomError(null);

    try {
      const response = await axios.get(customEndpoint);
      setCustomResponse(response.data);
    } catch (error) {
      console.error('Custom endpoint error:', error);
      setCustomError(error.message || 'Unknown error');
    } finally {
      setCustomLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <Card className="mb-4">
      <div className="flex align-items-center justify-content-between">
        <div>
          <h3 className="m-0">API Status</h3>
          <p className="mt-2 mb-0">{message}</p>
        </div>
        <div className="flex align-items-center gap-3">
          <Tag
            severity={status === 'connected' ? 'success' : status === 'loading' ? 'info' : 'danger'}
            value={status === 'connected' ? 'Connected' : status === 'loading' ? 'Loading' : 'Error'}
          />
          <Button
            icon="pi pi-refresh"
            onClick={checkApiStatus}
            loading={status === 'loading'}
            text
          />
          <Button
            icon={expanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            onClick={() => setExpanded(!expanded)}
            text
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          <TabView>
            <TabPanel header="Endpoint Tests">
              <DataTable value={testResults} stripedRows>
                <Column field="path" header="Endpoint" />
                <Column
                  field="success"
                  header="Status"
                  body={(rowData) => (
                    <Tag
                      severity={rowData.success ? 'success' : 'danger'}
                      value={rowData.success ? 'Success' : 'Failed'}
                    />
                  )}
                />
                <Column
                  field="data"
                  header="Response"
                  body={(rowData) => (
                    <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                      <pre style={{ margin: 0 }}>{JSON.stringify(rowData.data, null, 2)}</pre>
                    </div>
                  )}
                />
              </DataTable>
            </TabPanel>
            <TabPanel header="Custom Test">
              <div className="p-inputgroup mb-3">
                <InputText
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="Enter API endpoint path (e.g., /api/departments)"
                />
                <Button
                  label="Test"
                  onClick={testCustomEndpoint}
                  loading={customLoading}
                />
              </div>

              {customResponse && (
                <div className="mt-3">
                  <h4>Response</h4>
                  <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <pre style={{ margin: 0 }}>{JSON.stringify(customResponse, null, 2)}</pre>
                  </div>
                </div>
              )}

              {customError && (
                <div className="mt-3">
                  <h4>Error</h4>
                  <div className="p-error">{customError}</div>
                </div>
              )}
            </TabPanel>
          </TabView>
        </div>
      )}
    </Card>
  );
};