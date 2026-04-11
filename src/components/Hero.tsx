
import { Calendar, Scissors, Star, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface HeroProps {
    onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const floatingIcons = [
        { icon: Scissors, delay: 0, duration: 4, x: -120, y: -80 },
        { icon: Star, delay: 0.5, duration: 5, x: 140, y: -60 },
        { icon: Award, delay: 1, duration: 4.5, x: -100, y: 100 },
        { icon: Clock, delay: 1.5, duration: 5.5, x: 120, y: 120 },
    ];

    return (
        <section className="relative overflow-hidden py-16 md:py-24 px-6 text-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                
                {/* Secondary Glows */}
                <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-yellow-500/10 rounded-full blur-[90px]" />
                
                {/* Floating Icons */}
                {floatingIcons.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={index}
                            className="absolute top-1/2 left-1/2 hidden lg:block"
                            initial={{ opacity: 0.15, x: item.x, y: item.y }}
                            animate={{
                                y: [item.y, item.y - 30, item.y],
                                opacity: [0.15, 0.3, 0.15],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: item.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: item.delay
                            }}
                        >
                            <Icon className="w-8 h-8 text-primary/40" />
                        </motion.div>
                    );
                })}

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-3xl mx-auto space-y-8"
            >
                {/* Badge */}
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-yellow-500/15 text-primary text-sm font-semibold border border-primary/30 shadow-lg backdrop-blur-sm"
                >
                    <Star className="w-4 h-4 fill-current" />
                    <span>Estilo & Tradição em Lajedo</span>
                    <Star className="w-4 h-4 fill-current" />
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        <span className="block text-white drop-shadow-2xl">Sua Melhor Versão</span>
                        <span className="block mt-2 bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] drop-shadow-lg">
                            Começa Aqui
                        </span>
                    </h1>
                </motion.div>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light"
                >
                    Agende seu corte ou barba em segundos. 
                    <span className="text-primary font-semibold"> Profissional qualificado </span> 
                    e preços imperdíveis.
                </motion.p>

                {/* Profile Images */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center -space-x-5 py-6 filter drop-shadow-2xl"
                >
                    <motion.img
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        src="/cassio1.jpg"
                        alt="Barbeiro Cassio"
                        className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover shadow-2xl ring-4 ring-primary/20 transition-all duration-300 hover:z-20"
                    />
                    <motion.img
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        src="/cassio2.jpg"
                        alt="Barbeiro Cassio"
                        className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover shadow-2xl ring-4 ring-primary/20 transition-all duration-300 hover:z-20"
                    />
                </motion.div>

                {/* Online Status */}
                <motion.p
                    variants={itemVariants}
                    className="text-sm text-primary font-semibold flex items-center justify-center gap-2"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
                    </span>
                    Cassio Barbeiro • Online agora
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="pt-6 flex flex-col items-center justify-center gap-5"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={onStart}
                            className="h-16 px-10 text-lg rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] transition-all duration-300 font-bold group"
                        >
                            <Calendar className="mr-2.5 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                            Agendar Agora
                        </Button>
                    </motion.div>

                    <motion.a
                        whileHover={{ x: 5 }}
                        href="/meus-agendamentos"
                        className="text-slate-400 hover:text-white text-sm font-medium transition-all hover:underline decoration-primary/50 underline-offset-8 group"
                    >
                        Ver meus agendamentos
                        <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </motion.a>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-slate-400"
                >
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span>5.0 Avaliação</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>+500 Clientes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Pontualidade</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
