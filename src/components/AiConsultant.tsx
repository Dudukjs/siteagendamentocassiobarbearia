
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Bot, User, MessageCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { isWorkDay, getOpeningHours, generateTimeSlots, formatTime } from '../utils/date';
import { SERVICES, BARBERSHOP_PHONE } from '../utils/constants';
import { useAppointments } from '../hooks/useAppointments';
import { addMinutes, isBefore, setHours, setMinutes, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/format';

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    isAction?: boolean; // If true, renders a specific action (like WhatsApp button)
}

export function AiConsultant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            text: 'Olá! Sou o Assistente Virtual. 🤖\nPosso te ajudar com preços, horários ou dicas de estilo. O que manda?'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { getAppointmentsByDate } = useAppointments();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // --- LOGIC: Availability Check ---
    const checkAvailabilityToday = async (): Promise<string> => {
        const now = new Date();

        if (!isWorkDay(now)) {
            return "Hoje estamos fechados! 😴\nAtendemos Sábados (08h-18h) e Domingos (09h-16h). Que tal agendar para o fim de semana?";
        }

        const openingHours = getOpeningHours(now);
        // Check if passed closing time
        if (openingHours && now.getHours() >= openingHours.end) {
            return "Já encerramos por hoje! 🌙\nMas o agendamento para o próximo fim de semana está liberado.";
        }

        // Fetch real data
        try {
            const appointments = await getAppointmentsByDate(now);
            const allSlots = generateTimeSlots(now);

            // Filter logic (duplicated from Home.tsx - ideal would be a shared hook, but keeping simple here)
            const validSlots = allSlots.filter(slot => {
                if (isBefore(slot, now)) return false;
                // Check overlap (assuming 30min default for simplicity in quick check)
                const slotEnd = addMinutes(slot, 30);
                const hasOverlap = appointments.some((appt) => {
                    const apptStart = parseISO(appt.date);
                    const apptEnd = addMinutes(apptStart, 30); // simplistic check
                    return (slot < apptEnd && slotEnd > apptStart);
                });
                return !hasOverlap;
            });

            if (validSlots.length === 0) {
                return "Poxa, hoje estamos lotados! 🚫\nNão há mais horários vagos. Tente agendar para amanhã/fim de semana.";
            }

            const nextSlot = validSlots[0];
            return `Sim! Temos ${validSlots.length} horários vagos para hoje.\nO próximo é às **${formatTime(nextSlot)}**. \nCorre pra agendar! 🏃‍♂️`;

        } catch (e) {
            return "Não consegui verificar a agenda agora. Tente olhar diretamente no calendário. 🗓️";
        }
    };

    // --- LOGIC: Bot Responses ---
    const processMessage = async (text: string) => {
        const t = text.toLowerCase();

        // 1. OPEN NOW?
        if (t.includes('aberto') || t.includes('funcionando') || t.includes('horas') || t.includes('fechado')) {
            const now = new Date();
            const hours = getOpeningHours(now);

            if (!isWorkDay(now)) return "Estamos fechados agora. \nAtendemos Sábado (08h-18h) e Domingo (09h-16h).";

            if (hours) {
                const currentHour = now.getHours();
                if (currentHour >= hours.start && currentHour < hours.end) {
                    return `Sim, estamos abertos! 🔥\nHoje vamos até às ${hours.end}:00.`;
                } else {
                    return "Estamos fechados agora. 😴";
                }
            }
        }

        // 2. PRICES
        if (t.includes('preço') || t.includes('valor') || t.includes('quanto') || t.includes('custa')) {
            const list = SERVICES.map(s => `• ${s.name}: **${formatCurrency(s.price)}**`).join('\n');
            return `Aqui está nossa tabela atualizada: 💸\n\n${list}`;
        }

        // 3. AVAILABILITY
        if (t.includes('vaga') || t.includes('horário') || t.includes('hoje') || t.includes('agora') || t.includes('livre')) {
            return await checkAvailabilityToday();
        }

        // 4. STYLE (Keep the old logic too)
        if (t.includes('redondo')) return "Para rostos **redondos**, laterais baixas e volume no topo ajudam a alongar.";
        if (t.includes('quadrado')) return "Rosto **quadrado** combina com quase tudo! Buzz cut ou degradê ficam ótimos.";
        if (t.includes('sugestão') || t.includes('corte')) return "Posso sugerir algo baseado no seu rosto. Ele é mais Redondo, Quadrado ou Oval?";

        // 5. HUMAN / WHATSAPP (Fallback)
        return "redirect_whatsapp";
    };

    const handleSend = async (manualText?: string) => {
        const textToSend = manualText || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate delay + Async processing
        setTimeout(async () => {
            const responseText = await processMessage(userMsg.text);

            let aiMsg: Message;

            if (responseText === "redirect_whatsapp") {
                aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    text: "Essa é bem específica! 🤔 \nMelhor falar diretamento com o Cassio no WhatsApp.",
                    isAction: true
                };
            } else {
                aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: responseText };
            }

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const openWhatsapp = () => {
        const url = `https://wa.me/${BARBERSHOP_PHONE}?text=Olá,%20vim%20pelo%20site%20e%20tenho%20uma%20dúvida.`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Floating Trigger */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-hover text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all transform hover:scale-110 flex items-center gap-2 group"
                >
                    <Bot className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
                        Ajuda / Dúvidas
                    </span>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-slate-900 border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[500px]">

                    {/* Header */}
                    <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center relative">
                                <Bot className="text-primary w-6 h-6" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Assistente Cassio</h3>
                                <p className="text-xs text-slate-400">Responde na hora ⚡</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95 backdrop-blur scrollbar-thin scrollbar-thumb-slate-700">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={clsx(
                                    "flex gap-3 max-w-[90%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                    msg.role === 'user' ? "bg-slate-700" : "bg-primary"
                                )}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-slate-900" />}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className={clsx(
                                        "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                                        msg.role === 'user'
                                            ? "bg-slate-800 text-white rounded-tr-none"
                                            : "bg-slate-800 border border-primary/20 text-slate-200 rounded-tl-none"
                                    )}>
                                        {msg.text}
                                    </div>

                                    {msg.isAction && (
                                        <button
                                            onClick={openWhatsapp}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg transition-colors w-fit"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Chamar no WhatsApp
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-slate-900" />
                                </div>
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-primary/20 flex gap-1 items-center h-10 w-16">
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions (Chips) */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
                        <button onClick={() => handleSend("Qual o preço?")} className="whitespace-nowrap px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 hover:border-primary hover:text-primary transition-colors">
                            💰 Preços
                        </button>
                        <button onClick={() => handleSend("Está aberto?")} className="whitespace-nowrap px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 hover:border-primary hover:text-primary transition-colors">
                            🕒 Horários
                        </button>
                        <button onClick={() => handleSend("Tem vaga hoje?")} className="whitespace-nowrap px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 hover:border-primary hover:text-primary transition-colors">
                            📅 Vagas Hoje
                        </button>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-slate-800 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua dúvida..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary placeholder:text-slate-500 text-sm"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="bg-primary hover:bg-primary-hover text-slate-900 p-2.5 rounded-xl disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
