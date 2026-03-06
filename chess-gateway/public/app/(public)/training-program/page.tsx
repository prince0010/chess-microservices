"use client"

import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, GraduationCap, UsersRound, School, BookOpen, Target, Timer, UserCheck, Brain, Shield, GamepadIcon, Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { easeInOut, motion, spring } from "framer-motion";

export default function TrainingProgramPage() {
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

    const cardHover = {
        whileHover: {
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { type: spring, stiffness: 300, damping: 20 }
        }
    };

    const floatAnimation = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: easeInOut
            }
        }
    };

    const rotateAnimation = {
        animate: {
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: easeInOut
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-white to-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header isLoggedIn={!!session} />

            <section className="relative py-16 px-4 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                    animate={{
                        opacity: [0.5, 0.7, 0.5],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-sm font-medium">Training Program</span>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            We Chess Training Program
                        </motion.h1>
                    </div>

                    {/* First paragraph */}
                    <motion.div
                        className="mb-12"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                            whileHover={{ boxShadow: "0 25px 30px -12px rgba(0, 0, 0, 0.15)" }}
                        >
                            <p className="text-lg text-gray-700 leading-relaxed text-center">
                                The We Chess training program is a perfect fit for any school, chess clubs etc who are looking for a standardized chess education. By having the APP-Student-Coach-Student educational solution.
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Key Feature Card */}
                        <motion.div
                            variants={fadeInLeft}
                            {...cardHover}
                        >
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-l-4 border-amber-400 shadow-lg h-full">
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        className="bg-amber-100 p-3 rounded-lg"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <UsersRound className="w-6 h-6 text-amber-600" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl mb-4">Key Feature</h3>
                                        <p className="text-gray-700">
                                            You do not need to be a chess player to become a chess coach. We provide you with all the learning materials. You might literally not know the names of the chess pieces—and still be able to provide a &quot;school chess lesson&quot;.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* GM-Designed Excellence Card */}
                        <motion.div
                            variants={fadeInRight}
                            {...cardHover}
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border-l-4 border-blue-400 shadow-lg h-full">
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        className="bg-blue-100 p-3 rounded-lg"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <Crown className="w-6 h-6 text-blue-600" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl mb-4">GM-Designed Excellence</h3>
                                        <p className="text-gray-700">
                                            Because the training program been made by Chess GMs, we can ensure the most time efficient improvement and to achieve this target—we use modern technologies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: Rules and CTA */}
            <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Built on Simple, Powerful Rules
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Logo and Rules */}
                        <motion.div
                            className="space-y-8"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div
                                className="text-center"
                                variants={fadeInUp}
                            >
                                <motion.div
                                    className="relative w-48 h-48 mx-auto mb-6"
                                    {...floatAnimation}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"></div>
                                    <div className="relative w-full h-full p-8">
                                        <Image
                                            src="/logo/logo-metatag.png"
                                            alt="We Chess Logo"
                                            fill
                                            className="object-contain drop-shadow-lg"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="space-y-4"
                                variants={staggerContainer}
                            >
                                {[
                                    { text: "Learning by having fun", icon: <GamepadIcon className="w-5 h-5 text-emerald-500" /> },
                                    { text: "Strong practical approach", icon: <Target className="w-5 h-5 text-blue-500" /> },
                                    { text: "Learn in a most time efficient way", icon: <Timer className="w-5 h-5 text-purple-500" /> },
                                    { text: "Get a guidance from professional chess Grandmaster coaches.", icon: <UserCheck className="w-5 h-5 text-amber-500" /> }
                                ].map((rule, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                        variants={fadeInLeft}
                                        whileHover={{ x: 5 }}
                                    >
                                        <motion.div
                                            className="bg-gray-50 p-2 rounded-lg"
                                            whileHover={{ rotate: 5 }}
                                        >
                                            {rule.icon}
                                        </motion.div>
                                        <div className="flex-1 flex items-start gap-3">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            </motion.div>
                                            <span className="text-gray-800 font-medium">{rule.text}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right: CTA Section */}
                        <motion.div
                            className="space-y-8"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div
                                className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-300 shadow-lg"
                                variants={fadeInRight}
                                whileHover={{ boxShadow: "0 25px 30px -12px rgba(245, 158, 11, 0.25)" }}
                            >
                                <motion.p
                                    className="text-xl font-semibold text-gray-900 text-center mb-8"
                                    variants={fadeInUp}
                                >
                                    Download the We Chess APP or visit Find a coach as your entry to new heights of chess mastery.
                                </motion.p>

                                <motion.div
                                    className="space-y-6"
                                    variants={staggerContainer}
                                >
                                    {/* App Store Button */}
                                    <motion.a
                                        href={appStoreLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-black hover:bg-gray-900 text-white w-full py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={fadeInUp}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="w-8 h-8"
                                                whileHover={{ rotate: 5 }}
                                            >
                                                <Image
                                                    src="/img/download/appstore.svg"
                                                    alt="App Store"
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full"
                                                />
                                            </motion.div>
                                            <div className="text-left">
                                                <div className="text-xs opacity-80">Download on the</div>
                                                <div className="text-lg font-bold">App Store</div>
                                            </div>
                                        </div>
                                    </motion.a>

                                    {/* Google Play Button */}
                                    <motion.a
                                        href={playStoreLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] hover:from-[#0B8C4F] hover:to-[#185ABC] text-white w-full py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        variants={fadeInUp}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                className="w-8 h-8"
                                                whileHover={{ rotate: -5 }}
                                            >
                                                <Image
                                                    src="/img/download/playstore.svg"
                                                    alt="Google Play"
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full"
                                                />
                                            </motion.div>
                                            <div className="text-left">
                                                <div className="text-xs opacity-90">Get it on</div>
                                                <div className="text-lg font-bold">Google Play</div>
                                            </div>
                                        </div>
                                    </motion.a>
                                </motion.div>

                                <motion.p
                                    className="text-center text-amber-700 text-sm mt-6 font-medium"
                                    variants={fadeInUp}
                                >
                                    Available on iOS, Android
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Download CTA Section */}
            <motion.section
                className="py-20 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Top Wave */}
                <motion.div
                    className="absolute top-0 left-0 w-full overflow-hidden leading-none"
                    initial={{ y: -100 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff" fillOpacity="0.1"></path>
                    </svg>
                </motion.div>

                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Transform Chess Education?
                    </motion.h2>

                    <motion.p
                        className="text-xl opacity-95 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Join schools and clubs worldwide using our GM-designed training program
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {/* App Store Button */}
                        <motion.a
                            href={appStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white py-4 px-8 rounded-xl shadow-lg transition-all hover:scale-105"
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            variants={fadeInUp}
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-10 h-10"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <Image
                                        src="/img/download/appstore.svg"
                                        alt="App Store"
                                        width={40}
                                        height={40}
                                        className="w-full h-full"
                                    />
                                </motion.div>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Download on the</div>
                                    <div className="text-xl font-bold">App Store</div>
                                </div>
                            </div>
                        </motion.a>

                        {/* Google Play Store Button */}
                        <motion.a
                            href={playStoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] hover:from-[#0B8C4F] hover:to-[#185ABC] text-white py-4 px-8 rounded-xl shadow-lg transition-all hover:scale-105"
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            variants={fadeInUp}
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-10 h-10"
                                    whileHover={{ rotate: -5 }}
                                >
                                    <Image
                                        src="/img/download/playstore.svg"
                                        alt="Google Play"
                                        width={40}
                                        height={40}
                                        className="w-full h-full"
                                    />
                                </motion.div>
                                <div className="text-left">
                                    <div className="text-xs opacity-90">Get it on</div>
                                    <div className="text-xl font-bold">Google Play</div>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>

                    <motion.p
                        className="text-sm opacity-95 mt-8 pt-8 border-t border-white/30"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Used for a educational institutions worldwide
                    </motion.p>
                </div>
            </motion.section>

            {/* SECTION 3: How It Works */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Simple 3-Step System</span>
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            The APP-Student-Coach-Student Solution
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A revolutionary approach to chess education that works for everyone
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            {
                                step: "1",
                                title: "APP Learning",
                                description: "Interactive, GM-designed lessons on the app",
                                icon: "📱",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                step: "2",
                                title: "Coach Support",
                                description: "Guided instruction with our comprehensive materials",
                                icon: "👨‍🏫",
                                color: "from-indigo-500 to-purple-500"
                            },
                            {
                                step: "3",
                                title: "Student Practice",
                                description: "Apply skills through structured practice",
                                icon: "♟️",
                                color: "from-emerald-500 to-green-500"
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                {...cardHover}
                            >
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                                    <CardContent className="p-8 text-center">
                                        <motion.div
                                            className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6`}
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 4, delay: index * 0.5, repeat: Infinity }}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        <div className="text-sm font-semibold text-gray-500 mb-2">Step {step.step}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECTION 4: Features Grid - WAVY DESIGN */}
            <motion.section
                id="features"
                className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-x-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Top Wave */}
                <motion.div
                    className="absolute top-0 left-0 w-[calc(100%+2rem)] sm:w-full overflow-hidden leading-none"
                    initial={{ y: -100 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 140" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                    </svg>
                </motion.div>

                <div className="relative py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Key Benefits
                            </h2>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Designed for maximum effectiveness and accessibility
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {[
                                {
                                    icon: <Timer className="w-8 h-8 text-blue-600" />,
                                    title: "Time-Efficient",
                                    description: "Maximum learning in minimum time",
                                    color: "bg-white"
                                },
                                {
                                    icon: <Brain className="w-8 h-8 text-purple-600" />,
                                    title: "GM-Designed",
                                    description: "Curriculum by chess experts",
                                    color: "bg-white"
                                },
                                {
                                    icon: <GamepadIcon className="w-8 h-8 text-emerald-600" />,
                                    title: "Kid-Friendly",
                                    description: "Engaging for ages 5-12",
                                    color: "bg-white"
                                },
                                {
                                    icon: <Shield className="w-8 h-8 text-amber-600" />,
                                    title: "No Experience Needed",
                                    description: "Anyone can teach chess",
                                    color: "bg-white"
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg transition-all"
                                    variants={fadeInUp}
                                    whileHover={{
                                        y: -8,
                                        boxShadow: "0 25px 30px -12px rgba(0, 0, 0, 0.25)"
                                    }}
                                >
                                    <motion.div
                                        className="bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <motion.div
                    className="absolute bottom-0 right-20 w-[calc(100%+20rem)] sm:w-full overflow-hidden leading-none rotate-180"
                    initial={{ y: 100 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 100 1200 270" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                    </svg>
                </motion.div>
            </motion.section>

            {/* SECTION 5: Target Audience */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Perfect For
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Designed to serve diverse educational needs
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: <School className="w-8 h-8" />, label: "Schools", description: "Classroom integration", color: "from-blue-100 to-indigo-100" },
                            { icon: <Users className="w-8 h-8" />, label: "Chess Clubs", description: "Structured learning", color: "from-purple-100 to-pink-100" },
                            { icon: <BookOpen className="w-8 h-8" />, label: "After-School", description: "Enrichment programs", color: "from-emerald-100 to-green-100" },
                            { icon: <GraduationCap className="w-8 h-8" />, label: "Individual", description: "Self-paced learning", color: "from-amber-100 to-orange-100" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow"
                                variants={fadeInUp}
                                whileHover={{ y: -4, boxShadow: "0 15px 20px -10px rgba(0, 0, 0, 0.1)" }}
                            >
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-4`}
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 4, delay: index * 0.3, repeat: Infinity }}
                                >
                                    <div className="text-gray-700">
                                        {item.icon}
                                    </div>
                                </motion.div>
                                <div className="text-lg font-bold text-gray-900 mb-2">{item.label}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Final Download Button */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <p className="text-sm text-gray-500 mt-4">
                            Available on iOS and Android
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer variant="training" />
        </motion.div>
    );
}