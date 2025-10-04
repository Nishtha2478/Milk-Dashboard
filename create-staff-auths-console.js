// create-staff-auths-console.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

async function createStaffAuths() {
  try {
    // Fetch all staff from profiles table
    const { data: staffList, error } = await supabase.from('profiles').select('user_act');

    if (error) throw error;

    for (const staff of staffList) {
      const tempEmail = `${staff.user_act}@milk.local`;
      const tempPassword = generatePassword();

      // Try to create a Supabase auth user
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email: tempEmail,
        password: tempPassword,
        email_confirm: true
      });

      if (authError) {
        console.log(`⚠️ Could not create user ${tempEmail}:`, authError.message);
      } else {
        console.log(`✅ Created user for ${staff.user_act}`);
        console.log(`   Email: ${tempEmail}`);
        console.log(`   Password: ${tempPassword}`);
        console.log('---------------------------');
      }
    }
  } catch (err) {
    console.error('Error creating staff auths:', err);
  }
}

createStaffAuths();
