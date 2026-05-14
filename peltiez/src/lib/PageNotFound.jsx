import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-white/25">404</h1>
                        <div className="h-0.5 w-16 bg-emerald-500/40 mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-white/90">
                            Page introuvable
                        </h2>
                        <p className="text-white/60 leading-relaxed">
                            La page <span className="font-medium text-emerald-200/90">« {pageName || '/'} »</span> n’existe pas ou a été déplacée.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 rounded-lg border border-amber-500/30 bg-amber-950/30">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-amber-100">Note admin</p>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Route absente ou renommée — vérifier <code className="text-xs">App.jsx</code> et la carte du site.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            to="/carte-site"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white/90 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Carte du site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}