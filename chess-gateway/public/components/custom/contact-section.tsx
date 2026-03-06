"use client"

import { MessageCircle, Plane } from 'lucide-react';
import Link from 'next/link';

export default function ContactSection() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gold-500">
                <MessageCircle className="text-2xl text-gold-600" />
                <h2 className="text-2xl font-bold text-gray-800">We Chess Contact</h2>
            </div>

            <div className="space-y-6">
                <p className="text-gray-700">
                    Please contact us over the email address below for any questions, feedback, or support:
                </p>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-gold-500">
                    <Plane className="text-xl text-blue-700" />
                    <a
                        href="mailto:info@we-chess.com"
                        className="text-lg font-semibold text-blue-800 hover:text-gold-600 transition-colors"
                    >
                        info@we-chess.com
                    </a>
                </div>

                <p className="text-gray-700 ">
                    For more information please visit the{' '}
                    <Link
                        href="/faq"
                        className="text-blue-500 cursor-pointer underline underline-offset-2 font-semibold hover:text-blue-700 transition-all"
                    >
                        FAQ Section
                    </Link>
                    , or check us out on our social media channels:
                </p>
            </div>
        </div>
    );
}