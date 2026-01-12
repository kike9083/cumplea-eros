import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Palmtree, Lock, Mail, Loader, Play } from 'lucide-react';

interface LoginProps {
    onGuestMode: () => void;
}

const Login: React.FC<LoginProps> = ({ onGuestMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-tropical-teal via-blue-900 to-blue-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-700">
                <div className="p-8 pb-4 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-tropical-teal to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-12 hover:rotate-0 transition-transform duration-500">
                        <Palmtree className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">AlohaFunds</h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium italic">Tu paraíso administrativo</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 pt-4 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold rounded-r-xl animate-in shake duration-500">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Correo Administrador</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                                placeholder="tesorero@aloha.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-tropical-sea text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Entrar al Paraíso'}
                    </button>

                    <div className="relative py-4 flex items-center">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">o</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <button
                        type="button"
                        onClick={onGuestMode}
                        className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex justify-center items-center border border-gray-100"
                    >
                        <Play className="w-4 h-4 mr-2" /> Modo Invitado (Vista)
                    </button>
                </form>

                <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">© 2026 AlohaFunds Team • Advanced Agentic Coding</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
