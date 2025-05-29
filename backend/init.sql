-- Employee Management System Database Schema

-- MySQL 5.7 uses mysql_native_password by default

-- Department Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  can_transfer BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INT,
  project_id INT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Positions Table
CREATE TABLE IF NOT EXISTS positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employment Types Table
CREATE TABLE IF NOT EXISTS employment_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  contact_number VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Banks Table
CREATE TABLE IF NOT EXISTS banks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20),
  active BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pay Frequencies Table
CREATE TABLE IF NOT EXISTS pay_frequencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  days_interval INT NOT NULL,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rate Types Table
CREATE TABLE IF NOT EXISTS rate_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Loan Types Table
CREATE TABLE IF NOT EXISTS loan_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  default_interest_rate DECIMAL(5,2) DEFAULT 0,
  default_term_months INT DEFAULT 12,
  active BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empl_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  suffix VARCHAR(10),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  zip VARCHAR(20),
  location VARCHAR(100),
  email VARCHAR(100),
  phone_no VARCHAR(20),
  birthday DATE,
  sex ENUM('Male', 'Female', 'Other'),
  active BOOLEAN DEFAULT TRUE,
  kasam_bahay BOOLEAN DEFAULT FALSE,
  ctc_valid_id VARCHAR(100),
  place_issued VARCHAR(100),
  ctc_date DATE,
  amount_paid DECIMAL(10,2),
  notes TEXT,
  user_profile VARCHAR(50),
  manager_id INT,
  department_id INT,
  project_id INT,
  team_id INT,
  position_id INT,
  employment_type_id INT,
  vendor_id INT,
  date_hired DATE,
  regularized_date DATE,
  separated_date DATE,
  contract_start DATE,
  contract_end DATE,
  minimum_earner BOOLEAN DEFAULT FALSE,
  tax_id VARCHAR(20),
  tax_withheld BOOLEAN DEFAULT TRUE,
  sss_gsis_no VARCHAR(20),
  sss_gsis_withheld BOOLEAN DEFAULT TRUE,
  phic_id VARCHAR(20),
  phic_withheld BOOLEAN DEFAULT TRUE,
  hdmf_id VARCHAR(20),
  hdmf_withheld BOOLEAN DEFAULT TRUE,
  hdmf_account VARCHAR(20),
  bank_id INT,
  bank_account VARCHAR(50),
  pay_frequency_id INT,
  rate_type_id INT,
  base_monthly_pay DECIMAL(12,2) DEFAULT 0,
  days_per_month DECIMAL(5,2) DEFAULT 22,
  hours_per_day DECIMAL(5,2) DEFAULT 8,
  daily_rate DECIMAL(12,2) DEFAULT 0,
  hourly_rate DECIMAL(12,2) DEFAULT 0,
  cola DECIMAL(12,2) DEFAULT 0,
  representation_allowance DECIMAL(12,2) DEFAULT 0,
  housing_allowance DECIMAL(12,2) DEFAULT 0,
  transportation_allowance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (position_id) REFERENCES positions(id),
  FOREIGN KEY (employment_type_id) REFERENCES employment_types(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (bank_id) REFERENCES banks(id),
  FOREIGN KEY (pay_frequency_id) REFERENCES pay_frequencies(id),
  FOREIGN KEY (rate_type_id) REFERENCES rate_types(id)
);

-- Loans Table
CREATE TABLE IF NOT EXISTS loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_account_id VARCHAR(20) NOT NULL UNIQUE,
  employee_id INT NOT NULL,
  loan_type_id INT NOT NULL,
  issue_date DATE NOT NULL,
  start_date DATE NOT NULL,
  principal DECIMAL(12,2) NOT NULL,
  interest DECIMAL(12,2) DEFAULT 0,
  loan_amount DECIMAL(12,2) GENERATED ALWAYS AS (principal + interest) STORED,
  months_to_pay INT NOT NULL,
  monthly_payment DECIMAL(12,2) NOT NULL,
  running_balance DECIMAL(12,2) NOT NULL,
  deduction_start_date DATE,
  deduct_per_pay DECIMAL(12,2) DEFAULT 0,
  pay_frequency_id INT,
  loan_reference VARCHAR(50),
  particulars TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (loan_type_id) REFERENCES loan_types(id),
  FOREIGN KEY (pay_frequency_id) REFERENCES pay_frequencies(id)
);

-- Loan Payments Table
CREATE TABLE IF NOT EXISTS loan_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT NOT NULL,
  payment_date DATE NOT NULL,
  amount_paid DECIMAL(12,2) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  ip_address VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES loans(id)
);

