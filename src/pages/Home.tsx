
import { useState, useEffect, useMemo } from 'react';
import { format, addMinutes, isBefore, startOfToday, parseISO } from 'date-fns';
import { Calendar, Scissors, User, CheckCircle, Loader2, Instagram, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { clsx } from 'clsx';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { AiConsultant } from '../components/AiConsultant';

import { SERVICES, type Service, BARBERSHOP_PHONE } from '../utils/constants';
import { generateTimeSlots, isWorkDay, formatTime, formatDate } from '../utils/date';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { formatPhone, formatCurrency } from '../utils/format';

export function Home() {
    const [step, setStep] = useState(0); // 0 = Hero, 1 = Services, 2 = Date, 3 = Info, 4 = Success
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const { getAppointmentsByDate, createAppointment, loading } = useAppointments();

    // Load appointments when date changes
    useEffect(() => {
        if (selectedDate && step === 2) {
            getAppointmentsByDate(selectedDate).then(setAppointments);
        }
    }, [selectedDate, step]);

    const availableSlots = useMemo(() => {
        if (!selectedService || !selectedDate) return [];

        const allSlots = generateTimeSlots(selectedDate);
        const now = new Date();

        return allSlots.filter((slot) => {
            // Filter past times if today
            if (isBefore(slot, now)) return false;

            const slotEnd = addMinutes(slot, selectedService.duration);

            // Check overlap with existing appointments
            const hasOverlap = appointments.some((appt) => {
                const apptStart = parseISO(appt.date);
                const apptService = SERVICES.find(s => s.id === appt.service_id);
                const apptDuration = apptService ? apptService.duration : 30;
                const apptEnd = addMinutes(apptStart, apptDuration);

                return (slot < apptEnd && slotEnd > apptStart);
            });

            return !hasOverlap;
        });
    }, [selectedDate, selectedService, appointments]);

    const handleBooking = async () => {
        if (!selectedService || !selectedTime || !name || !phone) return;

        try {
            const apptData = {
                name,
                phone,
                service_id: selectedService.id,
                date: selectedTime.toISOString(),
            };

            await createAppointment(apptData);

            // WhatsApp Redirect
            const message = `Olá Cassio, agendei um ${selectedService.name} para ${formatDate(selectedTime)} às ${formatTime(selectedTime)} - Nome: ${name}`;
            const url = `https://wa.me/${BARBERSHOP_PHONE}?text=${encodeURIComponent(message)}`;

            // Show toast before redirect
            toast.success("Agendamento realizado! Redirecionando para WhatsApp...");

            setTimeout(() => {
                window.open(url, '_blank');
                setStep(4);
            }, 1000);

        } catch (error) {
            toast.error('Erro ao agendar. Tente novamente.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Toaster position="top-center" richColors theme="dark" />

            {/* Header */}
            <header className="p-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 border-b border-primary/20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div
                        onClick={() => setStep(0)}
                        className="cursor-pointer flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-slate-900 font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
                            CB
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                            Cassio Barbearia
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://www.instagram.com/cassiobarbearia_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-800 rounded-full"
                        >
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col">
                <AnimatePresence mode="wait">

                    {step === 0 && (
                        <motion.div key="hero" exit={{ opacity: 0 }}>
                            <Hero onStart={() => setStep(1)} />
                        </motion.div>
                    )}

                    {step > 0 && (
                        <div className="max-w-md mx-auto w-full mt-8">
                            {/* Progress Indicator */}
                            {step < 4 && (
                                <div className="mb-8">
                                    <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                                        <span className={step >= 1 ? "text-primary" : ""}>Serviço</span>
                                        <span className={step >= 2 ? "text-primary" : ""}>Data</span>
                                        <span className={step >= 3 ? "text-primary" : ""}>Confirmação</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(step / 3) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* BACK BUTTON */}
                            {step < 4 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                                </button>
                            )}

                            {/* STEP 1: SERVICES */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-4"
                                >
                                    <h2 className="text-3xl font-bold mb-6">Escolha o Serviço</h2>
                                    <div className="grid gap-4">
                                        {SERVICES.map((service) => (
                                            <div
                                                key={service.id}
                                                onClick={() => { setSelectedService(service); setStep(2); }}
                                                className="bg-slate-800/50 backdrop-blur border border-slate-700 p-5 rounded-2xl cursor-pointer transition-all hover:bg-slate-800 hover:border-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] flex justify-between items-center group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Scissors className="w-5 h-5 text-slate-300 group-hover:text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{service.name}</h3>
                                                        <p className="text-sm text-slate-400">{service.duration} minutos</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-lg text-primary">{formatCurrency(service.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: DATE */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold">Data e Hora</h2>

                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-300 flex justify-between">
                                                <span>Selecione o dia</span>
                                                <span className="text-primary font-bold capitalize">{formatDate(selectedDate)}</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    className="w-full bg-slate-900 border-2 border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all appearance-none cursor-pointer placeholder-slate-500"
                                                    value={format(selectedDate, 'yyyy-MM-dd')}
                                                    min={format(new Date(), 'yyyy-MM-dd')}
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            setSelectedDate(parseISO(e.target.value));
                                                        }
                                                    }}
                                                />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {!isWorkDay(selectedDate) ? (
                                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-200 text-center animate-pulse">
                                                <p className="font-bold">Barbearia Fechada</p>
                                                <p className="text-sm">Atendemos apenas aos Sábados e Domingos.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-sm font-medium text-slate-300 block mb-3">Horários Disponíveis</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {loading ? (
                                                        <div className="col-span-4 flex justify-center py-8"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="col-span-4 text-center text-slate-500 py-4 italic">Sem horários vagos.</div>
                                                    ) : (
                                                        availableSlots.map((slot, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => setSelectedTime(slot)}
                                                                className={clsx(
                                                                    "py-2 rounded-lg text-sm font-medium border transition-all duration-200",
                                                                    selectedTime?.getTime() === slot.getTime()
                                                                        ? "bg-primary text-slate-900 border-primary font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                                                        : "bg-slate-900 border-slate-700 hover:border-primary/50 text-slate-300 hover:text-white hover:bg-slate-800"
                                                                )}
                                                            >
                                                                {formatTime(slot)}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full h-14 text-lg rounded-xl shadow-lg"
                                        disabled={!selectedTime}
                                        onClick={() => setStep(3)}
                                    >
                                        Continuar
                                    </Button>
                                </motion.div>
                            )}

                            {/* STEP 3: FORM */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold">Finalizar</h2>

                                    <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4 shadow-xl">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                            <div>
                                                <p className="text-slate-400 text-sm">Serviço</p>
                                                <p className="font-semibold text-lg">{selectedService?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-sm">Valor</p>
                                                <p className="font-bold text-xl text-primary">{selectedService && formatCurrency(selectedService.price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 py-2">
                                            <Calendar className="text-primary w-5 h-5" />
                                            <span className="text-lg">
                                                {selectedDate && formatDate(selectedDate)} às <span className="font-bold text-white">{selectedTime && formatTime(selectedTime)}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Input
                                            label="Nome Completo"
                                            placeholder="Digite seu nome"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 bg-slate-800 border-slate-700"
                                        />
                                        <Input
                                            label="WhatsApp"
                                            placeholder="(87) 99999-9999"
                                            value={phone}
                                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                                            className="h-12 bg-slate-800 border-slate-700"
                                        />
                                    </div>

                                    <Button
                                        className="w-full h-14 text-lg bg-green-600 hover:bg-green-500 text-white border-none shadow-[0_0_20px_rgba(22,163,74,0.3)] rounded-xl"
                                        disabled={!name || phone.length < 14 || loading}
                                        onClick={handleBooking}
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2 w-5 h-5" />}
                                        Confirmar Agendamento
                                    </Button>
                                    <p className="text-xs text-center text-slate-500 mt-4">
                                        Ao confirmar, você será redirecionado para o WhatsApp.
                                    </p>
                                </motion.div>
                            )}

                            {/* STEP 4: SUCCESS */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-10"
                                >
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-center">Agendamento Solicitado!</h2>
                                    <p className="text-slate-400 text-center text-lg max-w-xs mx-auto">
                                        Seu horário foi reservado. Aguarde a confirmação de Cassio no WhatsApp.
                                    </p>
                                    <div className="pt-8">
                                        <Button
                                            onClick={() => { setStep(0); setSelectedTime(null); setName(''); setPhone(''); }}
                                            variant="outline"
                                            className="min-w-[200px]"
                                        >
                                            Voltar ao Início
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    )}

                </AnimatePresence>
            </main>

            <Footer />
            <AiConsultant />
        </div>
    );
}
