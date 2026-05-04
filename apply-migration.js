require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey);
  process.exit(1);
}

// Extract connection details from Supabase URL
const url = new URL(supabaseUrl);
const projectRef = url.hostname.split('.')[0]; // caltowezhhosslopwqks
const host = `db.${projectRef}.supabase.co`;
const database = 'postgres';
const user = 'postgres';
const password = serviceRoleKey;

console.log('Connecting to:', host, database);
console.log('Trying connection with extended timeout...');

const client = new Client({
  host,
  port: 5432,
  database,
  user,
  password,
  ssl: true,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000
});

async function applyMigration() {
  try {
    await client.connect();
    console.log('Connected to database');

    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '0001_global_grads_crm.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');

    await client.query(sql);

    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('\nTo apply migrations manually:');
    console.error('1. Go to https://app.supabase.com/project/' + projectRef);
    console.error('2. Navigate to SQL Editor');
    console.error('3. Create a new query and paste the contents of supabase/migrations/0001_global_grads_crm.sql');
    console.error('4. Execute the query');
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();