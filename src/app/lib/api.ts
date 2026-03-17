import { supabase } from './supabase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    if (supabase) {
        const cleanPath = path.split('?')[0].replace(/^\//, '');
        
        const tableMap: Record<string, string> = {
            'users': 'users',
            'demandes': 'demandes',
            'adminStats': 'admin_stats',
            'chartData': 'chart_data',
            'dossiersByStatut': 'dossiers_statut',
            'conseillers': 'conseillers',
            'derniersPaiements': 'paiements',
            'profil': 'profil',
            'user_documents': 'user_documents',
            'userDocuments': 'user_documents'
        };

        const table = tableMap[cleanPath];

        if (table && (!options || options.method === 'GET' || !options.method)) {
            let query = supabase.from(table).select('*');
            
            if (path.includes('?')) {
                const params = new URLSearchParams(path.split('?')[1]);
                params.forEach((val, key) => {
                    if (key !== '_sort' && key !== '_order' && key !== '_limit') {
                        // Tolérer camelCase ou snake_case dans les filtres
                        const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
                        query = query.eq(snakeKey, val);
                    }
                });
                
                if (params.get('_sort')) {
                    const sortKey = (params.get('_sort') as string).replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
                    query = query.order(sortKey, { ascending: params.get('_order') !== 'desc' });
                }
                if (params.get('_limit')) {
                    query = query.limit(parseInt(params.get('_limit') as string));
                }
            }

            const { data, error } = await query;
            if (!error && data) {
                // Tables spéciales qui stockent leur contenu dans une colonne JSONB (data ou value)
                const specialTables = ['admin_stats', 'profil', 'stats_widget'];
                if (specialTables.includes(table)) {
                    if (data.length > 0) {
                        const item = data[0] as any;
                        let content = item.value !== undefined ? item.value : (item.data !== undefined ? item.data : item);
                        
                        // Fusionner les colonnes spécifiques pour profil (avatar_url, cover_url)
                        if (table === 'profil') {
                            content = {
                                ...content,
                                avatarUrl: item.avatar_url,
                                coverUrl: item.cover_url
                            };
                        }
                        
                        return toCamel(content) as T;
                    }
                    return null as unknown as T;
                }
                return toCamel(data) as unknown as T;
            }
        }
        
        if (table && options && (options.method === 'POST' || options.method === 'PUT')) {
            const body = toSnake(JSON.parse(options.body as string));
            let result;
            if (options.method === 'POST') {
                result = await supabase.from(table).insert(body).select();
            } else {
                const { id, ...updateData } = body;
                result = await supabase.from(table).update(updateData).eq('id', id).select();
            }
            if (!result.error && result.data) return toCamel(result.data[0]) as T;
        }
    }

    // Fallback original vers JSON Server
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}
