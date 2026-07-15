import React, { useState } from 'react';
import { Phone, AlertTriangle, HeartPulse, ShieldAlert, Car, ChevronRight, Sparkles } from 'lucide-react';

const emergencyNumbers = [
    {
        id: 1,
        service: "National Emergency",
        number: "112",
        description: "Unified helpline for all immediate assistance including police, fire, and medical services.",
        icon: <ShieldAlert className="h-5 w-5" />,
        color: "from-red-500 to-rose-400",
        accent: "text-red-500"
    },
    {
        id: 2,
        service: "Ambulance",
        number: "102",
        description: "Medical emergencies, hospital transport, and immediate healthcare assistance.",
        icon: <HeartPulse className="h-5 w-5" />,
        color: "from-emerald-500 to-teal-400",
        accent: "text-emerald-500"
    },
    {
        id: 3,
        service: "Police",
        number: "100",
        description: "Law enforcement, crime reporting, and security threat assistance.",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "from-blue-500 to-indigo-400",
        accent: "text-blue-500"
    },
    {
        id: 4,
        service: "Disaster Management",
        number: "108",
        description: "Natural disasters, public health crises, and large-scale emergency coordination.",
        icon: <Car className="h-5 w-5" />,
        color: "from-orange-500 to-amber-400",
        accent: "text-orange-500"
    }
];

const EmergencyContacts = () => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-24 px-4">
            <div className="max-w-6xl mx-auto">

                
                <header className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-5 py-2 mb-6">
                        <Sparkles className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-semibold tracking-wide text-xs uppercase">Priority Assistance</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6">
                        Emergency
                        <span className="block bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Hub.
                        </span>
                    </h1>
                    <p className="max-w-md mx-auto text-slate-400 font-medium text-lg leading-relaxed">
                        Quick access to critical emergency services. Every second counts.
                    </p>
                </header>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {emergencyNumbers.map((contact, index) => (
                        <div
                            key={contact.id}
                            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:-translate-y-1"
                            onMouseEnter={() => setHoveredId(contact.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            
                            <div className={`relative p-6 bg-gradient-to-br ${contact.color} overflow-hidden`}>
                                
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[20px] border-white" />
                                    <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full border-[15px] border-white" />
                                </div>

                                
                                <div className="absolute top-4 right-4">
                                    <span className="text-white/20 font-black text-6xl leading-none select-none">
                                        0{index + 1}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                                            {contact.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-xl leading-tight">{contact.service}</h3>
                                            <p className="text-white/70 text-sm font-medium mt-1 line-clamp-2">{contact.description}</p>
                                        </div>
                                    </div>

                                    
                                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                                <Phone className={`h-5 w-5 ${contact.accent} fill-current`} />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Direct Line</p>
                                                <p className="text-white font-black text-3xl tracking-tight">{contact.number}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`tel:${contact.number}`}
                                            className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                        >
                                            <ChevronRight className={`h-5 w-5 ${contact.accent}`} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="p-5">
                                <a
                                    href={`tel:${contact.number}`}
                                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r ${contact.color} text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                                >
                                    <Phone className="h-4 w-4 fill-current" />
                                    Call {contact.number} Now
                                    <ChevronRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-6 py-4">
                        <div className="flex -space-x-1">
                            {emergencyNumbers.map((s) => (
                                <div key={s.id} className={`w-3 h-3 rounded-full bg-gradient-to-br ${s.color} ring-2 ring-white`} />
                            ))}
                        </div>
                        <span className="text-slate-400 text-sm font-medium">
                            4 services · 24/7 available · Nationwide coverage
                        </span>
                    </div>
                </div>

                
                <div className="mt-8 bg-gradient-to-r from-red-500 to-rose-400 rounded-3xl p-8 text-center">
                    <h3 className="text-white font-bold text-xl mb-2">Emergency Tips</h3>
                    <p className="text-white/80 text-sm max-w-lg mx-auto">
                        Stay calm, provide your exact location, describe the situation clearly, and follow the operator's instructions. Don't hang up until told to do so.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContacts;