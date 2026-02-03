
import { MapPin, Phone, Instagram, Clock, Lock } from 'lucide-react';


export function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 pt-12 pb-6 px-6 mt-12">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-8">

                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">CB</div>
                        Cassio Barbearia
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Elevando sua autoestima com cortes modernos e tradicionais. O melhor atendimento de Lajedo-PE.
                    </p>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">Contato</h4>
                    <ul className="space-y-3 text-slate-400 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            (87) 9984-6754
                        </li>
                        <li className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-primary" />
                            @cassiobarbearia_
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-1 min-w-[16px]" />
                            <span>
                                Rua João Jordão Macedo, 45<br />
                                Bairro Bom Jesus<br />
                                Lajedo - PE
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold">Horários</h4>
                    <ul className="space-y-3 text-slate-400 text-sm">
                        <li className="flex items-center gap-2 justify-between">
                            <span>Sábado</span>
                            <span className="text-white">08:00 - 18:00</span>
                        </li>
                        <li className="flex items-center gap-2 justify-between">
                            <span>Domingo</span>
                            <span className="text-white">09:00 - 16:00</span>
                        </li>
                        <li className="flex items-center gap-2 justify-between opacity-50">
                            <span>Seg - Sex</span>
                            <span>Fechado</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs flex flex-col gap-2 items-center">
                <span>&copy; {new Date().getFullYear()} Cassio Barbearia. Todos os direitos reservados. | <span className="text-slate-400">Mepstack | Serviços de Tecnologia</span></span>
                <a href="/admin" className="opacity-0 hover:opacity-20 transition-opacity p-2" title="Admin Area">
                    <Lock className="w-3 h-3" />
                </a>
            </div>
        </footer>
    );
}
