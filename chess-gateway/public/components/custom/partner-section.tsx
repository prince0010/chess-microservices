"use client"

import { Briefcase, Handshake, Lightbulb, School } from "lucide-react";

export default function PartnerSection() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-8 border border-blue-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-800">
                <Handshake className="text-2xl text-gray-800" />
                <h2 className="text-2xl font-bold text-gray-800">Become a Partner</h2>
            </div>

            <div className="space-y-6">
                <p className="text-gray-700">
                    In case you are an educational institution that would be interested in integration of chess,
                    or you have just a great business proposal, we would be glad to hear from you.
                </p>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border-l-4 border-gray-800">
                    <Briefcase className="text-xl text-gray-800" />
                    <a
                        href="mailto:info@we-chess.com"
                        className="text-lg font-semibold text-gray-800 hover:text-gold-600 transition-colors"
                    >
                        info@we-chess.com
                    </a>
                </div>

                <p className="text-gray-700">
                    We&apos;re always looking for strategic partnerships that can help spread the benefits
                    of chess to more people around the world.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                        <School className="text-xl text-blue-600 group-hover:text-gold-600 transition-colors" />
                        <span className="font-medium text-gray-800 group-hover:text-gray-900">
                            Educational Partnerships
                        </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                        <Lightbulb className="text-xl text-yellow-500 group-hover:text-gold-600 transition-colors" />
                        <span className="font-medium text-gray-800 group-hover:text-gray-900">
                            Business Proposals
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}