"use client"

import ContactSection from "@/components/custom/contact-section";
import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import PartnerSection from "@/components/custom/partner-section";
import SocialLinks from "@/components/custom/social-links";
import { useSession } from "next-auth/react";
import { FaChessBoard, FaChessKing } from "react-icons/fa";


export default function ContactPage() {
    const { data: session } = useSession()
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header isLoggedIn={!!session} />
            <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12 px-4 border-b-4 border-gold-500">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <FaChessKing className="text-5xl text-gold-500" />
                        <h1 className="text-5xl font-bold tracking-tight">We Chess</h1>
                    </div>
                    <p className="text-xl text-center text-gray-200 mb-6">
                        Strategic Thinking. Infinite Possibilities.
                    </p>
                    <h2 className="text-3xl font-semibold text-center">Contact Us</h2>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Contact Section */}
                    <ContactSection />

                    {/* Partner Section */}
                    <PartnerSection />
                </div>

                {/* Additional Info Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <FaChessBoard className="text-3xl text-gold-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                    </div>

                    <p className="text-gray-700 mb-8 text-lg">
                        At We Chess, we believe that chess is more than just a game—it&apos;s a tool for developing critical thinking,
                        problem-solving skills, and strategic planning. Our mission is to make chess education accessible to everyone,
                        from beginners to advanced players.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="text-gold-600 text-xl">♙</div>
                            <span className="font-medium text-gray-800">Beginner to Advanced Lessons</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="text-gold-600 text-xl">♖</div>
                            <span className="font-medium text-gray-800">Educational Programs</span>
                        </div>
                        {/* <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="text-gold-600 text-xl">♕</div>
                            <span className="font-medium text-gray-800">Tournament Organization</span>
                        </div> */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="text-gold-600 text-xl">♘</div>
                            <span className="font-medium text-gray-800">Training</span>
                        </div>
                    </div>
                </div>

                <SocialLinks />
            </main>

            <Footer variant="training" />
        </div>
    );
}