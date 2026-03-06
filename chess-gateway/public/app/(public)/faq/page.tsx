// app/faq/page.tsx
"use client"

import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/custom/contact-section";
import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import PartnerSection from "@/components/custom/partner-section";
import SocialLinks from "@/components/custom/social-links";
import { useSession } from "next-auth/react";
import { FaChessBoard, FaChessKing, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, Mail } from "lucide-react";

export default function FAQPage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");

    const faqs = [
        {
            question: "How can I open Puzzle and Endgame stories?",
            answer: "Please finish first the Educational Story."
        },
        {
            question: "How long does it take to complete the Education Story?",
            answer: "For a Grandmaster it takes around 30-40 minutes."
        },
        {
            question: "How do I get Panda points?",
            answer: "Panda points are earned by solving puzzles or winning against the 'bots'."
        },
        {
            question: "How strong do I need to be to complete the Educational Story?",
            answer: "The levels in Educational story are building up. You start with levels for very beginners and the final levels are already club level player."
        },
        {
            question: "Which level do I need to be for Puzzle and Endgame stories?",
            answer: "Club level player+"
        },
        {
            question: "Is it possible to play the We Chess APP on Tablets?",
            answer: "Yes. You can use Android or iOS devices."
        },
        {
            question: "How can I use the We Chess App in the classroom?",
            answer: "Just connect your tablet to the big screen and let the whole classroom enjoy the APP together."
        },
        {
            question: "Does the APP has player vs player mode?",
            answer: "No. You can only play vs bots of different strengths."
        }
    ];

    // Filter FAQs based on search term
    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header isLoggedIn={!!session} />

            <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12 px-4 border-b-4 border-amber-500">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/logo/logo-metatag.png"
                                alt="We Chess Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight">We Chess</h1>
                    </div>
                    <p className="text-xl text-center text-gray-200 mb-6">
                        Strategic Thinking. Infinite Possibilities.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <FaQuestionCircle className="text-3xl text-amber-500" />
                        <h2 className="text-3xl font-semibold text-center">Frequently Asked Questions</h2>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto max-w-4xl px-4 py-12">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* FAQ Count */}
                <div className="text-sm text-gray-600 mb-4 text-center">
                    Showing {filteredFaqs.length} of {faqs.length} questions
                </div>

                {/* FAQ Accordion */}
                {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-3 mb-12">
                        {filteredFaqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-gray-200 rounded-lg overflow-hidden bg-white data-[state=open]:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="px-5 py-4 hover:bg-gray-50 hover:no-underline group">
                                    <div className="flex items-start gap-4 text-left">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-semibold group-hover:bg-amber-200 transition-colors">
                                            {index + 1}
                                        </span>
                                        <span className="text-base font-medium text-gray-900 pr-8">
                                            {faq.question}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5 pt-2 border-t border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-6"></span> {/* Spacer for alignment */}
                                        <div className="flex-1">
                                            <span className="text-amber-600 font-medium mr-2">R/</span>
                                            <span className="text-gray-700">{faq.answer}</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200 mb-12">
                        <FaQuestionCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">No FAQs found matching your search.</p>
                        <Button
                            onClick={() => setSearchTerm("")}
                            variant="outline"
                            className="border-amber-500 text-amber-600 hover:bg-amber-50"
                        >
                            Clear search
                        </Button>
                    </div>
                )}

                {/* Still Have Questions Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <FaChessBoard className="text-3xl text-amber-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Still Have Questions?</h2>
                    </div>

                    <p className="text-gray-700 mb-8 text-lg">
                        Can&apos;t find the answer you&apos;re looking for? Please feel free to contact our support team.
                        We&apos;re here to help you with any questions about We Chess.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-amber-600 text-xl">📚</span>
                            <span className="text-sm font-medium text-gray-800">Educational Stories</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-amber-600 text-xl">🧩</span>
                            <span className="text-sm font-medium text-gray-800">Puzzles & Endgames</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-amber-600 text-xl">🐼</span>
                            <span className="text-sm font-medium text-gray-800">Panda Points</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-amber-600 text-xl">🤖</span>
                            <span className="text-sm font-medium text-gray-800">Bot Training</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-gray-700">
                          
                            <span className="text-gray-500">Email Us at: </span>
                            <a
                                href="mailto:info@we-chess.com?subject=FAQ Support Request&body=Hello, I have a question about..."
                                className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 p-3 rounded-md text-gray-50 hover:text-amber-700 font-medium transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span>info@we-chess.com</span>
                            </a>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        Already have an account? Include your registered email for faster support.
                    </p>
                </div>

                <SocialLinks />
            </main>

            <Footer variant="training" />
        </div>
    );
}