-- Insert Initial Data

-- Departments
INSERT IGNORE INTO departments (code_id, name, description) VALUES
('HR', 'Human Resources', 'Human Resources Department'),
('IT', 'Information Technology', 'IT Department'),
('FIN', 'Finance', 'Finance Department'),
('OPS', 'Operations', 'Operations Department');

-- Projects
INSERT IGNORE INTO projects (name, description) VALUES
('ERP Implementation', 'Enterprise Resource Planning System Implementation'),
('Website Redesign', 'Company Website Redesign Project'),
('Mobile App Development', 'Company Mobile App Development');

-- Teams
INSERT IGNORE INTO teams (name, department_id, project_id) VALUES
('HR Team', 1, NULL),
('IT Development', 2, 1),
('IT Support', 2, NULL),
('Finance Team', 3, NULL);

-- Positions
INSERT IGNORE INTO positions (title, description) VALUES
('HR Manager', 'Human Resources Manager'),
('HR Specialist', 'Human Resources Specialist'),
('Software Developer', 'Software Developer'),
('System Administrator', 'System Administrator'),
('Accountant', 'Accountant'),
('Finance Manager', 'Finance Manager');

-- Employment Types
INSERT IGNORE INTO employment_types (name, description) VALUES
('Regular', 'Regular full-time employee'),
('Probationary', 'Probationary employee'),
('Contractual', 'Contractual employee'),
('Project-based', 'Project-based employee');

-- Vendors
INSERT IGNORE INTO vendors (name, contact_person, contact_number, email) VALUES
('ABC Staffing Solutions', 'John Doe', '+123456789', 'john@abcstaffing.com'),
('XYZ Outsourcing', 'Jane Smith', '+987654321', 'jane@xyzoutsourcing.com');

-- Banks
INSERT IGNORE INTO banks (name, code) VALUES
('BDO', 'BDO'),
('BPI', 'BPI'),
('Metrobank', 'MBTC'),
('Landbank', 'LBP');

-- Pay Frequencies
INSERT IGNORE INTO pay_frequencies (name, days_interval) VALUES
('Monthly', 30),
('Semi-monthly', 15),
('Weekly', 7),
('Bi-weekly', 14);

-- Rate Types
INSERT IGNORE INTO rate_types (name, description) VALUES
('Monthly', 'Monthly rate'),
('Daily', 'Daily rate'),
('Hourly', 'Hourly rate');

-- Loan Types
INSERT IGNORE INTO loan_types (name, description, default_interest_rate, default_term_months) VALUES
('SSS Loan', 'Social Security System Loan', 10.00, 24),
('Pag-IBIG Loan', 'Pag-IBIG Housing Development Fund Loan', 11.50, 36),
('Calamity Loan', 'Calamity Assistance Loan', 5.00, 12),
('Salary Loan', 'Salary Loan', 12.00, 12);

-- Sample Employee
INSERT IGNORE INTO employees (
  empl_id, first_name, middle_name, last_name, suffix,
  address, city, province, zip, location,
  email, phone_no, birthday, sex, active,
  department_id, position_id, employment_type_id, date_hired,
  tax_id, sss_gsis_no, phic_id, hdmf_id,
  bank_id, bank_account, pay_frequency_id, rate_type_id,
  base_monthly_pay, daily_rate, hourly_rate
) VALUES (
  'EMP001', 'Juan', 'Dela', 'Cruz', 'Jr.',
  '123 Main St.', 'Makati', 'Metro Manila', '1200', 'HQ',
  'juan@example.com', '+639123456789', '1990-01-15', 'Male', TRUE,
  1, 2, 1, '2022-01-10',
  '123-456-789-000', '01-2345678-9', '12-345678901-2', '1234-5678-9012',
  1, '1234567890', 2, 1,
  25000.00, 1136.36, 142.05
);

-- Sample Loan
INSERT IGNORE INTO loans (
  loan_account_id, employee_id, loan_type_id, 
  issue_date, start_date, principal, interest,
  months_to_pay, monthly_payment, running_balance,
  deduction_start_date, deduct_per_pay, pay_frequency_id, loan_reference
) VALUES (
  'LOAN001', 1, 1,
  '2023-01-15', '2023-02-01', 50000.00, 5000.00,
  12, 4583.33, 55000.00,
  '2023-02-15', 2291.67, 2, 'SSS-123456789'
);

-- This table is required by the default index.js route
CREATE TABLE IF NOT EXISTS mysql_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO mysql_table (name, description) VALUES
('Sample Record 1', 'This is a sample record for testing'),
('Sample Record 2', 'Another sample record for testing');