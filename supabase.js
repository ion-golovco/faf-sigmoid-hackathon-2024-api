const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjrdkedwvpctmwkiboso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcmRrZWR3dnBjdG13a2lib3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0NDMwNzUsImV4cCI6MjAzNDAxOTA3NX0.wVQfele2bUs2Bb-MVswOgl-TLRPU1MKkcd_oKQ3N4EE';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;