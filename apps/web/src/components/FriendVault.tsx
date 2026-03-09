import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const friends = [
    {
        id: 1,
        name: "Rishi",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
        message: "Happiest B'day andi sreeyoga garu  runinng out of body battery so low message🪫 "
    },
    {
        id: 2,
        name: "Rupa",
        message: `Ooiii...Pandhii...,
Haa nene..😁😉.
Miss you vey.....!
Revanth naaku ninnu , she is sreeyoga, maa ece ms fresher nominee ani parichayam chesina day nunchi, edhigo maa pandhii, maa romance chusthey chachipotharu meeru aney stage dhaaka, chaala change aiyyay, chaala travel chesam, manam vesina stunt lu , party lu, godavalu, health balenappudu chuskunna caring, ala cheppu kuntu pothey  chaalaney unnai, venakki thirigi chuskuntey, oka year motham nuvvey unnav, just like 1 year live in lo unnattu 😂. So practically I am your ex..😉...ente appudey ex chesdham anukuntunnava, nenu enka unna present lo kuda...😁😁.
Nuv antha dhuram lo unna kuda ee memories anni neeku entha dhaggara ga unnayo, mem kuda anthey dhaggara ga unnam. 
Happy birthday my gurlll....!😘 💕`
    },
    {
        id: 3,
        name: "lucky",
        message: "From college days to now, some things never change😇. So glad to have you in my corner always. Cheers to many more years! Happie birthday 🎂 "
    },

];

export function FriendVault() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section className="py-12 px-4 max-w-5xl mx-auto min-h-[50vh] relative flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-16"
            >
                <h2 className="text-[#3a2e2f] flex flex-col items-center mb-4">
                    <span className="font-sans text-3xl md:text-5xl font-bold">Personal Vaults</span>
                    <span className="font-scribble text-5xl md:text-7xl text-[#f26d83] transform -rotate-1">Friends</span>
                </h2>
                <p className="font-sans text-xl opacity-75">Click a card to unlock a personal message.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {friends.map((friend) => (
                    <motion.div
                        layoutId={`card-container-${friend.id}`}
                        key={friend.id}
                        onClick={() => setSelectedId(friend.id)}
                        className="bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-3xl shadow-lg cursor-pointer hover:shadow-xl hover:bg-white/80 transition-colors flex flex-col items-center justify-center"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.h3
                            layoutId={`card-title-${friend.id}`}
                            className="font-sans text-3xl font-bold text-[#3a2e2f] text-center"
                        >
                            {friend.name}
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
                                className="bg-[#fcf6e5] w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative pointer-events-auto overflow-y-auto border border-white/50 custom-scrollbar"
                            >
                                <div className="sticky top-0 right-0 flex justify-end z-10 -mr-4 -mt-4">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-[#3a2e2f]" />
                                    </button>
                                </div>

                                {friends.filter(f => f.id === selectedId).map(friend => (
                                    <div key={friend.id} className="flex flex-col items-center">
                                        <motion.h3
                                            layoutId={`card-title-${friend.id}`}
                                            className="font-sans text-4xl md:text-5xl font-bold text-[#3a2e2f] mb-8 text-center"
                                        >
                                            {friend.name}
                                        </motion.h3>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: 0.1, duration: 0.3 }}
                                            className="text-center w-full"
                                        >
                                            <p className="font-scribble text-3xl md:text-5xl text-[#3a2e2f] leading-relaxed whitespace-pre-wrap">
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
