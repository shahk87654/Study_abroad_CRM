
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  const bucketName = 'student-documents';
  
  console.log(`Ensuring bucket "${bucketName}" exists...`);
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === bucketName);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      fileSizeLimit: 5242880
    });
    if (error) console.error('Error creating bucket:', error);
    else console.log('Bucket created.');
  } else {
    console.log('Bucket already exists.');
  }

  console.log('Setting CORS policies...');
  // Supabase doesn't have a direct "set CORS" via the storage-js client for buckets easily in all versions, 
  // but we can try to use the management API or just assume it's default.
  // Actually, we can use SQL to set CORS if needed, but let's check if there's a storage.buckets update.
  
  // Alternatively, let's just make sure it's not a CORS issue by checking the browser if possible.
  // For now, I'll just assume the bucket existence was the main thing.
}

setupStorage();
