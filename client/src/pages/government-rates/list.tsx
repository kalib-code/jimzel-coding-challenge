import React, { useState } from "react";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const GovernmentRatesList: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // BIR Income Tax Rates Data
  const birRates = [
    { bracket: "₱250,000 or below", rate: "0%", computation: "Tax Exempt" },
    { bracket: "Over ₱250,000 to ₱400,000", rate: "15%", computation: "0 + 15% of the excess over ₱250,000" },
    { bracket: "Over ₱400,000 to ₱800,000", rate: "20%", computation: "₱22,500 + 20% of excess over ₱400,000" },
    { bracket: "Over ₱800,000 to ₱2,000,000", rate: "25%", computation: "₱102,500 + 25% of excess over ₱800,000" },
    { bracket: "Over ₱2,000,000 to ₱8,000,000", rate: "30%", computation: "₱402,500 + 30% of excess over ₱2,000,000" },
    { bracket: "Over ₱8,000,000", rate: "35%", computation: "₱2,202,500 + 35% of excess over ₱8,000,000" }
  ];

  // SSS Contribution Rates Data
  const sssRates = [
    { monthlyIncome: "₱4,250 (Minimum)", employeeShare: "4.5% (₱191.25)", employerShare: "9.5% (₱403.75)", totalContribution: "₱595.00" },
    { monthlyIncome: "₱5,000", employeeShare: "4.5% (₱225.00)", employerShare: "9.5% (₱475.00)", totalContribution: "₱700.00" },
    { monthlyIncome: "₱10,000", employeeShare: "4.5% (₱450.00)", employerShare: "9.5% (₱950.00)", totalContribution: "₱1,400.00" },
    { monthlyIncome: "₱15,000", employeeShare: "4.5% (₱675.00)", employerShare: "9.5% (₱1,425.00)", totalContribution: "₱2,100.00" },
    { monthlyIncome: "₱20,000", employeeShare: "4.5% (₱900.00)", employerShare: "9.5% (₱1,900.00)", totalContribution: "₱2,800.00" },
    { monthlyIncome: "₱25,000", employeeShare: "4.5% (₱1,125.00)", employerShare: "9.5% (₱2,375.00)", totalContribution: "₱3,500.00" },
    { monthlyIncome: "₱29,750 (Maximum)", employeeShare: "4.5% (₱1,338.75)", employerShare: "9.5% (₱2,826.25)", totalContribution: "₱4,165.00" }
  ];

  // GSIS Contribution Rates Data
  const gsisRates = [
    { memberType: "Regular Government Employee", employeeShare: "9% of Monthly Salary", employerShare: "12% of Monthly Salary", totalContribution: "21% of Monthly Salary" },
    { memberType: "Constitutional Officials and Members of Judiciary", employeeAndGovernmentShare: "3% of Monthly Compensation", notes: "For life insurance premiums only" }
  ];

  // HDMF/Pag-IBIG Contribution Rates Data
  const hdmfRates = [
    { monthlyIncome: "₱1,500 or less", employeeShare: "1% of Monthly Basic Salary", employerShare: "2% of Monthly Basic Salary", totalContribution: "3% of Monthly Basic Salary" },
    { monthlyIncome: "Over ₱1,500", employeeShare: "2% of Monthly Basic Salary", employerShare: "2% of Monthly Basic Salary", totalContribution: "4% of Monthly Basic Salary" },
    { monthlyIncome: "Monthly Fund Salary (MFS) Ceiling", notes: "₱10,000 (increased from ₱5,000 effective February 2024)" }
  ];

  // PhilHealth Contribution Rates Data
  const philHealthRates = [
    { monthlyIncome: "₱10,000 (Floor) and below", premiumRate: "5%", employeeShare: "2.5%", employerShare: "2.5%", monthlyPremium: "₱500.00" },
    { monthlyIncome: "₱15,000", premiumRate: "5%", employeeShare: "2.5% (₱375.00)", employerShare: "2.5% (₱375.00)", monthlyPremium: "₱750.00" },
    { monthlyIncome: "₱20,000", premiumRate: "5%", employeeShare: "2.5% (₱500.00)", employerShare: "2.5% (₱500.00)", monthlyPremium: "₱1,000.00" },
    { monthlyIncome: "₱50,000", premiumRate: "5%", employeeShare: "2.5% (₱1,250.00)", employerShare: "2.5% (₱1,250.00)", monthlyPremium: "₱2,500.00" },
    { monthlyIncome: "₱80,000", premiumRate: "5%", employeeShare: "2.5% (₱2,000.00)", employerShare: "2.5% (₱2,000.00)", monthlyPremium: "₱4,000.00" },
    { monthlyIncome: "₱100,000 (Ceiling) and above", premiumRate: "5%", employeeShare: "2.5% (₱2,500.00)", employerShare: "2.5% (₱2,500.00)", monthlyPremium: "₱5,000.00" }
  ];

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">Government Rates</h1>
      </div>

      <Card>
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          {/* BIR Income Tax Rates Tab */}
          <TabPanel header="BIR Income Tax">
            <div className="mb-3">
              <h2 className="text-lg font-semibold mb-2">BIR Income Tax Rates (2024)</h2>
              <p className="mb-3">
                These are the current income tax rates in the Philippines as mandated by the Tax Reform for Acceleration and Inclusion (TRAIN) Law.
              </p>
            </div>
            <DataTable value={birRates} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} className="p-datatable-gridlines" responsiveLayout="scroll">
              <Column field="bracket" header="Tax Bracket" />
              <Column field="rate" header="Tax Rate" />
              <Column field="computation" header="Computation" />
            </DataTable>
          </TabPanel>

          {/* SSS Contribution Rates Tab */}
          <TabPanel header="SSS">
            <div className="mb-3">
              <h2 className="text-lg font-semibold mb-2">SSS Contribution Rates (2024)</h2>
              <p className="mb-3">
                Current Social Security System (SSS) contribution rates effective in 2024. The contribution rate is 14%, with employers shouldering 9.5% and employees 4.5%.
              </p>
            </div>
            <DataTable value={sssRates} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} className="p-datatable-gridlines" responsiveLayout="scroll">
              <Column field="monthlyIncome" header="Monthly Income" />
              <Column field="employeeShare" header="Employee Share (4.5%)" />
              <Column field="employerShare" header="Employer Share (9.5%)" />
              <Column field="totalContribution" header="Total Contribution" />
            </DataTable>
          </TabPanel>

          {/* GSIS Contribution Rates Tab */}
          <TabPanel header="GSIS">
            <div className="mb-3">
              <h2 className="text-lg font-semibold mb-2">GSIS Contribution Rates (2024)</h2>
              <p className="mb-3">
                Current Government Service Insurance System (GSIS) contribution rates for government employees.
              </p>
            </div>
            <DataTable value={gsisRates} className="p-datatable-gridlines" responsiveLayout="scroll">
              <Column field="memberType" header="Member Type" />
              <Column field="employeeShare" header="Employee Share" />
              <Column field="employerShare" header="Employer/Government Share" />
              <Column field="totalContribution" header="Total Contribution" />
              <Column field="notes" header="Notes" />
            </DataTable>
          </TabPanel>

          {/* HDMF/Pag-IBIG Contribution Rates Tab */}
          <TabPanel header="Pag-IBIG (HDMF)">
            <div className="mb-3">
              <h2 className="text-lg font-semibold mb-2">Pag-IBIG Fund (HDMF) Contribution Rates (2024)</h2>
              <p className="mb-3">
                Current Home Development Mutual Fund (HDMF) or Pag-IBIG Fund contribution rates. The maximum monthly fund salary has increased to ₱10,000 effective February 2024.
              </p>
            </div>
            <DataTable value={hdmfRates} className="p-datatable-gridlines" responsiveLayout="scroll">
              <Column field="monthlyIncome" header="Monthly Income" />
              <Column field="employeeShare" header="Employee Share" />
              <Column field="employerShare" header="Employer Share" />
              <Column field="totalContribution" header="Total Contribution" />
              <Column field="notes" header="Notes" />
            </DataTable>
          </TabPanel>

          {/* PhilHealth Contribution Rates Tab */}
          <TabPanel header="PhilHealth">
            <div className="mb-3">
              <h2 className="text-lg font-semibold mb-2">PhilHealth Contribution Rates (2024)</h2>
              <p className="mb-3">
                Current Philippine Health Insurance Corporation (PhilHealth) contribution rates. The premium rate has increased to 5% in 2024, with employers and employees each contributing 2.5%.
              </p>
            </div>
            <DataTable value={philHealthRates} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} className="p-datatable-gridlines" responsiveLayout="scroll">
              <Column field="monthlyIncome" header="Monthly Income" />
              <Column field="premiumRate" header="Premium Rate" />
              <Column field="employeeShare" header="Employee Share" />
              <Column field="employerShare" header="Employer Share" />
              <Column field="monthlyPremium" header="Monthly Premium" />
            </DataTable>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};