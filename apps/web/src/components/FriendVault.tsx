import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const friends = [
    {
        id: 1,
        name: "Alex",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
        message: "To the best third wheel we could ever ask for! Thanks for always being there through the highs and lows. Your energy is unmatched and we love you! 🎉"
    },
    {
        id: 2,
        name: "Sarah",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        message: "My work wife and absolute rock. I don't know how I'd survive the office without our lunch breaks and endless gossiping. 💕"
    },
    {
        id: 3,
        name: "Jason",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop",
        message: "Bro! From college dorms to now, some things never change. So glad to have you in our corner always. Cheers to many more years! 🍻"
    },
    {
        id: 4,
        name: "Emma",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        message: "The most creative soul I know. Thank you for bringing so much color and light into our lives. Keep shining! ✨"
    }
];

export function FriendVault() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section className="py-12 px-4 max-w-5xl mx-auto min-h-[70vh] relative flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-16"
            >
                <h2 className="text-[#3a2e2f] flex flex-col items-center mb-4">
                    <span className="font-sans text-3xl md:text-5xl font-bold">Personal Vaults</span>
                    <span className="font-scribble text-5xl md:text-7xl text-[#f26d83] transform -rotate-1">For Our Friends</span>
                </h2>
                <p className="font-sans text-xl opacity-75">Click a card to unlock a personal message.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {friends.map((friend) => (
                    <motion.div
                        layoutId={`card-container-${friend.id}`}
                        key={friend.id}
                        onClick={() => setSelectedId(friend.id)}
                        className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-lg cursor-pointer hover:shadow-xl hover:bg-white/80 transition-colors flex flex-col items-center justify-center"
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.img
                            layoutId={`card-image-${friend.id}`}
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-sm"
                        />
                        <motion.h3
                            layoutId={`card-title-${friend.id}`}
                            className="font-sans text-2xl font-bold text-[#3a2e2f]"
                        >
                            For {friend.name}
                        </motion.h3>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setSelectedId(null)}
                        />

                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                layoutId={`card-container-${selectedId}`}
                                className="bg-[#fcf6e5] w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative pointer-events-auto overflow-hidden border border-white/50"
                            >
                                <div className="absolute top-0 right-0 p-6 z-10">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-[#3a2e2f]" />
                                    </button>
                                </div>

                                {friends.filter(f => f.id === selectedId).map(friend => (
                                    <div key={friend.id} className="flex flex-col items-center">
                                        <motion.img
                                            layoutId={`card-image-${friend.id}`}
                                            src={friend.avatar}
                                            alt={friend.name}
                                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md mb-8"
                                        />
                                        <motion.h3
                                            layoutId={`card-title-${friend.id}`}
                                            className="font-sans text-3xl md:text-4xl font-bold text-[#3a2e2f] mb-6"
                                        >
                                            For {friend.name}
                                        </motion.h3>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ delay: 0.1, duration: 0.3 }}
                                            className="text-center"
                                        >
                                            <p className="font-scribble text-3xl md:text-5xl text-[#3a2e2f] leading-relaxed">
                                                "{friend.message}"
                                            </p>
                                        </motion.div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
