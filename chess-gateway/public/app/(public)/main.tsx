"use client"

import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Download, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { useLottie } from "@/hooks/useLottie";
import Footer from "@/components/custom/footer";
import Link from "next/link";
import { motion, spring } from "framer-motion";

export default function Main() {
  const { data: session } = useSession();
  const downloadSectionRef = useRef<HTMLElement>(null);

  // Initialize panda animation - untouched
  const pandaContainerRef = useLottie({
    path: '/data/panda_happy.json',
    loop: true,
    autoplay: true,
    renderer: 'svg'
  });

  const appStoreLink = "https://apps.apple.com/app/we-chess/id6756325408";
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.wechess.wechess.prod";

  const scrollToDownload = () => {
    downloadSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    whileHover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: spring, stiffness: 300, damping: 20 }
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

      {/* Hero Section with Panda Animation */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="text-center md:text-left lg:text-left xl:text-left space-y-4 sm:space-y-6 order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mx-auto md:mx-0"
                whileHover={{ scale: 1.05, backgroundColor: "#fed7aa" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-md font-medium tracking-wide lg:font-bold xl:font-bold">Welcome to We Chess</span>
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                One smart move
                <br />
                <motion.span
                  className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  at a time
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto md:mx-0 text-center md:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience fun and exciting ways of enjoying the game of chess alone or with your whole family!
                The APP + Grandmaster coaches will guide your experience to new heights!
              </motion.p>

              <motion.div
                className="pt-2 sm:pt-4 flex justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 cursor-pointer to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg px-6 py-4 h-auto w-full sm:w-auto"
                    onClick={scrollToDownload}
                  >
                    📱 We Chess App
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Panda Container - No animations added, just the ref */}
            <div className="relative flex justify-center items-center order-2 md:order-2 mt-8 md:mt-0">
              <div className="w-full max-w-sm md:max-w-md lg:max-w-md mx-auto">
                <div
                  ref={pandaContainerRef}
                  className="w-full h-auto"
                  style={{
                    minHeight: '280px',
                    maxHeight: '700px',
                    width: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Download Section */}
      <motion.section
        id="why-download"
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
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
              Why to download the We Chess APP?
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                emoji: "🎯",
                title: "Fun Learning",
                description: "Became a competitive chess player by having 100% fun and 0% boredom!"
              },
              {
                emoji: "🏫",
                title: "Perfect for Everyone",
                description: "The We Chess APP is designed to be a perfect fit for schools, chess clubs or any other chess lovers."
              },
              {
                emoji: "🚀",
                title: "Start Your Journey",
                description: "Download the APP and start enjoying the game of chess as much as we all do!"
              },
              {
                emoji: "📱",
                title: "Cross Platform",
                description: "Available for iOS and Android. With a special build in function, a dedicated chess board can follow your real time progress."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="whileHover"
              >
                <Card className="border-2 border-gray-200 hover:border-orange-400 transition-all hover:shadow-xl group h-full">
                  <CardContent className="p-6 text-center space-y-4">
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.emoji}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Wave Download Section */}
      <motion.section
        id="download"
        ref={downloadSectionRef}
        className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white overflow-hidden scroll-mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full overflow-hidden leading-none"
          initial={{ y: -100 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </motion.div>

        <div className="relative border-white border-2 py-20 px-4">
          <motion.div
            className="max-w-5xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Download We Chess Now
            </motion.h2>
            <p className="text-xl opacity-90">
              Available on both platforms
            </p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
              variants={staggerContainer}
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* App Store Button */}
              <motion.a
                href={appStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white h-auto py-4 px-8 rounded-lg transition-colors"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3">
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
                    <div className="text-xs">Download on the</div>
                    <div className="text-xl font-semibold">App Store</div>
                  </div>
                </div>
              </motion.a>

              {/* Google Play Store Button */}
              <motion.a
                href={playStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] hover:from-[#0B8C4F] hover:to-[#185ABC] text-white py-2 px-5 rounded-xl shadow-lg transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
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

            <motion.div
              className="flex flex-wrap justify-center gap-6 pt-8"
              variants={staggerContainer}
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: "♟️", text: "GM Designed Puzzles" },
                { icon: "⚡", text: "Fast & Smooth" },
                { icon: "🎯", text: "Progressive Learning" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                  variants={fadeInUp}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave SVG */}
        <motion.div
          className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180"
          initial={{ y: 100 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </motion.div>
      </motion.section>

      {/* Master Section */}
      <motion.section
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Where every move makes a master!
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you are taking your first move or aiming for Grandmaster status - we will help you think deeper,
            plan smarter, and win bigger. Start Your Chess Journey Today!
          </motion.p>
        </div>
      </motion.section>

      {/* Kids Process Section - Text Left, Image Right */}
      <motion.section
        id="programs"
        className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Text */}
            <motion.div
              className="space-y-4 md:space-y-6 order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mx-auto md:mx-0"
                whileHover={{ scale: 1.05 }}
              >
                Kids Process
              </motion.div>

              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Learn Chess the Fun Way!
              </motion.h2>

              <motion.p
                className="text-base md:text-lg text-gray-600 leading-relaxed text-center md:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                At We Chess Strategies, kids aged <strong>5-12</strong> learn chess the fun way! Our Grandmaster-designed lessons
                turn complex strategies into exciting adventures with live coaches, interactive games, and mini-tournaments.
              </motion.p>

              <motion.p
                className="text-base md:text-lg text-gray-600 leading-relaxed text-center md:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                From first moves to checkmate mastery, we nurture confidence and critical thinking—one playful lesson at a time.
              </motion.p>

              <motion.div
                className="pt-2 flex justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r cursor-pointer from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto w-full sm:w-auto"
                  >
                    <Link
                      href="https://www.chess.com/learn-how-to-play-chess"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Know more about it!
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Image Container */}
            <motion.div
              className="relative flex justify-center items-center order-2 md:order-2 mt-8 md:mt-0"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-300 to-amber-300 rounded-3xl blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="relative rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto aspect-square overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 30px 40px -15px rgba(0, 0, 0, 0.3)" }}
              >
                {/* Chess Board Background - Light Brown */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
          linear-gradient(45deg, #d2b48c 25%, transparent 25%),
          linear-gradient(-45deg, #d2b48c 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #d2b48c 75%),
          linear-gradient(-45deg, transparent 75%, #d2b48c 75%)
        `,
                    backgroundSize: '50px 50px',
                    backgroundPosition: '0 0, 0 25px, 25px -25px, -25px 0px',
                    backgroundColor: '#f5e6d3',
                  }}
                />

                {/* Content with semi-transparent background */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] p-4 sm:p-6 md:p-8">
                  <motion.span
                    className="text-4xl md:text-6xl lg:text-7xl break-words text-center text-gray-800 drop-shadow-lg"
                    animate={{
                      rotate: [0, 2, -2, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    ♛ ♜ ♝ ♞ ♟
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
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
            Ready to Become a Chess Master?
          </motion.h2>

          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of students learning from Grandmasters. Download the app and start your journey today!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
            variants={staggerContainer}
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* App Store Button */}
            <motion.a
              href={appStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-orange-600 hover:bg-gray-100 h-auto py-4 px-8 rounded-lg transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
            >
              <div className="flex items-center">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Download className="w-5 h-5 mr-2" />
                </motion.div>
                <span className="font-semibold">Download for iOS</span>
              </div>
            </motion.a>

            <motion.a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white h-auto py-4 px-8 rounded-lg transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
            >
              <div className="flex items-center">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  <Download className="w-5 h-5 mr-2" />
                </motion.div>
                <span className="font-semibold">Download for Android</span>
              </div>
            </motion.a>
          </motion.div>

          <motion.p
            className="text-sm opacity-80 pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            ✨ Free to download • No credit card required • Start learning in minutes
          </motion.p>
        </div>
      </motion.section>

      <Footer variant="training" />
    </motion.div>
  );
}