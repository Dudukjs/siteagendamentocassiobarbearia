
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-[#0f172a] text-white p-4">
            <div className="max-w-md mx-auto py-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Voltar ao Início
                </button>

                <h1 className="text-2xl font-bold mb-2">Meus Agendamentos</h1>
                <p className="text-slate-400 mb-8">Digite seu número para ver seus horários.</p>

                <div className="flex gap-2 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="(87) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={loading || phone.length < 14} className="px-6">
                        {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                    </Button>
                </div>

                <div className="space-y-4">
                    {appointments.length > 0 ? (
                        appointments.map((appt) => {
                            const service = SERVICES.find(s => s.id === appt.service_id);
                            return (
                                <div key={appt.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-primary/50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="font-bold text-lg">
                                                {format(new Date(appt.date), 'dd/MM')} - {format(new Date(appt.date), 'HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 font-medium">{service?.name || 'Corte'}</p>
                                        <p className="text-xs text-slate-500">{formatCurrency(service?.price || 0)}</p>
                                    </div>
                                    <button
                                        onClick={() => appt.id && handleCancel(appt.id, appt.date)}
                                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Cancelar"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })
                    ) : searched ? (
                        <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-slate-700/50 border-dashed">
                            <p className="text-slate-400">Nenhum agendamento futuro encontrado para este número.</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
