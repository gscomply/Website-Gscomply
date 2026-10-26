/*
# Create enquiries table for contact form submissions

1. New Tables
- `enquiries`
- `id` (uuid, primary key)
- `full_name` (text, not null) - submitter's full name
- `email` (text, not null) - business email
- `company` (text, not null) - company name
- `country` (text, not null) - country of origin
- `message` (text, not null) - requirement/message
- `phone` (text, nullable) - optional phone number
- `job_title` (text, nullable) - optional job title
- `industry` (text, nullable) - optional industry
- `service_required` (text, nullable) - optional service from dropdown
- `consent` (boolean, not null default false) - consent checkbox
- `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `enquiries`.
- Allow anon + authenticated INSERT only (public contact form, no read access).
- No SELECT/UPDATE/DELETE policies - enquiries are managed server-side only.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  country text NOT NULL,
  message text NOT NULL,
  phone text,
  job_title text,
  industry text,
  service_required text,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Make sure the public roles may insert (some Supabase projects no longer grant this automatically)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE enquiries TO anon, authenticated;
GRANT ALL ON TABLE enquiries TO service_role;

-- Tell Supabase's API to pick up the new table immediately (fixes "table missing" right after creating it)
NOTIFY pgrst, 'reload schema';
