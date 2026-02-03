
import { Calendar, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface HeroProps {
    onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
    return (
        <section className="relative overflow-hidden py-20 px-6 text-center">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
                    <Scissors className="w-4 h-4" />
                    <span>Estilo & Tradição em Lajedo</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                    Sua Melhor Versão <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
                        Começa Aqui
                    </span>
                </h1>

                <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                    Agende seu corte ou barba em segundos. Profissional qualificado e preços imperdíveis.
                </p>

                <div className="pt-4 flex justify-center gap-4">
                    <Button
                        onClick={onStart}
                        className="h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse hover:animate-none transition-all"
                    >
                        <Calendar className="mr-2 w-5 h-5" />
                        Agendar Agora
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
