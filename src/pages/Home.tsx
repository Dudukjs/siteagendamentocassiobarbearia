import { useState, useEffect, useMemo } from 'react';
import { addMinutes, isBefore, startOfToday, parseISO } from 'date-fns';
import { Calendar, Scissors, User, CheckCircle, Loader2, Instagram, ArrowLeft, Sparkles, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { clsx } from 'clsx';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { AiConsultant } from '../components/AiConsultant';
import { BookingCalendar } from '../components/BookingCalendar';

import { SERVICES, type Service, BARBERSHOP_PHONE } from '../utils/constants';
import { generateTimeSlots, isWorkDay, formatTime, formatDate } from '../utils/date';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { formatPhone, formatCurrency } from '../utils/format';

// Icon mapping for services
const SERVICE_ICONS: Record<string, typeof Scissors> = {
    '1': Scissors,
    '2': Scissors,
    '3': Scissors,
    '4': User,
    '5': Sparkles,
    '6': User,
};

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

    const stepVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
        },
        exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative">
            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <Toaster position="top-center" richColors theme="dark" />

            {/* Header */}
            <header className="px-4 py-3 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 border-b border-primary/10 shadow-lg shadow-primary/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div
                        onClick={() => setStep(0)}
                        className="cursor-pointer flex items-center gap-3 group"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-11 h-11 bg-gradient-to-br from-primary to-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-primary/30"
                        >
                            CB
                        </motion.div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                            Cassio Barbearia
                        </h1>
                    </div>

                    <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://www.instagram.com/cassiobarbearia_/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-primary transition-all p-2.5 hover:bg-slate-800/80 rounded-xl border border-transparent hover:border-primary/20"
                    >
                        <Instagram className="w-5 h-5" />
                    </motion.a>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col relative z-10">
                <AnimatePresence mode="wait">

                    {step === 0 && (
                        <motion.div key="hero" exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
                            <Hero onStart={() => setStep(1)} />
                        </motion.div>
                    )}

                    {step > 0 && (
                        <div className="max-w-md mx-auto w-full mt-4 md:mt-8">
                            {/* Progress Indicator */}
                            {step < 4 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        <span className={step >= 1 ? "text-primary transition-colors" : ""}>Serviço</span>
                                        <span className={step >= 2 ? "text-primary transition-colors" : ""}>Data</span>
                                        <span className={step >= 3 ? "text-primary transition-colors" : ""}>Confirmação</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-yellow-300 rounded-full shadow-lg shadow-primary/50"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(step / 3) * 100}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* BACK BUTTON */}
                            {step < 4 && (
                                <motion.button
                                    whileHover={{ x: -5 }}
                                    onClick={() => setStep(step - 1)}
                                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium group"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
                                </motion.button>
                            )}

                            {/* STEP 1: SERVICES */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                            Escolha o Serviço
                                        </h2>
                                        <p className="text-slate-400">Selecione o serviço desejado para continuar</p>
                                    </motion.div>

                                    <motion.div 
                                        className="grid gap-4"
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
                                        }}
                                    >
                                        {SERVICES.map((service) => {
                                            const Icon = SERVICE_ICONS[service.id] || Scissors;
                                            return (
                                                <motion.div
                                                    key={service.id}
                                                    variants={{
                                                        hidden: { opacity: 0, x: -30 },
                                                        visible: { opacity: 1, x: 0 }
                                                    }}
                                                    whileHover={{ scale: 1.03, y: -4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => { setSelectedService(service); setStep(2); }}
                                                    className="glass rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(212,175,55,0.15)] group border border-slate-700/50"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <motion.div 
                                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all"
                                                            >
                                                                <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                                            </motion.div>
                                                            <div>
                                                                <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors">{service.name}</h3>
                                                                <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    <span>{service.duration} min</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <motion.div 
                                                            className="text-right"
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            <div className="flex items-center gap-1.5 text-primary">
                                                                <DollarSign className="w-4 h-4" />
                                                                <span className="font-bold text-lg">{formatCurrency(service.price)}</span>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* STEP 2: DATE */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                                Data e Hora
                                            </h2>
                                            <p className="text-slate-400 text-sm mt-1">Escolha a melhor data e horário</p>
                                        </div>
                                        <span className="text-sm text-primary font-bold capitalize bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 shadow-lg">
                                            {selectedDate && formatDate(selectedDate)}
                                        </span>
                                    </motion.div>

                                    {/* Calendar Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="glass-strong p-5 sm:p-6 rounded-2xl shadow-2xl"
                                    >
                                        <BookingCalendar
                                            selectedDate={selectedDate}
                                            onDateSelect={(date) => {
                                                setSelectedDate(date);
                                                setSelectedTime(null);
                                            }}
                                        />
                                    </motion.div>

                                    {/* Time Slots Section */}
                                    <AnimatePresence mode="wait">
                                        {!isWorkDay(selectedDate) ? (
                                            <motion.div
                                                key="closed"
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 p-6 rounded-2xl text-center backdrop-blur-sm"
                                            >
                                                <p className="font-bold text-lg text-red-200">🚫 Barbearia Fechada</p>
                                                <p className="text-sm mt-2 text-red-300/80">Atendemos apenas aos Sábados e Domingos.</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="timeslots"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: 0.3 }}
                                                className="glass-strong p-5 sm:p-6 rounded-2xl shadow-2xl"
                                            >
                                                <div className="flex items-center justify-between mb-5">
                                                    <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        Horários Disponíveis
                                                    </label>
                                                    {availableSlots.length > 0 && !loading && (
                                                        <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                                                            {availableSlots.length} vagas
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                                    {loading ? (
                                                        <div className="col-span-full flex justify-center py-8">
                                                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                                                        </div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="col-span-full text-center text-slate-500 py-8">
                                                            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                                                            <p className="italic">Sem horários vagos neste dia.</p>
                                                            <p className="text-xs mt-2 text-slate-600">Tente outra data no calendário acima.</p>
                                                        </div>
                                                    ) : (
                                                        availableSlots.map((slot, i) => (
                                                            <motion.button
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: i * 0.02 }}
                                                                whileHover={{ scale: 1.08, y: -2 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setSelectedTime(slot)}
                                                                className={clsx(
                                                                    "py-3 rounded-xl text-sm font-medium border transition-all duration-200",
                                                                    selectedTime?.getTime() === slot.getTime()
                                                                        ? "bg-gradient-to-r from-primary to-yellow-300 text-slate-900 border-primary font-bold shadow-lg shadow-primary/40 scale-105"
                                                                        : "bg-slate-900/80 border-slate-700/50 hover:border-primary/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-md active:scale-95"
                                                                )}
                                                            >
                                                                {formatTime(slot)}
                                                            </motion.button>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Button
                                            className="w-full h-14 text-lg rounded-xl shadow-lg bg-gradient-to-r from-primary to-yellow-300 text-slate-900 font-bold hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!selectedTime}
                                            onClick={() => setStep(3)}
                                        >
                                            Continuar
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* STEP 3: FORM */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                            Finalizar Agendamento
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">Revise seus dados e confirme</p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="glass-strong p-6 rounded-2xl shadow-2xl space-y-4 border border-primary/10"
                                    >
                                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                            <div>
                                                <p className="text-slate-400 text-sm">Serviço</p>
                                                <p className="font-semibold text-lg text-white">{selectedService?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-sm">Valor</p>
                                                <p className="font-bold text-xl bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent">{selectedService && formatCurrency(selectedService.price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 py-2">
                                            <Calendar className="text-primary w-5 h-5" />
                                            <span className="text-lg text-white">
                                                {selectedDate && formatDate(selectedDate)} às <span className="font-bold text-primary">{selectedTime && formatTime(selectedTime)}</span>
                                            </span>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Input
                                            label="Nome Completo"
                                            placeholder="Digite seu nome"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 bg-slate-800/80 border-slate-700/50 input-animated"
                                        />
                                        <Input
                                            label="WhatsApp"
                                            placeholder="(87) 99999-9999"
                                            value={phone}
                                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                                            className="h-12 bg-slate-800/80 border-slate-700/50 input-animated"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Button
                                            className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-none shadow-lg shadow-green-600/30 rounded-xl font-bold transition-all disabled:opacity-50"
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
                                </motion.div>
                            )}

                            {/* STEP 4: SUCCESS */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="flex flex-col items-center justify-center space-y-8 py-10"
                                >
                                    <motion.div 
                                        className="w-28 h-28 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mb-4 border border-green-500/30"
                                        animate={{ 
                                            boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 40px rgba(34, 197, 94, 0.3)", "0 0 0px rgba(34, 197, 94, 0)"]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <CheckCircle className="w-14 h-14 text-green-500" />
                                    </motion.div>
                                    <div className="text-center space-y-3">
                                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                                            Agendamento Solicitado!
                                        </h2>
                                        <p className="text-slate-400 text-lg max-w-xs mx-auto">
                                            Seu horário foi reservado. Aguarde a confirmação de Cassio no WhatsApp.
                                        </p>
                                    </div>
                                    <motion.div 
                                        className="pt-4"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => { setStep(0); setSelectedTime(null); setName(''); setPhone(''); }}
                                            variant="outline"
                                            className="min-w-[200px] border-primary/30 hover:bg-primary/10"
                                        >
                                            Voltar ao Início
                                        </Button>
                                    </motion.div>
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
