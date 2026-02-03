
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { type Appointment } from '../hooks/useAppointments';
import { format } from 'date-fns';
import { SERVICES } from '../utils/constants';

export function Admin() {
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (auth) {
            supabase.from('appointments')
                .select('*')
                .order('date', { ascending: true })
                .limit(50)
                .then(({ data }) => {
                    if (data) setAppointments(data as Appointment[]);
                });
        }
    }, [auth]);

    if (!auth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="p-6 bg-slate-800 rounded-xl space-y-4 w-full max-w-sm border border-slate-700">
                    <h1 className="text-white text-xl font-bold text-center">Admin Login</h1>
                    <input
                        type="password"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-primary focus:outline-none"
                        placeholder="Senha"
                    />
                    <button
                        onClick={() => pass === 'admin123' && setAuth(true)}
                        className="px-4 py-3 bg-primary hover:bg-primary-hover text-slate-900 rounded-lg w-full font-bold transition-colors"
                    >
                        Entrar
                    </button>
                    <p className="text-xs text-slate-500 text-center">Senha padrão: admin123</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Gestão de Agendamentos</h1>
                    <button onClick={() => setAuth(false)} className="text-sm text-slate-400 hover:text-white">Sair</button>
                </header>

                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <p className="text-slate-500 text-center py-10">Nenhum agendamento encontrado.</p>
                    ) : (
                        appointments.map((appt, idx) => {
                            const serviceName = SERVICES.find(s => s.id === appt.service_id)?.name || 'Desconhecido';
                            return (
                                <div key={appt.id || idx} className="bg-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-700/50 hover:border-primary/50 transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-white">{appt.name}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-xs text-slate-300">
                                                {format(new Date(appt.date), 'HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-primary font-medium">{serviceName}</p>
                                        <p className="text-sm text-slate-400">{format(new Date(appt.date), 'dd/MM/yyyy')}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right flex items-center gap-3">
                                        <a
                                            href={`https://wa.me/${appt.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-400/10 px-3 py-2 rounded-lg"
                                        >
                                            <span className="font-mono">{appt.phone}</span>
                                        </a>
                                        <button
                                            onClick={() => handleDelete(appt.id!)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Cancelar Agendamento"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
