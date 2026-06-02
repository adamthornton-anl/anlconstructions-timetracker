CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  full_name TEXT,
  tfn TEXT,
  super_deduction DECIMAL(10,2) DEFAULT 323.04,
  tax_deduction DECIMAL(10,2) DEFAULT 692.00,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  week_offset INT DEFAULT 0,
  start_time TEXT,
  end_time TEXT,
  lunch_mins INT DEFAULT 0,
  job TEXT,
  notes TEXT,
  materials TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_time_entries_user_week ON time_entries(user_id, week_offset, day);

INSERT INTO users (name, pin, hourly_rate, full_name, tfn, super_deduction, tax_deduction) VALUES
('Adam', '7264', 81.49, 'Adam Conan Thornton', '394 424 934', 323.04, 692.00),
('James', '5891', 48.65, 'James', '', 216.00, 400.00),
('Brady', '3742', 29.95, 'Brady', '', 132.96, 178.00),
('Drew', '8159', 81.49, 'Drew', '', 323.04, 692.00);
