import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Trash2, ArrowLeft, Loader2, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { formatPhone, formatCurrency } from '../utils/format';
import { SERVICES } from '../utils/constants';
import { toast } from 'sonner';

export function MyAppointments() {
    const [phone, setPhone] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searched, setSearched] = useState(false);
    const { getAppointmentsByPhone, cancelAppointment, loading } = useAppointments();
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!phone || phone.length < 14) return;
        const data = await getAppointmentsByPhone(phone);
        setAppointments(data);
        setSearched(true);
    };

    const handleCancel = async (id: string, dateStr: string) => {
        if (confirm(`Tem certeza que deseja cancelar o agendamento de ${format(new Date(dateStr), 'dd/MM HH:mm')}?`)) {
            try {
                await cancelAppointment(id);
                setAppointments(prev => prev.filter(a => a.id !== id));
                toast.success("Agendamento cancelado com sucesso!");
            } catch (error) {
                toast.error("Erro ao cancelar.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 p-4 md:p-8">
                <div className="max-w-2xl mx-auto py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => navigate('/')}
                            className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                            Voltar ao Início
                        </motion.button>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    Meus Agendamentos
                                </h1>
                                <p className="text-slate-400 text-sm">Consulte e gerencie seus horários</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-strong p-6 rounded-2xl border border-primary/10 shadow-2xl mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Search className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-white">Buscar Agendamentos</h2>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Digite seu WhatsApp para ver seus horários agendados.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <Input
                                    placeholder="(87) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className="bg-slate-800/80 border-slate-700/50 h-12 input-animated"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    onClick={handleSearch} 
                                    disabled={loading || phone.length < 14} 
                                    className="px-8 h-12 bg-gradient-to-r from-primary to-yellow-300 text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        <Search className="w-5 h-5" />
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Results Section */}
                    <AnimatePresence mode="wait">
                        {appointments.length > 0 && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Seus Horários
                                    </h3>
                                    <span className="text-sm text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        {appointments.length} agendamento{appointments.length > 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {appointments.map((appt, index) => {
                                        const service = SERVICES.find(s => s.id === appt.service_id);
                                        return (
                                            <motion.div
                                                key={appt.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="glass-strong p-5 rounded-2xl border border-slate-700/50 hover:border-primary/30 transition-all shadow-xl group"
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                                                <Calendar className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-lg text-white">
                                                                    {format(new Date(appt.date), 'dd/MM')}
                                                                </span>
                                                                <span className="text-primary font-semibold ml-2">
                                                                    {format(new Date(appt.date), 'HH:mm')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2 pl-15">
                                                            <p className="text-white font-semibold flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                                {service?.name || 'Serviço'}
                                                            </p>
                                                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                                                <DollarSign className="w-4 h-4 text-primary" />
                                                                {formatCurrency(service?.price || 0)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => appt.id && handleCancel(appt.id, appt.date)}
                                                        className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                        <span className="text-sm font-medium hidden sm:inline">Cancelar</span>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {searched && appointments.length === 0 && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-16 glass-strong rounded-2xl border border-slate-700/30"
                            >
                                <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Nenhum Agendamento Encontrado
                                </h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    Não encontramos agendamentos futuros para este número. 
                                    Que tal agendar um horário agora?
                                </p>
                                <motion.div
                                    className="mt-6"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => navigate('/')}
                                        className="bg-gradient-to-r from-primary to-yellow-300 text-slate-900 font-bold px-8 h-12 rounded-xl"
                                    >
                                        Agendar Agora
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
