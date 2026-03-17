import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function getEnv() {
  const envPath = path.resolve('.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      env[key] = value;
    }
  });
  return env;
}

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
  console.log('🚀 Démarrage de la migration (v2)...');

  try {
    const dbPath = path.resolve('db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 1. Users
    console.log('👥 Users...');
    for (const u of dbData.users || []) {
      const { id, firstName, lastName, ...rest } = u;
      const { error } = await supabase.from('users').upsert({
        first_name: firstName,
        last_name: lastName,
        ...rest
      }, { onConflict: 'email' });
      if (error) console.error(`Error user ${u.email}:`, error.message);
    }

    const { data: realUsers } = await supabase.from('users').select('id, email');
    const userMap = {};
    realUsers?.forEach(u => userMap[u.email] = u.id);

    // 2. Demandes
    console.log('📝 Demandes...');
    for (const d of dbData.demandes || []) {
      const { id, userId, createdAt, ...rest } = d;
      const userEmail = dbData.users?.find(u => u.id === userId)?.email;
      await supabase.from('demandes').insert({
        user_id: userMap[userEmail] || null,
        created_at: createdAt,
        ...rest
      });
    }

    // 3. Stats
    console.log('📊 Stats...');
    if (dbData.adminStats) {
      await supabase.from('admin_stats').upsert({ key: 'general_stats', value: dbData.adminStats });
    }

    // 4. Chart
    console.log('📈 Chart...');
    for (const c of dbData.chartData || []) {
      const { id, ...rest } = c;
      await supabase.from('chart_data').insert(rest);
    }

    // 5. Statuts
    console.log('📁 Statuts...');
    for (const s of dbData.dossiersByStatut || []) {
      const { id, ...rest } = s;
      await supabase.from('dossiers_statut').insert(rest);
    }

    console.log('✅ Migration terminée !');
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

migrate();
