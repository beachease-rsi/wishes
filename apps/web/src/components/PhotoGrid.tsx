import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

type Memory = {
    id: string;
    img_url: string;
    message: string;
};

const dummyMemories: Memory[] = [
    { id: '1', img_url: "https://i.postimg.cc/4dHvHLcs/Whats-App-Image-2026-03-09-at-22-24-04.jpg", message: "This is us when we moved in together 🍕" },
    { id: '2', img_url: "https://i.postimg.cc/hjVzqHxL/Whats-App-Image-2026-03-09-at-22-24-06.jpg", message: "Being happy no matter what😇" },
    { id: '3', img_url: "https://i.postimg.cc/yNcYJ0NL/Whats-App-Image-2026-03-09-at-22-25-05.jpg", message: "Romanticizing our life❤️" },
    { id: '4', img_url: "https://i.postimg.cc/bv7pprHL/Whats-App-Image-2026-03-09-at-22-18-28.jpg", message: "vibing in the era😎" },
    { id: '5', img_url: "https://i.postimg.cc/nzKbxkL8/Whats-App-Image-2026-03-09-at-22-18-32.jpg", message: " Sparkles of diwali night🥳" },
    { id: '6', img_url: "https://i.postimg.cc/9XTzR5DR/Whats-App-Image-2026-03-09-at-22-18-27.jpg", message: "The happy laughter😁" },
];

export function PhotoGrid() {
    const [memories] = useState<Memory[]>(dummyMemories);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedMemory = memories.find(m => m.id === selectedId);

    return (
        <section id="moments" className="py-24 px-4 bg-[#fcf6e5] relative group/grid">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-sans font-bold text-[#3a2e2f] mb-16 text-center"
                >
                    Our <span className="text-[#f26d83] font-scribble">Moments</span>
                </motion.h2>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {memories.map((memory) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            layoutId={memory.id}
                            onClick={() => setSelectedId(memory.id)}
                            className="break-inside-avoid relative cursor-pointer group/item"
                        >
                            <div className="bg-white p-3 pt-3 pb-8 shadow-xl transform transition-transform duration-300 group-hover/item:rotate-2 group-hover/item:scale-105">
                                <div className="relative overflow-hidden aspect-[4/5]">
                                    <img
                                        src={memory.img_url}
                                        alt="Polaroid Memory"
                                        className="w-full h-full object-cover sepia-[0.1]"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </div>
                                <div className="mt-4 flex justify-between items-center px-1">
                                    <div className="w-6 h-6 rounded-full bg-[#f26d83]/10 flex items-center justify-center">
                                        <Heart className="w-3 h-3 text-[#f26d83] fill-[#f26d83]" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">#LOVE</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId && selectedMemory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={selectedId}
                            className="bg-white p-4 pb-12 shadow-2xl max-w-2xl w-full transform rotate-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-end mb-2">
                                <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-[#3a2e2f]" />
                                </button>
                            </div>
                            <div className="aspect-[4/5] overflow-hidden mb-6">
                                <img
                                    src={selectedMemory.img_url}
                                    alt="Selected Memory"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-scribble text-3xl md:text-5xl text-[#3a2e2f] text-center px-4 leading-relaxed">
                                {selectedMemory.message}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
