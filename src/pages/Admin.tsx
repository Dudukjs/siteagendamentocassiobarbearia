import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { format, isToday, parseISO, isFuture } from 'date-fns';
import { SERVICES } from '../utils/constants';
import { Trash2, Calendar, DollarSign, LogOut, Lock, Search, TrendingUp, Users, Scissors, Phone, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import { toast } from 'sonner';

export function Admin() {
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
            .order('date', { ascending: true })
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

    // Filter appointments by search term
    const filteredAppointments = useMemo(() => {
        if (!searchTerm) return appointments;
        const term = searchTerm.toLowerCase();
        return appointments.filter(appt => 
            appt.name.toLowerCase().includes(term) ||
            appt.phone.includes(term)
        );
    }, [appointments, searchTerm]);

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
            totalExposedRevenue: calcRevenue(appointments)
        };
    }, [appointments]);


    if (!auth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 p-8 bg-slate-800/90 backdrop-blur-xl rounded-3xl space-y-6 w-full max-w-sm border border-slate-700/50 shadow-2xl"
                >
                    <div className="flex justify-center mb-6">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg"
                        >
                            <Lock className="w-10 h-10 text-primary" />
                        </motion.div>
                    </div>
                    <h1 className="text-white text-2xl font-bold text-center">Área Restrita</h1>
                    <p className="text-slate-400 text-sm text-center">Painel administrativo da barbearia</p>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-600 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-600"
                            placeholder="Digite a senha de acesso"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            className="w-full py-4 bg-gradient-to-r from-primary to-yellow-300 hover:from-yellow-300 hover:to-primary text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
                        >
                            Acessar Painel
                        </motion.button>
                    </div>
                    <p className="text-xs text-slate-500 text-center pt-4 border-t border-slate-700/50">
                        Acesso exclusivo para administração
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* HEAD & LOGOUT */}
                    <motion.header 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="w-3 h-10 bg-gradient-to-b from-primary to-yellow-300 rounded-full"></div>
                                Painel Cassio Barbearia
                            </h1>
                            <p className="text-slate-400 mt-1">Gestão completa de agendamentos</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 px-5 py-3 rounded-xl transition-all border border-red-500/20"
                        >
                            <LogOut className="w-4 h-4" /> Sair
                        </motion.button>
                    </motion.header>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card 1: Hoje */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-slate-800/70 backdrop-blur p-6 rounded-2xl border border-slate-700/50 hover:border-primary/40 transition-all shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar className="w-24 h-24 text-primary" />
                            </div>
                            <p className="text-slate-400 mb-2 font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" /> Hoje
                            </p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-white">{stats.todayCount}</span>
                                <span className="text-slate-500 mb-1">clientes</span>
                            </div>
                            <p className="text-primary font-bold mt-3 text-lg">
                                {formatCurrency(stats.todayRevenue)} <span className="text-xs font-normal text-slate-400">estimados</span>
                            </p>
                        </motion.div>

                        {/* Card 2: Total Lista */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-slate-800/70 backdrop-blur p-6 rounded-2xl border border-slate-700/50 hover:border-primary/40 transition-all shadow-xl"
                        >
                            <p className="text-slate-400 mb-2 font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" /> Na Agenda
                            </p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-white">{stats.totalCount}</span>
                                <span className="text-slate-500 mb-1">agendamentos</span>
                            </div>
                            <p className="text-emerald-400 font-bold mt-3 text-lg">
                                {formatCurrency(stats.totalExposedRevenue)} <span className="text-xs font-normal text-slate-400">em caixa futuro</span>
                            </p>
                        </motion.div>

                        {/* Card 3: Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="bg-gradient-to-br from-primary/20 to-slate-800/70 backdrop-blur p-6 rounded-2xl border border-primary/30 flex flex-col justify-center items-center text-center shadow-xl"
                        >
                            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 text-green-400">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-white">Sistema Operante</p>
                            <p className="text-xs text-slate-400 mt-1">Sincronizado com Supabase</p>
                        </motion.div>
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nome ou telefone..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500"
                        />
                    </motion.div>

                    {/* LIST */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-800/70 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Agenda
                            </h2>
                            <span className="text-xs text-slate-500 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                                Mostrando {filteredAppointments.length} de {appointments.length}
                            </span>
                        </div>

                        <div className="divide-y divide-white/5">
                            {appointments.length === 0 ? (
                                <div className="p-16 text-center">
                                    {loadingData ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span className="text-slate-400">Carregando agendamentos...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center">
                                                <Calendar className="w-10 h-10 text-slate-500" />
                                            </div>
                                            <span className="text-slate-400">Nenhum agendamento encontrado.</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                filteredAppointments.map((appt, idx) => {
                                    const serviceName = SERVICES.find(s => s.id === appt.service_id)?.name || 'Desconhecido';
                                    const price = SERVICES.find(s => s.id === appt.service_id)?.price || 0;
                                    const dateObj = parseISO(appt.date);
                                    const isItemToday = isToday(dateObj);

                                    return (
                                        <motion.div
                                            key={appt.id || idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ x: 4 }}
                                            className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-700/30 transition-all ${isItemToday ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-center bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 min-w-[70px]">
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
                                                    <p className="text-sm text-slate-500 font-mono bg-slate-900/50 inline-block px-2 py-1 rounded">
                                                        {formatCurrency(price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                <a
                                                    href={`https://wa.me/${appt.phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 text-green-400 hover:text-white hover:bg-green-600 transition-all bg-green-500/10 px-4 py-2.5 rounded-xl text-sm font-medium border border-green-500/20 hover:border-green-500/40"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    WhatsApp
                                                </a>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDelete(appt.id!, appt.date)}
                                                    className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-600 transition-all bg-red-500/10 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/20 hover:border-red-500/40"
                                                    title="Excluir Agendamento e Liberar Horário"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Cancelar
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
