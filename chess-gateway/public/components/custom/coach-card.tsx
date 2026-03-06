"use client"

import { FaGlobe, FaCheckCircle, FaChessBoard, FaChessKnight, FaTrophy, FaAward, FaCrown, FaStar, FaMedal, FaGraduationCap } from 'react-icons/fa';
import { ChessTitle } from '@/modules/coach/interface';
import Image from 'next/image';
import { useState } from 'react';

interface CoachCardProps {
    coach: {
        id: string;
        name: string;
        languages: string[];
        image: string;
        email?: string;
        fideId?: string;
        chessTitle?: string;
        price?: number;
        currency?: string;
        achievements?: string[];
        attachment?: string;
    };
    onViewDetails: () => void;
}

// Helper to safely convert string to ChessTitle
const stringToChessTitle = (title: string): ChessTitle => {
    if (!title) return ChessTitle.NONE;

    const upperTitle = title.toUpperCase();
    if (Object.values(ChessTitle).includes(upperTitle as ChessTitle)) {
        return upperTitle as ChessTitle;
    }

    return ChessTitle.NONE;
};

// Helper function to get chess title icon and color
const getChessTitleInfo = (title: string) => {
    const chessTitleEnum = stringToChessTitle(title);

    switch (chessTitleEnum) {
        case ChessTitle.WORLD_CHAMPION:
            return { icon: FaCrown, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "World Champion", fullLabel: "World Chess Champion" };
        case ChessTitle.GRANDMASTER:
            return { icon: FaTrophy, color: "text-red-600", bgColor: "bg-red-50", label: "GM", fullLabel: "Grandmaster (GM)" };
        case ChessTitle.WOMAN_GRANDMASTER:
            return { icon: FaTrophy, color: "text-pink-600", bgColor: "bg-pink-50", label: "WGM", fullLabel: "Woman Grandmaster (WGM)" };
        case ChessTitle.INTERNATIONAL_MASTER:
            return { icon: FaAward, color: "text-blue-600", bgColor: "bg-blue-50", label: "IM", fullLabel: "International Master (IM)" };
        case ChessTitle.WOMAN_INTERNATIONAL_MASTER:
            return { icon: FaAward, color: "text-purple-600", bgColor: "bg-purple-50", label: "WIM", fullLabel: "Woman International Master (WIM)" };
        case ChessTitle.FIDE_MASTER:
            return { icon: FaStar, color: "text-green-600", bgColor: "bg-green-50", label: "FM", fullLabel: "FIDE Master (FM)" };
        case ChessTitle.WOMAN_FIDE_MASTER:
            return { icon: FaStar, color: "text-teal-600", bgColor: "bg-teal-50", label: "WFM", fullLabel: "Woman FIDE Master (WFM)" };
        case ChessTitle.CANDIDATE_MASTER:
            return { icon: FaStar, color: "text-orange-600", bgColor: "bg-orange-50", label: "CM", fullLabel: "Candidate Master (CM)" };
        case ChessTitle.WOMAN_CANDIDATE_MASTER:
            return { icon: FaStar, color: "text-amber-600", bgColor: "bg-amber-50", label: "WCM", fullLabel: "Woman Candidate Master (WCM)" };
        case ChessTitle.ARENA_GRANDMASTER:
            return { icon: FaChessBoard, color: "text-indigo-600", bgColor: "bg-indigo-50", label: "AGM", fullLabel: "Arena Grandmaster (AGM)" };
        case ChessTitle.WOMAN_ARENA_GRANDMASTER:
            return { icon: FaChessBoard, color: "text-violet-600", bgColor: "bg-violet-50", label: "WAGM", fullLabel: "Woman Arena Grandmaster (WAGM)" };
        case ChessTitle.ARENA_INTERNATIONAL_MASTER:
            return { icon: FaChessBoard, color: "text-cyan-600", bgColor: "bg-cyan-50", label: "AIM", fullLabel: "Arena International Master (AIM)" };
        case ChessTitle.WOMAN_ARENA_INTERNATIONAL_MASTER:
            return { icon: FaChessBoard, color: "text-sky-600", bgColor: "bg-sky-50", label: "WAIM", fullLabel: "Woman Arena International Master (WAIM)" };
        case ChessTitle.ARENA_FIDE_MASTER:
            return { icon: FaChessBoard, color: "text-emerald-600", bgColor: "bg-emerald-50", label: "AFM", fullLabel: "Arena FIDE Master (AFM)" };
        case ChessTitle.WOMAN_ARENA_FIDE_MASTER:
            return { icon: FaChessBoard, color: "text-lime-600", bgColor: "bg-lime-50", label: "WAFM", fullLabel: "Woman Arena FIDE Master (WAFM)" };
        default:
            return null;
    }
};

const getAchievementIcon = (achievement: string) => {
    const lower = achievement.toLowerCase();
    if (lower.includes('champion') || lower.includes('winner')) return FaTrophy;
    if (lower.includes('grandmaster') || lower.includes('gm')) return FaCrown;
    if (lower.includes('master')) return FaMedal;
    if (lower.includes('fide')) return FaStar;
    if (lower.includes('international')) return FaGlobe;
    if (lower.includes('experience') || lower.includes('years')) return FaAward;
    if (lower.includes('student') || lower.includes('taught')) return FaGraduationCap;
    if (lower.includes('tournament')) return FaTrophy;
    return FaAward;
};

