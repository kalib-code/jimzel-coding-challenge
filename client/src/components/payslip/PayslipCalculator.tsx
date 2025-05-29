import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { IEmployee } from "../../interfaces";

interface PayslipCalculatorProps {
  employee: IEmployee;
}

export const PayslipCalculator: React.FC<PayslipCalculatorProps> = ({ employee }) => {
  // Calculate the total monthly salary including allowances
  const totalMonthlySalary = useMemo(() => {
    const basePay = employee.base_monthly_pay || 0;
    const cola = employee.cola || 0;
    const representation = employee.representation_allowance || 0;
    const housing = employee.housing_allowance || 0;
    const transportation = employee.transportation_allowance || 0;
    
    return basePay + cola + representation + housing + transportation;
  }, [employee]);

  // Calculate SSS contribution
  const sssContribution = useMemo(() => {
    if (!employee.sss_gsis_withheld) return 0;
    
    const monthlySalary = employee.base_monthly_pay || 0;
    
    // SSS Contribution Table (2024)
    if (monthlySalary <= 4250) return 191.25; // 4.5% of minimum 4,250
    if (monthlySalary >= 29750) return 1338.75; // 4.5% of maximum 29,750
    
    // For salaries in between, calculate 4.5%
    return monthlySalary * 0.045;
  }, [employee]);

  // Calculate PhilHealth contribution
  const philhealthContribution = useMemo(() => {
    if (!employee.phic_withheld) return 0;
    
    const monthlySalary = employee.base_monthly_pay || 0;
    const rate = 0.025; // 2.5% employee share for 2024
    
    // PhilHealth Contribution (2024)
    if (monthlySalary <= 10000) return 250; // 2.5% of 10,000 (floor)
    if (monthlySalary >= 100000) return 2500; // 2.5% of 100,000 (ceiling)
    
    // For salaries in between, calculate 2.5%
    return monthlySalary * rate;
  }, [employee]);

  // Calculate Pag-IBIG contribution
  const pagibigContribution = useMemo(() => {
    if (!employee.hdmf_withheld) return 0;
    
    const monthlySalary = employee.base_monthly_pay || 0;
    
    // Pag-IBIG Contribution (2024)
    if (monthlySalary <= 1500) return monthlySalary * 0.01; // 1% for salaries <= 1,500
    return 200; // Fixed 200 contribution for salaries > 1,500 (based on 10,000 ceiling with 2% rate)
  }, [employee]);

  // Calculate income tax based on TRAIN law
  const incomeTax = useMemo(() => {
    if (!employee.tax_withheld) return 0;
    
    // Compute annual taxable income
    // For simplicity, we assume the taxable income is the monthly salary less contributions * 12
    const monthlyContributions = sssContribution + philhealthContribution + pagibigContribution;
    const monthlyTaxableIncome = totalMonthlySalary - monthlyContributions;
    const annualTaxableIncome = monthlyTaxableIncome * 12;
    
    // Apply TRAIN law tax rates (2024)
    if (employee.minimum_earner || annualTaxableIncome <= 250000) return 0; // Tax exempt
    
    if (annualTaxableIncome <= 400000) {
      return ((annualTaxableIncome - 250000) * 0.15) / 12; // 15% of excess over 250K
    }
    
    if (annualTaxableIncome <= 800000) {
      return (22500 + (annualTaxableIncome - 400000) * 0.20) / 12; // 22.5K + 20% of excess over 400K
    }
    
    if (annualTaxableIncome <= 2000000) {
      return (102500 + (annualTaxableIncome - 800000) * 0.25) / 12; // 102.5K + 25% of excess over 800K
    }
    
    if (annualTaxableIncome <= 8000000) {
      return (402500 + (annualTaxableIncome - 2000000) * 0.30) / 12; // 402.5K + 30% of excess over 2M
    }
    
    // For annual income over 8M
    return (2202500 + (annualTaxableIncome - 8000000) * 0.35) / 12; // 2.2025M + 35% of excess over 8M
  }, [employee, sssContribution, philhealthContribution, pagibigContribution, totalMonthlySalary]);

  // Calculate total deductions
  const totalDeductions = useMemo(() => {
    return sssContribution + philhealthContribution + pagibigContribution + incomeTax;
  }, [sssContribution, philhealthContribution, pagibigContribution, incomeTax]);

  // Calculate net pay
  const netPay = useMemo(() => {
    return totalMonthlySalary - totalDeductions;
  }, [totalMonthlySalary, totalDeductions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="mt-3">
      <h3 className="text-lg font-semibold mb-3">Monthly Payslip Calculation</h3>
      
      <div className="grid">
        <div className="col-12 md:col-6">
          <h4 className="text-md font-medium mb-2">Income</h4>
          
          <div className="flex justify-content-between mb-2">
            <span>Base Monthly Salary</span>
            <span className="font-medium">{formatCurrency(employee.base_monthly_pay || 0)}</span>
          </div>
          
          {employee.cola > 0 && (
            <div className="flex justify-content-between mb-2">
              <span>Cost of Living Allowance</span>
              <span className="font-medium">{formatCurrency(employee.cola)}</span>
            </div>
          )}
          
          {employee.representation_allowance > 0 && (
            <div className="flex justify-content-between mb-2">
              <span>Representation Allowance</span>
              <span className="font-medium">{formatCurrency(employee.representation_allowance)}</span>
            </div>
          )}
          
          {employee.housing_allowance > 0 && (
            <div className="flex justify-content-between mb-2">
              <span>Housing Allowance</span>
              <span className="font-medium">{formatCurrency(employee.housing_allowance)}</span>
            </div>
          )}
          
          {employee.transportation_allowance > 0 && (
            <div className="flex justify-content-between mb-2">
              <span>Transportation Allowance</span>
              <span className="font-medium">{formatCurrency(employee.transportation_allowance)}</span>
            </div>
          )}
          
          <Divider />
          
          <div className="flex justify-content-between font-bold">
            <span>Total Monthly Income</span>
            <span>{formatCurrency(totalMonthlySalary)}</span>
          </div>
        </div>
        
        <div className="col-12 md:col-6">
          <h4 className="text-md font-medium mb-2">Deductions</h4>
          
          {employee.sss_gsis_withheld && (
            <div className="flex justify-content-between mb-2">
              <span>SSS Contribution (4.5%)</span>
              <span className="font-medium">{formatCurrency(sssContribution)}</span>
            </div>
          )}
          
          {employee.phic_withheld && (
            <div className="flex justify-content-between mb-2">
              <span>PhilHealth Contribution (2.5%)</span>
              <span className="font-medium">{formatCurrency(philhealthContribution)}</span>
            </div>
          )}
          
          {employee.hdmf_withheld && (
            <div className="flex justify-content-between mb-2">
              <span>Pag-IBIG Contribution</span>
              <span className="font-medium">{formatCurrency(pagibigContribution)}</span>
            </div>
          )}
          
          {employee.tax_withheld && (
            <div className="flex justify-content-between mb-2">
              <span>Withholding Tax</span>
              <span className="font-medium">{formatCurrency(incomeTax)}</span>
            </div>
          )}
          
          <Divider />
          
          <div className="flex justify-content-between font-bold">
            <span>Total Deductions</span>
            <span>{formatCurrency(totalDeductions)}</span>
          </div>
        </div>
      </div>
      
      <Divider />
      
      <div className="flex justify-content-between align-items-center">
        <span className="text-xl font-bold">Net Pay</span>
        <span className="text-xl font-bold">{formatCurrency(netPay)}</span>
      </div>
      
      <div className="mt-3 text-sm text-gray-500">
        <p>* This is an estimated calculation based on the current government rates.</p>
        <p>* Actual deductions may vary based on specific circumstances and changes in government policies.</p>
      </div>
    </Card>
  );
};