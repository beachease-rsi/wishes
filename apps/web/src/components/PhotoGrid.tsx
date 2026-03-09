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
    { id: '1', img_url: "https://i.postimg.cc/4dHvHLcs/Whats-App-Image-2026-03-09-at-22-24-04.jpg", message: "This is us when we moved in together 🍕" },
    { id: '2', img_url: "https://i.postimg.cc/hjVzqHxL/Whats-App-Image-2026-03-09-at-22-24-06.jpg", message: "Being happy no matter what😇" },
    { id: '3', img_url: "https://i.postimg.cc/yNcYJ0NL/Whats-App-Image-2026-03-09-at-22-25-05.jpg", message: "Romanticizing our life❤️" },
    { id: '4', img_url: "https://i.postimg.cc/bv7pprHL/Whats-App-Image-2026-03-09-at-22-18-28.jpg", message: "vibing in the era😎" },
    { id: '5', img_url: "https://i.postimg.cc/nzKbxkL8/Whats-App-Image-2026-03-09-at-22-18-32.jpg", message: " Sparkles of diwali night🥳" },
    { id: '6', img_url: "https://i.postimg.cc/9XTzR5DR/Whats-App-Image-2026-03-09-at-22-18-27.jpg", message: "The happy laughter😁" },

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
