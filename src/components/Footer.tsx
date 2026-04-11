import { MapPin, Phone, Instagram, Clock, Lock, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50 mt-16 overflow-hidden">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="md:col-span-2 lg:col-span-1 space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-400 rounded-xl flex items-center justify-center text-slate-900 font-bold text-lg shadow-lg shadow-primary/20">
                                CB
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Cassio Barbearia</h3>
                                <p className="text-xs text-slate-500">Estilo & Tradição</p>
                            </div>
                        </motion.div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Elevando sua autoestima com cortes modernos e tradicionais. 
                            O melhor atendimento de Lajedo-PE.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            <motion.a
                                whileHover={{ y: -3, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://www.instagram.com/cassiobarbearia_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800/80 hover:bg-primary/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-700/50 hover:border-primary/30"
                            >
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ y: -3, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://wa.me/558799846754`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-slate-800/80 hover:bg-green-500/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-green-500 transition-all border border-slate-700/50 hover:border-green-500/30"
                            >
                                <Phone className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h4 className="text-white font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Contato
                        </h4>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <a href="tel:+558799846754" className="hover:text-primary transition-colors">
                                        (87) 9984-6754
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                    <Instagram className="w-4 h-4 text-primary" />
                                </div>
                                <a 
                                    href="https://www.instagram.com/cassiobarbearia_/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    @cassiobarbearia_
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <span className="leading-relaxed">
                                    Rua João Jordão Macedo, 45<br />
                                    Bairro Bom Jesus<br />
                                    Lajedo - PE
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Hours Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h4 className="text-white font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Horários
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-primary/20 transition-colors">
                                <div>
                                    <span className="text-white text-sm font-medium">Sábado</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-slate-400">Aberto</span>
                                    </div>
                                </div>
                                <span className="text-primary font-semibold text-sm">08:00 - 18:00</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-primary/20 transition-colors">
                                <div>
                                    <span className="text-white text-sm font-medium">Domingo</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-slate-400">Aberto</span>
                                    </div>
                                </div>
                                <span className="text-primary font-semibold text-sm">09:00 - 16:00</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/20 opacity-60">
                                <div>
                                    <span className="text-slate-400 text-sm">Seg - Sex</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Fechado</span>
                                    </div>
                                </div>
                                <span className="text-slate-500 text-sm">—</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h4 className="text-white font-semibold">Links Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-4 bg-primary/30 group-hover:h-6 group-hover:bg-primary rounded-full transition-all"></span>
                                    Agendar Horário
                                </a>
                            </li>
                            <li>
                                <a href="/meus-agendamentos" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-4 bg-primary/30 group-hover:h-6 group-hover:bg-primary rounded-full transition-all"></span>
                                    Meus Agendamentos
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-xs text-center md:text-left">
                            &copy; {currentYear} Cassio Barbearia. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <span>Desenvolvido por</span>
                            <a 
                                href="#"
                                className="text-slate-400 hover:text-primary transition-colors font-medium flex items-center gap-1"
                            >
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                Mepstack | Serviços de Tecnologia
                            </a>
                        </div>
                        <a 
                            href="/admin" 
                            className="opacity-0 hover:opacity-30 transition-opacity p-2" 
                            title="Admin Area"
                        >
                            <Lock className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
