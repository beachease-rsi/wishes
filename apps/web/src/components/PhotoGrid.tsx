import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

type Memory = {
    id: string;
    img_url: string;
    message: string;
};

const fallbackMemories: Memory[] = [
    { id: '1', img_url: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=600&auto=format&fit=crop", message: "That time we got lost in the city but found the best pizza place ever. 🍕" },
    { id: '2', img_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop", message: "Late night drives singing our lungs out to awful songs. 🚗🎶" },
]

export function PhotoGrid() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const { data, error } = await supabase
                    .from('memories')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setMemories(data);
                } else {
                    setMemories(fallbackMemories);
                }
            } catch (err) {
                console.error('Error fetching memories:', err);
                setMemories(fallbackMemories);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#f26d83] animate-spin" />
            </div>
        );
    }

    return (
        <section className="py-12 px-4 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 flex flex-col items-center"
            >
                <h2 className="text-[#3a2e2f] flex flex-col items-center mb-4">
                    <span className="font-sans text-3xl md:text-4xl font-bold">Our Favorite</span>
                    <span className="font-scribble text-6xl md:text-7xl text-[#f26d83] transform -rotate-2 -mt-2">Moments</span>
                </h2>
                <p className="font-sans text-xl md:text-2xl opacity-75 max-w-xl">Hover over our memories to see a special note.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {memories.map((mem, i) => (
                    <motion.div
                        key={mem.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group shadow-xl"
                        onMouseEnter={() => setHoveredId(mem.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <img
                            src={mem.img_url}
                            alt={`Memory ${mem.id}`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <AnimatePresence>
                            {hoveredId === mem.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-6 text-center"
                                >
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ delay: 0.1, duration: 0.4 }}
                                        className="text-white font-scribble text-3xl md:text-4xl leading-tight drop-shadow-lg"
                                    >
                                        {mem.message}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
