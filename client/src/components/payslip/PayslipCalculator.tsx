import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { IEmployee } from "../../interfaces";

interface PayslipCalculatorProps {
  employee: IEmployee;
}

export const PayslipCalculator: React.FC<PayslipCalculatorProps> = ({ employee }) => {
  // Convert any pay rate to monthly equivalent based on rate type
  const convertToMonthly = useMemo(() => {
    // Default values if not provided
    const daysPerMonth = employee.days_per_month || 22;
    const hoursPerDay = employee.hours_per_day || 8;
    
    // Rate type conversion
    if (employee.rate_type_name === "Monthly") {
      return employee.base_monthly_pay || 0;
    } else if (employee.rate_type_name === "Daily") {
      return (employee.daily_rate || 0) * daysPerMonth;
    } else if (employee.rate_type_name === "Hourly") {
      return (employee.hourly_rate || 0) * hoursPerDay * daysPerMonth;
    }
    
    // Default to base_monthly_pay if rate type is unknown
    return employee.base_monthly_pay || 0;
  }, [employee]);

  // Calculate the total monthly salary including allowances
  const totalMonthlySalary = useMemo(() => {
    const basePay = convertToMonthly;
    const cola = employee.cola || 0;
    const representation = employee.representation_allowance || 0;
    const housing = employee.housing_allowance || 0;
    const transportation = employee.transportation_allowance || 0;
    
    return basePay + cola + representation + housing + transportation;
  }, [convertToMonthly, employee]);

  // Calculate SSS contribution
  const sssContribution = useMemo(() => {
    if (!employee.sss_gsis_withheld) return 0;
    
    const monthlySalary = convertToMonthly;
    
    // SSS Contribution Table (2024)
    if (monthlySalary <= 4250) return 191.25; // 4.5% of minimum 4,250
    if (monthlySalary >= 29750) return 1338.75; // 4.5% of maximum 29,750
    
    // For salaries in between, calculate 4.5%
    return monthlySalary * 0.045;
  }, [employee, convertToMonthly]);

  // Calculate PhilHealth contribution
  const philhealthContribution = useMemo(() => {
    if (!employee.phic_withheld) return 0;
    
    const monthlySalary = convertToMonthly;
    const rate = 0.025; // 2.5% employee share for 2024
    
    // PhilHealth Contribution (2024)
    if (monthlySalary <= 10000) return 250; // 2.5% of 10,000 (floor)
    if (monthlySalary >= 100000) return 2500; // 2.5% of 100,000 (ceiling)
    
    // For salaries in between, calculate 2.5%
    return monthlySalary * rate;
  }, [employee, convertToMonthly]);

  // Calculate Pag-IBIG contribution
  const pagibigContribution = useMemo(() => {
    if (!employee.hdmf_withheld) return 0;
    
    const monthlySalary = convertToMonthly;
    
    // Pag-IBIG Contribution (2024)
    if (monthlySalary <= 1500) return monthlySalary * 0.01; // 1% for salaries <= 1,500
    return 200; // Fixed 200 contribution for salaries > 1,500 (based on 10,000 ceiling with 2% rate)
  }, [employee, convertToMonthly]);

  // Calculate income tax based on TRAIN law
  const incomeTax = useMemo(() => {
    console.log("===== STARTING TAX CALCULATION =====");

    // Handle both boolean false and numeric 0 values
    if (employee.tax_withheld === false || employee.tax_withheld === 0) {
      console.log("TAX NOT WITHHELD: tax_withheld flag is explicitly false or 0");
      return 0;
    }

    // Ensure tax_withheld has a value (true by default if not set)
    // Handle both boolean true and numeric 1 values
    const isTaxWithheld = employee.tax_withheld === true || employee.tax_withheld === 1 || employee.tax_withheld === "1";
    console.log("Tax Withheld Flag Status:", isTaxWithheld, "(raw value:", employee.tax_withheld, ", type:", typeof employee.tax_withheld, ")");

    if (!isTaxWithheld) {
      console.log("TAX NOT WITHHELD: tax_withheld evaluated to false");
      return 0;
    }

    // Compute annual taxable income
    const monthlyContributions = sssContribution + philhealthContribution + pagibigContribution;
    const monthlyTaxableIncome = totalMonthlySalary - monthlyContributions;
    const annualTaxableIncome = monthlyTaxableIncome * 12;

    // Print detailed debug info about the employee and calculation inputs
    console.log("Tax Calculation Inputs:");
    console.log("- Employee ID:", employee.empl_id);
    console.log("- Monthly Salary (Equivalent):", totalMonthlySalary);
    console.log("- Rate Type:", employee.rate_type_name);
    console.log("- Base Monthly Pay:", employee.base_monthly_pay);
    console.log("- Daily Rate:", employee.daily_rate);
    console.log("- Hourly Rate:", employee.hourly_rate);
    console.log("- Monthly Contributions Total:", monthlyContributions);
    console.log("  - SSS:", sssContribution);
    console.log("  - PhilHealth:", philhealthContribution);
    console.log("  - Pag-IBIG:", pagibigContribution);
    console.log("- Monthly Taxable Income:", monthlyTaxableIncome);
    console.log("- Annual Taxable Income:", annualTaxableIncome);
    console.log("- Minimum Earner Flag:", employee.minimum_earner);

    // Special case for minimum earners (exempt from income tax)
    // Handle both boolean true and numeric 1 values
    const isMinimumEarner = employee.minimum_earner === true || employee.minimum_earner === 1;
    console.log("Minimum Earner Status:", isMinimumEarner, "(raw value:", employee.minimum_earner, ")");

    if (isMinimumEarner) {
      console.log("TAX CALCULATION: 0 (Minimum Earner)");
      return 0;
    }

    // Monthly tax calculation based on annual income tax divided by 12
    let annualTax = 0;

    // Force decimal value to ensure proper computation with large numbers
    const annualTaxableIncomeDecimal = parseFloat(annualTaxableIncome.toFixed(2));

    // Apply appropriate tax bracket based on annual taxable income
    if (annualTaxableIncomeDecimal <= 250000) {
      annualTax = 0; // Tax exempt up to 250K
      console.log("TAX CALCULATION: 0 (Below 250K exemption)");
    } else if (annualTaxableIncomeDecimal <= 400000) {
      annualTax = (annualTaxableIncomeDecimal - 250000) * 0.15; // 15% of excess over 250K
      console.log(`TAX CALCULATION: ${annualTaxableIncomeDecimal} - 250000 = ${annualTaxableIncomeDecimal - 250000} × 15% = ${annualTax} (15% bracket)`);
    } else if (annualTaxableIncomeDecimal <= 800000) {
      annualTax = 22500 + (annualTaxableIncomeDecimal - 400000) * 0.20; // 22.5K + 20% of excess over 400K
      console.log(`TAX CALCULATION: 22500 + (${annualTaxableIncomeDecimal} - 400000) × 20% = ${annualTax} (20% bracket)`);
    } else if (annualTaxableIncomeDecimal <= 2000000) {
      annualTax = 102500 + (annualTaxableIncomeDecimal - 800000) * 0.25; // 102.5K + 25% of excess over 800K
      console.log(`TAX CALCULATION: 102500 + (${annualTaxableIncomeDecimal} - 800000) × 25% = ${annualTax} (25% bracket)`);
    } else if (annualTaxableIncomeDecimal <= 8000000) {
      annualTax = 402500 + (annualTaxableIncomeDecimal - 2000000) * 0.30; // 402.5K + 30% of excess over 2M
      console.log(`TAX CALCULATION: 402500 + (${annualTaxableIncomeDecimal} - 2000000) × 30% = ${annualTax} (30% bracket)`);
    } else {
      annualTax = 2202500 + (annualTaxableIncomeDecimal - 8000000) * 0.35; // 2.2025M + 35% of excess over 8M
      console.log(`TAX CALCULATION: 2202500 + (${annualTaxableIncomeDecimal} - 8000000) × 35% = ${annualTax} (35% bracket)`);
    }

    // Convert annual tax to monthly and ensure it's a proper number
    const monthlyTax = parseFloat((annualTax / 12).toFixed(2));
    console.log(`MONTHLY TAX: ${annualTax} ÷ 12 = ${monthlyTax}`);

    console.log("===== END TAX CALCULATION =====");
    return monthlyTax;
  }, [employee, sssContribution, philhealthContribution, pagibigContribution, totalMonthlySalary]);

  // Calculate total deductions
  const totalDeductions = useMemo(() => {
    return sssContribution + philhealthContribution + pagibigContribution + incomeTax;
  }, [sssContribution, philhealthContribution, pagibigContribution, incomeTax]);

  // Calculate net pay
  const netPay = useMemo(() => {
    return totalMonthlySalary - totalDeductions;
  }, [totalMonthlySalary, totalDeductions]);

  // Get pay frequency multiplier to convert monthly values to per-period values
  const payFrequencyMultiplier = useMemo(() => {
    // Default to monthly if not specified (multiplier = 1)
    if (!employee.pay_frequency_name) return 1;
    
    switch(employee.pay_frequency_name) {
      case "Monthly": return 1; // 1 payment per month
      case "Semi-monthly": return 0.5; // 2 payments per month
      case "Bi-weekly": return 12/26; // 26 payments per year
      case "Weekly": return 12/52; // 52 payments per year
      default: return 1;
    }
  }, [employee.pay_frequency_name]);

  // Calculate per-period amounts
  const perPeriodSalary = totalMonthlySalary * payFrequencyMultiplier;
  const perPeriodDeductions = totalDeductions * payFrequencyMultiplier;
  const perPeriodNetPay = netPay * payFrequencyMultiplier;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="mt-3">
      <h3 className="text-lg font-semibold mb-3">
        Payslip Calculation
        <div className="text-sm font-normal mt-1">
          <span className="mr-2">Rate Type: {employee.rate_type_name || "Monthly"}</span>
          <span>Pay Frequency: {employee.pay_frequency_name || "Monthly"}</span>
        </div>
      </h3>
      
      <div className="grid">
        <div className="col-12 md:col-6">
          <h4 className="text-md font-medium mb-2">Monthly Income</h4>
          
          <div className="flex justify-content-between mb-2">
            <span>Base Salary (Monthly Equivalent)</span>
            <span className="font-medium">{formatCurrency(convertToMonthly)}</span>
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
          <h4 className="text-md font-medium mb-2">Monthly Deductions</h4>
          
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
          
          {/* Withholding Tax Section */}
          {(employee.tax_withheld === true || employee.tax_withheld === 1) ? (
            incomeTax > 0 ? (
              <div className="flex justify-content-between mb-2">
                <span>Withholding Tax</span>
                <span className="font-medium">{formatCurrency(incomeTax)}</span>
              </div>
            ) : (
              <div className="flex justify-content-between mb-2">
                <span>Withholding Tax</span>
                <span className="font-medium text-500">
                  ₱0.00 {(employee.minimum_earner === true || employee.minimum_earner === 1) ? "(Minimum Earner - Tax Exempt)" : "(Below ₱250K Threshold - Tax Exempt)"}
                </span>
              </div>
            )
          ) : (
            <div className="flex justify-content-between mb-2">
              <span>Withholding Tax</span>
              <span className="font-medium text-500">Not Withheld</span>
            </div>
          )}
          
          <Divider />
          
          <div className="flex justify-content-between font-bold">
            <span>Total Monthly Deductions</span>
            <span>{formatCurrency(totalDeductions)}</span>
          </div>
        </div>
      </div>
      
      <Divider />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <span className="text-xl font-bold">Monthly Net Pay</span>
        <span className="text-xl font-bold">{formatCurrency(netPay)}</span>
      </div>
      
      {/* Per-period calculation based on pay frequency */}
      {employee.pay_frequency_name && employee.pay_frequency_name !== "Monthly" && (
        <>
          <h4 className="text-md font-medium mb-2">Per {employee.pay_frequency_name} Period</h4>
          <div className="grid">
            <div className="col-12 md:col-4">
              <div className="flex justify-content-between mb-2">
                <span>Gross Pay:</span>
                <span className="font-medium">{formatCurrency(perPeriodSalary)}</span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="flex justify-content-between mb-2">
                <span>Deductions:</span>
                <span className="font-medium">{formatCurrency(perPeriodDeductions)}</span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="flex justify-content-between mb-2 font-bold">
                <span>Net Pay:</span>
                <span>{formatCurrency(perPeriodNetPay)}</span>
              </div>
            </div>
          </div>
          <Divider />
        </>
      )}
      
      <div className="mt-3 text-sm text-gray-500">
        <p>* This is an estimated calculation based on the current government rates.</p>
        <p>* Actual deductions may vary based on specific circumstances and changes in government policies.</p>

        {/* Tax Calculation Explanation */}
        {(employee.tax_withheld === true || employee.tax_withheld === 1) && incomeTax === 0 && (
          <div className="mt-2 p-2 bg-gray-100 border-round">
            <p className="mb-1 font-medium">Tax Calculation Note:</p>
            <p>
              No income tax is calculated because{" "}
              {(employee.minimum_earner === true || employee.minimum_earner === 1)
                ? "the employee is marked as a minimum earner (tax exempt)."
                : "the annual taxable income is below ₱250,000 (tax exempt threshold)."}
            </p>
            <p>
              Annual taxable income = (Monthly income - Monthly contributions) × 12 months ={" "}
              {formatCurrency((totalMonthlySalary - (sssContribution + philhealthContribution + pagibigContribution)) * 12)}
            </p>
            {(employee.minimum_earner === true || employee.minimum_earner === 1) && employee.base_monthly_pay > 20000 && (
              <p className="mt-1 text-blue-600">
                <strong>Note:</strong> This employee has a high salary but is marked as a minimum earner.
                If this is incorrect, please edit the employee record and uncheck the "Minimum Earner" checkbox.
              </p>
            )}
            <p className="mt-1">
              <a href="/government-rates" target="_blank" rel="noopener noreferrer" className="text-primary">
                View BIR tax rate tables
              </a>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};