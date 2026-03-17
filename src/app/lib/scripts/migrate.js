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

async function migrate() {
  console.log('🚀 Migration Exhaustive Vers Supabase...');

  try {
    const dbData = JSON.parse(fs.readFileSync(path.resolve('db.json'), 'utf8'));

    // 1. Users
    console.log('👥 Users...');
    for (const u of dbData.users || []) {
      const { id, firstName, lastName, ...rest } = u;
      await supabase.from('users').upsert({
        first_name: firstName,
        last_name: lastName,
        ...rest
      }, { onConflict: 'email' });
    }

    const { data: realUsers } = await supabase.from('users').select('id, email');
    const userMap = {};
    const adminUser = realUsers.find(u => u.email === 'admin@doxantu.com');
    const clientUser = realUsers.find(u => u.email === 'amadou.diallo@edu.sn') || realUsers.find(u => u.role === 'client');
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

    // 3. Admin Tables
    console.log('📊 Admin Stats...');
    if (dbData.adminStats) await supabase.from('admin_stats').upsert({ key: 'general_stats', value: dbData.adminStats }, { onConflict: 'key' });

    console.log('📈 Chart Data...');
    for (const c of dbData.chartData || []) await supabase.from('chart_data').insert({ mois: c.mois, valeur: c.valeur });

    console.log('📁 Dossiers Statut...');
    for (const s of dbData.dossiersByStatut || []) await supabase.from('dossiers_statut').insert({ statut: s.statut, count: s.count, color: s.color });

    console.log('👷 Conseillers...');
    for (const c of dbData.conseillers || []) await supabase.from('conseillers').insert({
      nom: c.nom,
      initiales: c.initiales,
      couleur: c.couleur,
      clients_count: c.clients
    });

    // 4. Client Tables (Mapped to ALL clients for demo purposes)
    const clientUsers = realUsers.filter(u => u.role === 'client');
    console.log(`🏠 Populating data for ${clientUsers.length} clients...`);
    
    for (const user of clientUsers) {
        const targetUserId = user.id;
        if (dbData.quickStats) {
            for (const q of dbData.quickStats) await supabase.from('quick_stats').insert({ label: q.label, value: q.value, category: q.category, user_id: targetUserId });
        }
        if (dbData.timeline) {
            for (const t of dbData.timeline) await supabase.from('timeline').insert({ title: t.title, date: t.date, status: t.status, user_id: targetUserId });
        }
        if (dbData.deadlines) {
            for (const d of dbData.deadlines) await supabase.from('deadlines').insert({ title: d.title, date: d.date, days_remaining: d.daysRemaining, color_class: d.colorClass, user_id: targetUserId });
        }
        if (dbData.statsWidget) {
            await supabase.from('stats_widget').insert({ user_id: targetUserId, data: dbData.statsWidget });
        }
        if (dbData.profil) {
            await supabase.from('profil').upsert({ user_id: targetUserId, data: dbData.profil }, { onConflict: 'user_id' });
        }
    }

    console.log('✅ Migration Exhaustive Terminée !');
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

migrate();
