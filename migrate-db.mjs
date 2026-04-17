import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsdeujkgbmmdknxqtzeg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZGV1amtnYm1tZGtueHF0emVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ1MzkwNCwiZXhwIjoyMDkxMDI5OTA0fQ.1vQOxjRxpN15CJP9uc-SwJVPDqHoawDG_P7QtDDCYxg';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const sql = `
-- 1. Create UserStatus Enum
DO $$ BEGIN
    CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update User Table
ALTER TABLE public."User" 
ADD COLUMN IF NOT EXISTS "status" "UserStatus" DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "specialization" TEXT,
ADD COLUMN IF NOT EXISTS "documents" JSONB DEFAULT '[]';

-- Update existing users to APPROVED
UPDATE public."User" SET "status" = 'APPROVED' WHERE "status" IS NULL;

-- 2.1 Update DoctorProfile Table with new fields
ALTER TABLE public."DoctorProfile"
ADD COLUMN IF NOT EXISTS "languages" TEXT[] DEFAULT '{Arabic, English}',
ADD COLUMN IF NOT EXISTS "has_american_board" BOOLEAN DEFAULT FALSE;

-- 3. Create Invitations Table
CREATE TABLE IF NOT EXISTS public."Invitations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "role" public."Role" DEFAULT 'DOCTOR',
  "specialization" TEXT,
  "token" TEXT UNIQUE NOT NULL,
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "is_used" BOOLEAN DEFAULT FALSE,
  "created_by" UUID,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Storage Bucket
-- (Note: Storage bucket creation is usually via API, but we'll try to insert into storage.buckets if permissions allow)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctor-documents', 'doctor-documents', false)
ON CONFLICT (id) DO NOTHING;
`;

async function migrate() {
    console.log("Applying database migration...");
    // We try to use a dummy RPC or execute directly if we had a Postgres connection
    // But since we only have Service Role, we'll suggest the user to run this SQL
    // OR try to see if there's an 'exec' RPC.
    
    // For now, I'll provide this SQL for the user to run, as it's the safest 'Permanent Solution'
    // for DDL changes.
    console.log("SQL Migration script ready.");
}

migrate();
console.log(sql);