const getAchievementColor = (achievement: string): string => {
    const lower = achievement.toLowerCase();
    if (lower.includes('champion') || lower.includes('winner')) return "bg-amber-100 text-amber-800 border-amber-200";
    if (lower.includes('grandmaster') || lower.includes('gm')) return "bg-purple-100 text-purple-800 border-purple-200";
    if (lower.includes('master')) return "bg-blue-100 text-blue-800 border-blue-200";
    if (lower.includes('fide')) return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (lower.includes('international')) return "bg-cyan-100 text-cyan-800 border-cyan-200";
    if (lower.includes('experience') || lower.includes('years')) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (lower.includes('student') || lower.includes('taught')) return "bg-teal-100 text-teal-800 border-teal-200";
    return "bg-orange-500 text-white border-orange-200";
};

// Get currency symbol
const getCurrencySymbol = (currency: string = 'USD'): string => {
    const symbols: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CNY': '¥',
        'AUD': 'A$',
        'CAD': 'C$',
        'CHF': 'Fr',
        'HKD': 'HK$',
        'SGD': 'S$',
        'KRW': '₩',
        'INR': '₹',
    };
    return symbols[currency] || currency;
};

export default function CoachCard({ coach, onViewDetails }: CoachCardProps) {
    const [imageError, setImageError] = useState(false);

    // Only show title info if chessTitle exists and is not NONE
    const showChessTitle = coach.chessTitle &&
        coach.chessTitle !== ChessTitle.NONE &&
        coach.chessTitle !== 'NONE' &&
        coach.chessTitle.trim() !== '';

    const titleInfo = showChessTitle ? getChessTitleInfo(coach.chessTitle as ChessTitle) : null;
    const currencySymbol = getCurrencySymbol(coach.currency);

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            {/* Image Container - Optimized for full visibility */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 overflow-hidden">
                {coach.image && !imageError ? (
                    <>
                        <Image
                            src={coach.image}
                            alt={coach.name}
                            fill
                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            onError={() => setImageError(true)}
                            priority={false}
                        />
                        {/* Subtle overlay for better badge visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <FaChessKnight className="text-6xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">{coach.name}</span>
                    </div>
                )}

                {/* Title Badge - Left Side */}
                {titleInfo && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-md ${titleInfo.bgColor} border border-white/50 backdrop-blur-sm`}>
                            <titleInfo.icon className={`w-3.5 h-3.5 ${titleInfo.color}`} />
                            <span className={`text-xs font-bold ${titleInfo.color}`}>
                                {titleInfo.label}
                            </span>
                        </div>
                    </div>
                )}

                {/* FIDE ID Badge - Right Side */}
                {coach.fideId && (
                    <div className="absolute top-3 right-3 z-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-md border border-gray-200">
                            <FaCheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            <span className="text-xs font-semibold text-gray-800">
                                FIDE {coach.fideId}
                            </span>
                        </div>
                    </div>
                )}

                {/* Price Badge - Bottom Right (when no FIDE ID) */}
                {coach.price && coach.price > 0 && !coach.fideId && (
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm shadow-md border border-gray-200">
                            <span className="text-sm font-bold text-gray-900">
                                {currencySymbol}{coach.price}
                            </span>
                            <span className="text-xs text-gray-600 ml-1">/hr</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Coach Details */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Name and Title */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{coach.name}</h3>
                    {titleInfo && (
                        <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-medium ${titleInfo.color}`}>
                                {titleInfo.fullLabel || titleInfo.label}
                            </span>
                        </div>
                    )}
                </div>

                {/* Price (if not shown in image) */}
                {coach.price && coach.price > 0 && coach.fideId && (
                    <div className="mb-3 flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <span className="text-xs font-medium text-gray-600">Hourly rate</span>
                        <div className="flex items-baseline">
                            <span className="text-lg font-bold text-gray-900">
                                {currencySymbol}{coach.price}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">/hr</span>
                        </div>
                    </div>
                )}

                {/* Achievements/Highlights */}
                {coach.achievements && coach.achievements.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <FaAward className="text-amber-500 w-3.5 h-3.5" />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Highlights</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {coach.achievements.slice(0, 3).map((achievement, index) => {
                                const Icon = getAchievementIcon(achievement);
                                const colorClass = getAchievementColor(achievement);
                                return (
                                    <span
                                        key={index}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span className="truncate max-w-[120px]">{achievement}</span>
                                    </span>
                                );
                            })}
                            {coach.achievements.length > 3 && (
                                <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                                    +{coach.achievements.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Languages */}
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <FaGlobe className="text-gray-400 w-3.5 h-3.5" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {coach.languages?.length > 0 ? (
                            coach.languages.slice(0, 3).map((lang, index) => (
                                <span
                                    key={index}
                                    className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                                >
                                    {lang}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400 italic">Not specified</span>
                        )}
                        {coach.languages?.length > 3 && (
                            <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                                +{coach.languages.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-3">
                    <button
                        onClick={onViewDetails}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaChessBoard className="w-4 h-4" />
                        View Full Profile
                    </button>
                </div>

                {/* Footer Stats */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-gray-600">
                            {coach.fideId && (
                                <div className="flex items-center gap-1">
                                    <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
                                    <span className="font-medium">FIDE Verified</span>
                                </div>
                            )}
                            {!coach.fideId && coach.price && coach.price > 0 && (
                                <div className="flex items-center gap-1">
                                    <FaCheckCircle className="text-blue-500 w-3.5 h-3.5" />
                                    <span className="font-medium">Certified</span>
                                </div>
                            )}
                        </div>
                        {coach.achievements && coach.achievements.length > 0 && (
                            <div className="flex items-center gap-1 text-gray-600">
                                <FaAward className="text-amber-500 w-3.5 h-3.5" />
                                <span className="font-medium">{coach.achievements.length} awards</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}