import { useOne, useShow } from "@refinedev/core";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { IEmployee } from "../../interfaces";
import { IVendor } from "../../interfaces/reference";
import { PayslipCalculator } from "../../components/payslip";

// Component to fetch and display vendor information
const VendorInfo: React.FC<{ vendorId?: number }> = ({ vendorId }) => {
  const { data, isLoading } = useOne<IVendor>({
    resource: "vendors",
    id: vendorId?.toString() || "",
    queryOptions: {
      enabled: !!vendorId,
    },
  });

  if (!vendorId) return <p className="font-medium">-</p>;
  if (isLoading) return <p className="font-medium">Loading...</p>;

  const vendor = data?.data;

  if (!vendor) return <p className="font-medium">Vendor ID: {vendorId}</p>;

  return (
    <p className="font-medium">
      {vendor.name} ({vendor.code_id})
    </p>
  );
};

export const EmployeeShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { queryResult } = useShow<IEmployee>({
    resource: "employees",
    id,
  });

  const { data, isLoading } = queryResult;
  const employee = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-xl font-bold">
          {employee.first_name} {employee.middle_name || ""}{" "}
          {employee.last_name} {employee.suffix || ""}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={() => navigate(`/employees/${id}/edit`)}
          />
          <Button
            label="Back to List"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => navigate("/employees")}
          />
        </div>
      </div>

      <TabView>
        <TabPanel header="Personal Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium">{employee.empl_id}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Status</p>
                    <p>
                      <Badge
                        severity={employee.active ? "success" : "danger"}
                        value={employee.active ? "Active" : "Inactive"}
                        />
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {employee.first_name} {employee.middle_name || ""}{" "}
                      {employee.last_name} {employee.suffix || ""}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{employee.sex || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="font-medium">
                      {formatDate(employee.birthday) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Kasam-bahay</p>
                    <p className="font-medium">
                      {employee.kasam_bahay ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                <div className="grid">
                  <div className="col-12">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{employee.email || "-"}</p>
                  </div>
                  <div className="col-12">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{employee.phone_no || "-"}</p>
                  </div>
                  <div className="col-12">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {employee.address
                        ? `${employee.address}, ${employee.city || ""}, ${
                            employee.province || ""
                          } ${employee.zip || ""}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12">
                    <p className="text-sm text-gray-500">Work Location</p>
                    <p className="font-medium">{employee.location || "-"}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12">
              <Card>
                <h3 className="text-lg font-semibold mb-3">ID Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">CTC/Valid ID</p>
                    <p className="font-medium">{employee.ctc_valid_id || "-"}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Place Issued</p>
                    <p className="font-medium">{employee.place_issued || "-"}</p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">CTC Date</p>
                    <p className="font-medium">
                      {formatDate(employee.ctc_date) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-3">
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      {employee.amount_paid
                        ? `₱${employee.amount_paid.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Employment Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Employment Details</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{employee.department_name || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{employee.position_title || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium">{employee.employment_type || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Vendor</p>
                    <VendorInfo vendorId={employee.vendor_id} />
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Date Hired</p>
                    <p className="font-medium">
                      {formatDate(employee.date_hired) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Regularized Date</p>
                    <p className="font-medium">
                      {formatDate(employee.regularized_date) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Contract Start</p>
                    <p className="font-medium">
                      {formatDate(employee.contract_start) || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Contract End</p>
                    <p className="font-medium">
                      {formatDate(employee.contract_end) || "-"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Government IDs</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">TAX ID</p>
                    <p className="font-medium">{employee.tax_id || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">TAX Withheld</p>
                    <p className="font-medium">
                      {employee.tax_withheld ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">SSS/GSIS</p>
                    <p className="font-medium">{employee.sss_gsis_no || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">SSS/GSIS Withheld</p>
                    <p className="font-medium">
                      {employee.sss_gsis_withheld ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">PHIC ID</p>
                    <p className="font-medium">{employee.phic_id || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">PHIC Withheld</p>
                    <p className="font-medium">
                      {employee.phic_withheld ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">HDMF ID</p>
                    <p className="font-medium">{employee.hdmf_id || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">HDMF Withheld</p>
                    <p className="font-medium">
                      {employee.hdmf_withheld ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="col-12">
                    <p className="text-sm text-gray-500">HDMF Account</p>
                    <p className="font-medium">{employee.hdmf_account || "-"}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Compensation Information">
          <div className="grid">
            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Compensation Details</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Rate Type</p>
                    <p className="font-medium">{employee.rate_type_name || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Pay Frequency</p>
                    <p className="font-medium">
                      {employee.pay_frequency_name || "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Base Monthly Pay</p>
                    <p className="font-medium">
                      {employee.base_monthly_pay
                        ? `₱${employee.base_monthly_pay.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Daily Rate</p>
                    <p className="font-medium">
                      {employee.daily_rate
                        ? `₱${employee.daily_rate.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="font-medium">
                      {employee.hourly_rate
                        ? `₱${employee.hourly_rate.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Minimum Earner</p>
                    <p className="font-medium">
                      {employee.minimum_earner ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 md:col-6">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-3">Allowances</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Cost of Living Allowance</p>
                    <p className="font-medium">
                      {employee.cola ? `₱${employee.cola.toFixed(2)}` : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">
                      Representation Allowance
                    </p>
                    <p className="font-medium">
                      {employee.representation_allowance
                        ? `₱${employee.representation_allowance.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Housing Allowance</p>
                    <p className="font-medium">
                      {employee.housing_allowance
                        ? `₱${employee.housing_allowance.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">
                      Transportation Allowance
                    </p>
                    <p className="font-medium">
                      {employee.transportation_allowance
                        ? `₱${employee.transportation_allowance.toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12">
              <Card>
                <h3 className="text-lg font-semibold mb-3">Banking Information</h3>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Bank</p>
                    <p className="font-medium">{employee.bank_name || "-"}</p>
                  </div>
                  <div className="col-12 md:col-6">
                    <p className="text-sm text-gray-500">Bank Account</p>
                    <p className="font-medium">{employee.bank_account || "-"}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payslip Calculator Component */}
            <div className="col-12">
              <PayslipCalculator employee={employee} />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};