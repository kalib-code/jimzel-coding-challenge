import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { RefineKbarProvider } from '@refinedev/kbar';
import { PrimeReactProvider } from 'primereact/api';
import { NotificationProvider } from '../../src/components/notification';
import { Refine } from '@refinedev/core';

// Create a custom renderer that includes all the providers used in the app
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // Mock minimal Refine context for tests
  const mockDataProvider = {
    getList: vi.fn().mockResolvedValue({ data: [], total: 0 }),
    getMany: vi.fn().mockResolvedValue({ data: [] }),
    getOne: vi.fn().mockResolvedValue({ data: {} }),
    create: vi.fn().mockResolvedValue({ data: {} }),
    update: vi.fn().mockResolvedValue({ data: {} }),
    deleteOne: vi.fn().mockResolvedValue({ data: {} }),
    getApiUrl: vi.fn().mockReturnValue(''),
    custom: vi.fn().mockResolvedValue({ data: {} }),
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <PrimeReactProvider>
          <NotificationProvider>
            <Refine
              dataProvider={mockDataProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "test",
              }}
              resources={[]}
            >
              {children}
            </Refine>
          </NotificationProvider>
        </PrimeReactProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };