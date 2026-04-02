import { supabase } from './supabase';

// Helper pour convertir snake_case en camelCase
function toCamel(obj: any): any {
    if (Array.isArray(obj)) return obj.map(toCamel);
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key) => {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = toCamel(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

// Helper pour convertir camelCase en snake_case (pour les insertions)
function toSnake(obj: any): any {
    if (Array.isArray(obj)) return obj.map(toSnake);
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key) => {
            const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            acc[snakeKey] = toSnake(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

export interface ApiOptions extends RequestInit {
    background?: boolean;
}

export async function apiFetch<T>(path: string, options?: ApiOptions): Promise<T> {
    if (!supabase) {
        throw new Error('Supabase client not initialized. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    }

    // Support for /table/id structure
    let urlPath = path.split('?')[0].replace(/^\//, '');
    let recordId: string | null = null;
    const pathParts = urlPath.split('/');
    if (pathParts.length > 1) {
        urlPath = pathParts[0];
        recordId = pathParts[1];
    }

    // Mapping logique des routes vers les vraies tables Supabase
    const tableMap: Record<string, string> = {
        'users':             'users',
        'profiles':          'profiles',
        'profil':            'profiles',
        'clients':           'profiles',
        'demandes':          'demandes',
        'adminStats':        'admin_stats',
        'admin_stats':       'admin_stats',
        'chartData':         'chart_data',
        'chart_data':        'chart_data',
        'dossiersByStatut':  'dossiers_statut',
        'dossiers_statut':   'dossiers_statut',
        'conseillers':       'conseillers',
        'conseiller':        'conseillers',
        'conseillers_full':  'conseillers',
        'derniersPaiements': 'paiements',
        'transactions':      'paiements',
        'paiements':         'paiements',
        'user_documents':    'user_documents',
        'userDocuments':     'user_documents',
        'quickStats':        'quick_stats',
        'quick_stats':       'quick_stats',
        'timeline':          'timeline',
        'dossierSteps':      'timeline',
        'deadlines':         'deadlines',
        'messages':          'messages',
        'conversations':     'conversations',
        'notifications':     'notifications',
        'dossiers':          'demandes',  // Alias : dossiers → demandes (même concept)
    };

    // Auto-fallback: utilise le nom de route converti en snake_case
    const table = tableMap[urlPath] || urlPath.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);

    // ── GET ──────────────────────────────────────────────────────────────────
    if (!options || options.method === 'GET' || !options.method) {
        let query: any = supabase.from(table).select('*');

        if (recordId) {
            // admin_stats utilise une clé TEXT (pas UUID)
            if (table === 'admin_stats') {
                query = query.eq('key', recordId);
            } else {
                query = query.eq('id', recordId);
            }
        }

        if (path.includes('?')) {
            const params = new URLSearchParams(path.split('?')[1]);
            params.forEach((val, key) => {
                if (key === '_sort' || key === '_order' || key === '_limit') return;
                const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
                query = query.eq(snakeKey, val);
            });

            const sortKey = params.get('_sort');
            if (sortKey) {
                const snakeSortKey = sortKey.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
                query = query.order(snakeSortKey, { ascending: params.get('_order') !== 'desc' });
            }
            const limit = params.get('_limit');
            if (limit) {
                query = query.limit(parseInt(limit));
            }
        }

        const { data, error } = await query;

        // Gestion propre des erreurs RLS / tables vides
        if (error) {
            if (error.code === 'PGRST116') return null as unknown as T; // no rows
            if (error.code === '42501') {
                console.warn(`[RLS] Accès refusé sur ${table}:`, error.message);
                return (Array.isArray(data) ? [] : null) as unknown as T;
            }
            throw error;
        }

        if (!data) return ([] as unknown) as T;

        // Record unique demandé
        if (recordId && Array.isArray(data) && data.length > 0) {
            return toCamel(data[0]) as T;
        }

        // Tables admin_stats : extraire la valeur JSONB
        if (table === 'admin_stats' && Array.isArray(data) && data.length > 0) {
            const item = data[0] as any;
            const content = item.value !== undefined ? item.value : item;
            return toCamel(content) as T;
        }

        return toCamel(data) as unknown as T;
    }

    // ── POST / PUT / PATCH / DELETE ──────────────────────────────────────────
    const method = options?.method || 'GET';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const body = options?.body ? toSnake(JSON.parse(options.body as string)) : {};
        let result;

        if (method === 'POST') {
            // Pour les insertions, on n'utilise pas .select() par défaut car cela peut échouer 
            // si l'utilisateur a le droit d'insérer mais pas de lire (RLS).
            result = await supabase.from(table).insert(body);
            
            if (result.error) {
                console.error(`[API Error] POST ${table}:`, result.error);
                if (result.error.code === '42501') {
                    throw new Error(`Accès refusé. Vérifiez vos permissions sur la table ${table}.`);
                }
                throw result.error;
            }
            return body as T; // On retourne le corps envoyé par défaut en cas de succès
        } else if (method === 'DELETE') {
            const deleteId = recordId || new URLSearchParams(path.split('?')[1] || '').get('id');
            if (!deleteId) throw new Error('ID required for DELETE request');
            result = await supabase.from(table).delete().eq('id', deleteId);
            return {} as T;
        } else {
            // PUT or PATCH
            const { id, ...updateData } = body;
            const targetId = recordId || id || new URLSearchParams(path.split('?')[1] || '').get('id');
            if (!targetId) throw new Error('ID required for UPDATE request');
            result = await supabase.from(table).update(updateData).eq('id', targetId).select();
        }

        if (result.error) {
            if (result.error.code === '42501') {
                console.warn(`[RLS] Accès refusé pour ${method} sur ${table}`);
                throw new Error(`Accès refusé. Vérifiez que vous êtes connecté.`);
            }
            throw result.error;
        }
        if (result.data && result.data.length > 0) return toCamel(result.data[0]) as T;
        return {} as T;
    }

    throw new Error(`Unsupported request: ${method} to ${path}`);
}
