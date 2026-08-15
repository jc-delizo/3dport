// 'Payroll Implementation — 1,600 Employees' → 'payroll-implementation-1-600-employees'
export const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
