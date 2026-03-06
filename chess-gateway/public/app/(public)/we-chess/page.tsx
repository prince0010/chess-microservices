"use client"

import Header from "@/components/custom/header";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles, Zap, Target, Award, CheckCircle2, Users, Trophy, Star, Sparkle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { easeInOut, motion } from "framer-motion";
import Footer from "@/components/custom/footer";

export default function WeChessAppPage() {
    const { data: session } = useSession()
    const appStoreLink = "https://apps.apple.com/app/we-chess/id6756325408";
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.wechess.wechess.prod";

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const pulseAnimation = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: easeInOut
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header isLoggedIn={!!session} />

            {/* Hero Section with animations */}
            <motion.section
                className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
                            "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)"
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="space-y-6"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">We Chess APP</span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
                                variants={fadeInUp}
                            >
                                Experience Chess
                                <br />
                                <motion.span
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
                                    animate={{
                                        backgroundPosition: ['0%', '100%', '0%'],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    style={{ backgroundSize: '200% 200%' }}
                                >
                                    Like Never Before
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                                variants={fadeInUp}
                            >
                                Usually we hear: &quot;Chess is complicated, to learn chess takes a lot of effort and it is boring.&quot;
                                With our We Chess application program it is different! Enjoy every second of the APP and
                                became a better chess player with every level!
                            </motion.p>

                            <motion.p
                                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                                variants={fadeInUp}
                            >
                                It is fun, it is interactive and very addictive. Do not play too much. The chess program
                                is designed by Chess Grandmasters to provide the highest possible learning effect.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="relative flex justify-center lg:justify-end"
                            variants={fadeInRight}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <motion.div
                                className="relative w-72 h-[580px]"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Image
                                    src="/we-chess-app-frame.svg"
                                    alt="We Chess App Preview"
                                    fill
                                    className="object-contain"
                                    priority
                                />

                                <motion.div
                                    className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full blur-2xl opacity-50"
                                    {...pulseAnimation}
                                />
                                <motion.div
                                    className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full blur-2xl opacity-50"
                                    {...pulseAnimation}
                                    transition={{ delay: 1 }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
            {/* Final CTA */}
            <motion.section
                className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white w-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Transform Your Chess Game?
                    </motion.h2>

                    <motion.p
                        className="text-xl opacity-90"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Download now and start your journey!
                    </motion.p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <a
                            href={appStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white h-auto py-4 px-8 rounded-lg transition-all hover:scale-105 shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image
                                        src="/img/download/appstore.svg"
                                        alt="App Store"
                                        width={32}
                                        height={32}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Download on the</div>
                                    <div className="text-xl font-semibold">App Store</div>
                                </div>
                            </div>
                        </a>

                        <a
                            href={playStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] hover:from-[#0B8C4F] hover:to-[#185ABC] text-white h-auto py-4 px-8 rounded-lg transition-all hover:scale-105 shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image
                                        src="/img/download/playstore.svg"
                                        alt="Google Play Store"
                                        width={32}
                                        height={32}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-90">Get it on</div>
                                    <div className="text-xl font-semibold">Google Play</div>
                                </div>
                            </div>
                        </a>
                    </div>

                </div>
            </motion.section>
            {/* Feature Badges Section */}
            <motion.section
                className="py-16 px-4 bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why Players Love We Chess
                    </motion.h2>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: "♟️", title: "GM Designed", description: "Puzzles crafted by Grandmasters" },
                            { icon: <Zap className="w-8 h-8 text-white" />, title: "Fast & Smooth", description: "Lightning fast gameplay" },
                            { icon: <Target className="w-8 h-8 text-white" />, title: "Progressive", description: "Learning that adapts to you" },
                            { icon: <Award className="w-8 h-8 text-white" />, title: "Expert Coaching", description: "Learn from the best" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
                                variants={fadeInUp}
                                whileHover={{ y: -8, boxShadow: "0 25px 30px -12px rgba(251, 146, 60, 0.25)" }}
                            >
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                    {typeof item.icon === 'string' ? (
                                        <span className="text-3xl">{item.icon}</span>
                                    ) : (
                                        item.icon
                                    )}
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* App Features Section */}
            <motion.section
                className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to Master Chess
                        </h2>
                        <p className="text-xl text-gray-600">
                            Packed with features designed by Grandmasters
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            {
                                icon: Crown,
                                title: "GM Designed Lessons",
                                description: "Learn from strategies crafted by international Grandmasters"
                            },
                            {
                                icon: Target,
                                title: "Smart Puzzles",
                                description: "Thousands of puzzles that adapt to your skill level"
                            },
                            {
                                icon: Trophy,
                                title: "Daily Tournaments",
                                description: "Compete with players worldwide in daily challenges"
                            },
                            {
                                icon: Users,
                                title: "Community Games",
                                description: "Play with friends or match with players at your level"
                            },
                            {
                                icon: Award,
                                title: "Progress Tracking",
                                description: "Detailed analytics of your improvement journey"
                            },
                            {
                                icon: CheckCircle2,
                                title: "Achievement System",
                                description: "Earn badges and rewards as you master chess"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="border-2 border-gray-200 hover:border-orange-400 transition-all hover:shadow-xl group h-full">
                                    <CardContent className="p-6 space-y-4">
                                        <motion.div
                                            className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                                            whileHover={{ rotate: 5 }}
                                        >
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Final CTA */}
            <motion.section
                className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Crown className="w-20 h-20 mx-auto" />
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Transform Your Chess Game?
                    </motion.h2>

                    <motion.p
                        className="text-xl opacity-90"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Join thousands of players improving with We Chess. Download now and start your journey!
                    </motion.p>

                    {/* Download buttons - NO FRAMER MOTION HERE */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <a
                            href={appStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white h-auto py-4 px-8 rounded-lg transition-all hover:scale-105 shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image
                                        src="/img/download/appstore.svg"
                                        alt="App Store"
                                        width={32}
                                        height={32}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Download on the</div>
                                    <div className="text-xl font-semibold">App Store</div>
                                </div>
                            </div>
                        </a>

                        <a
                            href={playStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] hover:from-[#0B8C4F] hover:to-[#185ABC] text-white h-auto py-4 px-8 rounded-lg transition-all hover:scale-105 shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image
                                        src="/img/download/playstore.svg"
                                        alt="Google Play Store"
                                        width={32}
                                        height={32}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-90">Get it on</div>
                                    <div className="text-xl font-semibold">Google Play</div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <motion.p
                        className="text-sm opacity-80 pt-4 flex items-center justify-center gap-0.5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex"
                        >
                            <Sparkle className="w-4 h-4" />
                        </motion.span>
                        <span>Free to download • No credit card required • Start learning in minutes</span>
                    </motion.p>
                </div>
            </motion.section>

            {/* Footer with animations */}
            <Footer variant="training" />
        </motion.div>
    );
}