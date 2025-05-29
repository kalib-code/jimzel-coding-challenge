import {
    ErrorComponent,
    Refine
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// PrimeReact Imports
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import routerBindings, {
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Layout } from "./components/layout";
import { NotificationProvider } from "./components/notification";

// New imports for our pages
import { EmployeeCreate } from "./pages/employees/create";
import { EmployeeEdit } from "./pages/employees/edit";
import { EmployeeList } from "./pages/employees/list";
import { EmployeeShow } from "./pages/employees/show";

import { DepartmentCreate } from "./pages/departments/create";
import { DepartmentEdit } from "./pages/departments/edit";
import { DepartmentList } from "./pages/departments/list";
import { DepartmentShow } from "./pages/departments/show";

import { LoanCreate } from "./pages/loans/create";
import { LoanEdit } from "./pages/loans/edit";
import { LoanList } from "./pages/loans/list";
import { LoanShow } from "./pages/loans/show";

// Reference data pages

// Import custom data provider
import { dataProvider } from "./providers/dataProvider";
import { httpClient } from "./providers/httpClient";

// Get API URL from environment variable
// Since we're using a proxy, we can just use /api
const API_URL = "/api";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
          <PrimeReactProvider>
            <NotificationProvider>
              <Refine
            dataProvider={dataProvider(API_URL, httpClient)}
            routerProvider={routerBindings}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "R2h0qW-vvfvAC-H9tboI",
              mutationMode: "pessimistic"
            }}
            resources={[
              {
                name: "employees",
                list: "/employees",
                create: "/employees/create",
                edit: "/employees/:id/edit",
                show: "/employees/:id",
                meta: {
                  canDelete: true,
                  label: "Employees",

                },
              },
              {
                name: "departments",
                list: "/departments",
                create: "/departments/create",
                edit: "/departments/:id/edit",
                show: "/departments/:id",
                meta: {
                  canDelete: true,
                  label: "Departments",
                },
              },
              {
                name: "loans",
                list: "/loans",
                create: "/loans/create",
                edit: "/loans/:id/edit",
                show: "/loans/:id",
                meta: {
                  canDelete: true,
                  label: "Loans",
                },
              }
            ]}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="employees" />}
                />

                {/* Employee routes */}
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/create" element={<EmployeeCreate />} />
                <Route path="/employees/:id" element={<EmployeeShow />} />
                <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

                {/* Department routes */}
                <Route path="/departments" element={<DepartmentList />} />
                <Route path="/departments/create" element={<DepartmentCreate />} />
                <Route path="/departments/:id" element={<DepartmentShow />} />
                <Route path="/departments/:id/edit" element={<DepartmentEdit />} />

                {/* Loan routes */}
                <Route path="/loans" element={<LoanList />} />
                <Route path="/loans/create" element={<LoanCreate />} />
                <Route path="/loans/:id" element={<LoanShow />} />
                <Route path="/loans/:id/edit" element={<LoanEdit />} />

                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
              </Refine>
            </NotificationProvider>
          </PrimeReactProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
