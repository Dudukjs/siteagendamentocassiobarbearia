
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { format, isToday, parseISO, isFuture } from 'date-fns';
import { SERVICES } from '../utils/constants';
import { Trash2, Calendar, DollarSign, LogOut, Lock, Search, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { toast } from 'sonner';

export function Admin() {
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Simple Session Persistence
    useEffect(() => {
        const session = sessionStorage.getItem('admin_session');
        if (session === 'true') setAuth(true);
    }, []);

    const { cancelAppointment, loading } = useAppointments();

    const fetchAppointments = async () => {
        if (!auth) return;
        setLoadingData(true);
        const { data } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: true }) // Show upcoming first
            .limit(100);

        if (data) setAppointments(data as Appointment[]);
        setLoadingData(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [auth]);

    const handleLogin = () => {
        if (pass === 'Cassia2009@') {
            setAuth(true);
            sessionStorage.setItem('admin_session', 'true');
            toast.success("Bem-vindo, Cassio!");
        } else {
            toast.error("Senha incorreta");
        }
    };

    const handleLogout = () => {
        setAuth(false);
        setPass('');
        sessionStorage.removeItem('admin_session');
    };

    const handleDelete = async (id: string, dateStr: string) => {
        if (confirm(`ATENÇÃO: Isso excluirá o agendamento e liberará o horário para outros clientes.\n\nDeseja cancelar o corte de ${format(new Date(dateStr), 'dd/MM HH:mm')}?`)) {
            try {
                await cancelAppointment(id);
                setAppointments(prev => prev.filter(appt => appt.id !== id));
                toast.success("Agendamento excluído e horário liberado!");
            } catch (e) {
                toast.error("Erro ao excluir.");
            }
        }
    }

    // --- DASHBOARD STATS ---
    const stats = useMemo(() => {
        const today = new Date();
        const todaysAppts = appointments.filter(a => isToday(parseISO(a.date)));
        const futureAppts = appointments.filter(a => isFuture(parseISO(a.date)));

        const calcRevenue = (list: Appointment[]) => {
            return list.reduce((acc, curr) => {
                const service = SERVICES.find(s => s.id === curr.service_id);
                return acc + (service?.price || 0);
            }, 0);
        };

        return {
            todayCount: todaysAppts.length,
            todayRevenue: calcRevenue(todaysAppts),
            totalCount: appointments.length,
            totalExposedRevenue: calcRevenue(appointments) // Revenue from currently visible appointments
        };
    }, [appointments]);


    if (!auth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
                <div className="p-8 bg-slate-800 rounded-2xl space-y-6 w-full max-w-sm border border-slate-700 shadow-2xl">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-white text-2xl font-bold text-center">Área Restrita</h1>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                            placeholder="Digite a senha de acesso"
                        />
                        <button
                            onClick={handleLogin}
                            className="w-full py-4 bg-primary hover:bg-yellow-400 text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                        >
                            Acessar Painel
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 text-center pt-4 border-t border-slate-700/50">
                        Acesso exclusivo para administração
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEAD & LOGOUT */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-3 h-8 bg-primary rounded-full"></div>
                            Painel Cassio Barbearia
                        </h1>
                        <p className="text-slate-400 mt-1">Gestão completa de agendamentos</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200 bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sair
                    </button>
                </header>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Hoje */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-primary/30 transition-colors shadow-lg relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar className="w-24 h-24 text-primary" />
                        </div>
                        <p className="text-slate-400 mb-1 font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Hoje
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-white">{stats.todayCount}</span>
                            <span className="text-slate-500 mb-1">clientes</span>
                        </div>
                        <p className="text-primary font-bold mt-2 text-lg">
                            {formatCurrency(stats.todayRevenue)} <span className="text-xs font-normal text-slate-400">estimados</span>
                        </p>
                    </div>

                    {/* Card 2: Total Lista */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-primary/30 transition-colors shadow-lg">
                        <p className="text-slate-400 mb-1 font-medium flex items-center gap-2">
                            <Users className="w-4 h-4" /> Na Agenda
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-white">{stats.totalCount}</span>
                            <span className="text-slate-500 mb-1">agendamentos</span>
                        </div>
                        <p className="text-emerald-400 font-bold mt-2 text-lg">
                            {formatCurrency(stats.totalExposedRevenue)} <span className="text-xs font-normal text-slate-400">em caixa futuro</span>
                        </p>
                    </div>
                    {/* Card 3: Status */}
                    <div className="bg-gradient-to-br from-primary/20 to-slate-800 p-6 rounded-2xl border border-primary/20 flex flex-col justify-center items-center text-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 text-green-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-white">Sistema Operante</p>
                        <p className="text-xs text-slate-400 mt-1">Sincronizado com Supabase</p>
                    </div>
                </div>

                {/* LIST */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Agenda
                        </h2>
                        <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                            Mostrando últimos 100
                        </span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {appointments.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                {loadingData ? (
                                    <span className="flex items-center justify-center gap-2"><div className="w-2 h-2 bg-primary animate-ping rounded-full" /> Carregando...</span>
                                ) : (
                                    "Nenhum agendamento encontrado."
                                )}
                            </div>
                        ) : (
                            appointments.map((appt, idx) => {
                                const serviceName = SERVICES.find(s => s.id === appt.service_id)?.name || 'Desconhecido';
                                const price = SERVICES.find(s => s.id === appt.service_id)?.price || 0;
                                const dateObj = parseISO(appt.date);
                                const isItemToday = isToday(dateObj);

                                return (
                                    <div
                                        key={appt.id || idx}
                                        className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-700/30 transition-colors ${isItemToday ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center justify-center bg-slate-900 p-3 rounded-xl border border-slate-700 min-w-[70px]">
                                                <span className="text-xs font-bold text-primary uppercase">{format(dateObj, 'MMM')}</span>
                                                <span className="text-2xl font-bold text-white">{format(dateObj, 'dd')}</span>
                                                <span className="text-[10px] text-slate-500">{format(dateObj, 'HH:mm')}</span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg text-white">{appt.name}</h3>
                                                    {isItemToday && <span className="bg-primary text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Hoje</span>}
                                                </div>
                                                <p className="text-slate-300 font-medium flex items-center gap-2">
                                                    <Scissors size={14} className="text-primary" /> {serviceName}
                                                </p>
                                                <p className="text-sm text-slate-500 font-mono bg-slate-900/50 inline-block px-2 rounded">
                                                    {formatCurrency(price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                            <a
                                                href={`https://wa.me/${appt.phone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 text-green-400 hover:text-white hover:bg-green-600 transition-all bg-green-500/10 px-4 py-2.5 rounded-xl text-sm font-medium"
                                            >
                                                WhatsApp
                                            </a>
                                            <button
                                                onClick={() => handleDelete(appt.id!, appt.date)}
                                                className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-600 transition-all bg-red-500/10 px-4 py-2.5 rounded-xl text-sm font-medium"
                                                title="Excluir Agendamento e Liberar Horário"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon helper
function Scissors({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    )
}
