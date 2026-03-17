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
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkProfil() {
  const { data, error } = await supabase.from('profil').select('*').limit(1);
  if (error) {
    console.error('Erreur:', error.message);
  } else {
    console.log('--- Structure de la table profil ---');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('---------------------------------');
  }
}

checkProfil();
