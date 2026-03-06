"use client"

import { useState, useEffect } from 'react';
import {
    FaTimes, FaGlobe, FaChessKing, FaDownload,
    FaCheckCircle, FaTrophy, FaAward, FaCrown, FaStar,
    FaUser, FaFileAlt, FaMedal, FaSpinner, FaExclamationTriangle,
    FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFile,
    FaStarHalf, FaRegStar
} from 'react-icons/fa';
import { Button } from '../ui/button';
import BookingModal from './booking-modal';
import Image from 'next/image';
import { useFetchCoachReviews } from '@/modules/review/hooks';
import { format } from 'date-fns';

export interface Coach {
    id: string;
    name: string;
    title: string;
    chessTitle?: string;
    achievements?: string[];
    languages: string[];
    image: string;
    email?: string;
    fideId?: string;
    phone?: string;
    price?: number;
    currency?: string;
    description?: string;
    attachment?: string;
}

interface CoachModalProps {
    coach: Coach;
    isOpen: boolean;
    onClose: () => void;
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
    };
}

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string = 'USD'): string => {
    const symbols: Record<string, string> = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥',
        'AUD': 'A$', 'CAD': 'C$', 'CHF': 'Fr', 'HKD': 'HK$', 'SGD': 'S$',
        'KRW': '₩', 'INR': '₹',
    };
    return symbols[currency] || currency;
};

const getChessTitleInfo = (title: string) => {
    if (!title) return null;
    const upperTitle = title.toUpperCase();

    const titleMap: Record<string, { icon: any; color: string; bgColor: string; label: string; fullLabel: string }> = {
        'WORLD_CHAMPION': { icon: FaCrown, color: "text-amber-700", bgColor: "bg-amber-50", label: "World Champion", fullLabel: "World Chess Champion" },
        'GRANDMASTER': { icon: FaTrophy, color: "text-red-700", bgColor: "bg-red-50", label: "GM", fullLabel: "Grandmaster (GM)" },
        'WOMAN_GRANDMASTER': { icon: FaTrophy, color: "text-pink-700", bgColor: "bg-pink-50", label: "WGM", fullLabel: "Woman Grandmaster (WGM)" },
        'INTERNATIONAL_MASTER': { icon: FaAward, color: "text-blue-700", bgColor: "bg-blue-50", label: "IM", fullLabel: "International Master (IM)" },
        'WOMAN_INTERNATIONAL_MASTER': { icon: FaAward, color: "text-purple-700", bgColor: "bg-purple-50", label: "WIM", fullLabel: "Woman International Master (WIM)" },
        'FIDE_MASTER': { icon: FaStar, color: "text-green-700", bgColor: "bg-green-50", label: "FM", fullLabel: "FIDE Master (FM)" },
        'WOMAN_FIDE_MASTER': { icon: FaStar, color: "text-teal-700", bgColor: "bg-teal-50", label: "WFM", fullLabel: "Woman FIDE Master (WFM)" },
        'CANDIDATE_MASTER': { icon: FaStar, color: "text-orange-700", bgColor: "bg-orange-50", label: "CM", fullLabel: "Candidate Master (CM)" },
        'WOMAN_CANDIDATE_MASTER': { icon: FaStar, color: "text-amber-700", bgColor: "bg-amber-50", label: "WCM", fullLabel: "Woman Candidate Master (WCM)" },
    };
    return titleMap[upperTitle] || { icon: FaChessKing, color: "text-gray-700", bgColor: "bg-gray-50", label: title, fullLabel: title };
};

// Helper to get achievement style
const getAchievementStyle = (achievement: string) => {
    const lower = achievement.toLowerCase();
    if (lower.includes('champion') || lower.includes('winner'))
        return { icon: FaTrophy, bgColor: "bg-amber-50 text-amber-800 border-amber-200" };
    if (lower.includes('grandmaster') || lower.includes('gm'))
        return { icon: FaCrown, bgColor: "bg-purple-50 text-purple-800 border-purple-200" };
    if (lower.includes('master'))
        return { icon: FaMedal, bgColor: "bg-blue-50 text-blue-800 border-blue-200" };
    if (lower.includes('fide'))
        return { icon: FaStar, bgColor: "bg-indigo-50 text-indigo-800 border-indigo-200" };
    if (lower.includes('international'))
        return { icon: FaGlobe, bgColor: "bg-cyan-50 text-cyan-800 border-cyan-200" };
    return { icon: FaAward, bgColor: "bg-gray-50 text-gray-800 border-gray-200" };
};

// Helper to detect file type from URL or filename
const getFileInfo = (url: string | undefined) => {
    if (!url) return { type: 'unknown', icon: FaFile, label: 'File' };

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('.pdf') || lowerUrl.includes('application/pdf') || lowerUrl.includes('raw/upload')) {
        return { type: 'pdf', icon: FaFilePdf, label: 'PDF Document', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    if (lowerUrl.includes('.doc') || lowerUrl.includes('application/msword') || lowerUrl.includes('.docx')) {
        return { type: 'word', icon: FaFileWord, label: 'Word Document', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
    if (lowerUrl.includes('.xls') || lowerUrl.includes('application/vnd.ms-excel') || lowerUrl.includes('.xlsx')) {
        return { type: 'excel', icon: FaFileExcel, label: 'Excel Spreadsheet', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
    if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif')) {
        return { type: 'image', icon: FaFileImage, label: 'Image File', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    }

    return { type: 'unknown', icon: FaFile, label: 'Document File', color: 'text-gray-600', bgColor: 'bg-gray-50' };
};

// Helper to render star ratings
const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FaStarHalf key={i} className="text-yellow-400 w-4 h-4" />);
        } else {
            stars.push(<FaRegStar key={i} className="text-gray-300 w-4 h-4" />);
        }
    }
    return stars;
};

export default function CoachModal({ coach, isOpen, onClose }: CoachModalProps) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState<'details' | 'cv' | 'reviews'>('details');
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [isLoadingPdf, setIsLoadingPdf] = useState(true);
    const [isValidPdf, setIsValidPdf] = useState(true);
    const [fileVerified, setFileVerified] = useState(false);
    const [fileInfo, setFileInfo] = useState<{ type: string; contentType?: string }>({ type: 'unknown' });
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Fetch reviews for this coach
    const { data: reviewsData, loading: reviewsLoading } = useFetchCoachReviews(coach.id);

    const chessTitleInfo = coach.chessTitle ? getChessTitleInfo(coach.chessTitle) : null;
    const currencySymbol = getCurrencySymbol(coach.currency);
    const hasAchievements = coach.achievements && coach.achievements.length > 0;

    const reviews = reviewsData?.fetchCoachReviews || [];
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    // Check if attachment exists and is a valid URL
    const hasValidAttachment = coach.attachment &&
        typeof coach.attachment === 'string' &&
        coach.attachment.trim() !== '' &&
        (coach.attachment.startsWith('http') || coach.attachment.startsWith('/'));

    const fileTypeInfo = getFileInfo(coach.attachment);

    // Verify file type when CV tab is opened
    useEffect(() => {
        if (activeTab === 'cv' && hasValidAttachment && !fileVerified && coach.attachment) {
            setIsLoadingPdf(true);
            setPdfError(null);

            // Verify content type before rendering
            fetch(coach.attachment, { method: 'HEAD' })
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    console.log('File Content-Type:', contentType);

                    setFileInfo({
                        type: fileTypeInfo.type,
                        contentType: contentType || 'unknown'
                    });

                    // Check if it's actually a PDF
                    if (contentType?.includes('pdf') || fileTypeInfo.type === 'pdf') {
                        setIsValidPdf(true);
                        setFileVerified(true);
                    } else {
                        setIsValidPdf(false);
                        setPdfError(`File is not a valid PDF (Type: ${contentType || 'unknown'})`);
                        setFileVerified(true);
                    }
                })
                .catch(err => {
                    console.error('Error checking file:', err);
                    setPdfError("Could not verify file type. The file might be unavailable.");
                    setIsValidPdf(false);
                })
                .finally(() => {
                    setIsLoadingPdf(false);
                });
        }
    }, [activeTab, hasValidAttachment, fileVerified, fileTypeInfo.type, coach.attachment]);

    const handlePdfLoad = () => {
        console.log('PDF loaded successfully');
        setIsLoadingPdf(false);
        setIsValidPdf(true);
    };

    const handlePdfError = (e: any) => {
        console.error('PDF failed to load:', e);
        console.error('Attempted URL:', coach.attachment);

        if (!coach.attachment) return;

        fetch(coach.attachment, { method: 'HEAD' })
            .then(response => {
                const contentType = response.headers.get('content-type');
                const contentLength = response.headers.get('content-length');
                console.log('Failed PDF - Content-Type:', contentType);
                console.log('Failed PDF - Content-Length:', contentLength);

                if (!contentType?.includes('pdf')) {
                    setPdfError(`File is not a PDF (Content-Type: ${contentType || 'unknown'})`);
                } else {
                    setPdfError("PDF failed to load in preview. The file might be corrupted.");
                }
            })
            .catch(err => {
                console.error('Error checking failed PDF:', err);
                setPdfError("Unable to load PDF preview. The file might be blocked or unavailable.");
            });

        setIsLoadingPdf(false);
        setIsValidPdf(false);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                    >
                        <FaTimes className="text-lg" />
                    </button>

                    {/* Main Content - Fixed height grid */}
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side - Image - Fixed width */}
                        <div className="lg:w-2/5 relative flex-shrink-0 h-[40vh] lg:h-full">
                            <div className="relative h-full w-full">
                                <Image
                                    src={coach.image}
                                    alt={coach.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    onError={(e) => {
                                        if (e.currentTarget.src !== '/api/placeholder/800/800') {
                                            e.currentTarget.src = '/api/placeholder/800/800';
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                {/* Mobile: Image overlay content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:hidden">
                                    <h2 className="text-xl font-semibold mb-2">{coach.name}</h2>
                                    {chessTitleInfo && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`p-1 rounded ${chessTitleInfo.bgColor}`}>
                                                <chessTitleInfo.icon className={`w-3.5 h-3.5 ${chessTitleInfo.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-white/90">
                                                {chessTitleInfo.fullLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop: Image overlay content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white hidden lg:block">
                                    <h2 className="text-xl font-semibold mb-2">{coach.name}</h2>
                                    {chessTitleInfo && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`p-1 rounded ${chessTitleInfo.bgColor}`}>
                                                <chessTitleInfo.icon className={`w-3.5 h-3.5 ${chessTitleInfo.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-white/90">
                                                {chessTitleInfo.fullLabel}
                                            </span>
                                        </div>
                                    )}
                                    {coach.price && coach.price > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-white/70">Hourly rate</span>
                                                <div className="flex items-baseline">
                                                    <span className="text-lg font-semibold text-white">
                                                        {currencySymbol}{coach.price.toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-white/70 ml-1">/hr</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {coach.fideId && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <FaCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs text-white/80">FIDE ID: <span className='underline underline-offset-2'>{coach.fideId}</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Top Badge */}
                                {chessTitleInfo && (
                                    <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full ${chessTitleInfo.bgColor} shadow-sm`}>
                                        <span className={`text-xs font-medium ${chessTitleInfo.color}`}>
                                            {chessTitleInfo.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Content with fixed height */}
                        <div className="lg:w-3/5 flex flex-col bg-gray-50 h-[50vh] lg:h-full">
                            {/* Mobile Header */}
                            <div className="lg:hidden p-6 pb-0 flex-shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{coach.name}</h2>
                                        {chessTitleInfo && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`p-1 rounded ${chessTitleInfo.bgColor}`}>
                                                    <chessTitleInfo.icon className={`w-3 h-3 ${chessTitleInfo.color}`} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">
                                                    {chessTitleInfo.fullLabel}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {coach.price && coach.price > 0 && (
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500">Rate</span>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {currencySymbol}{coach.price.toFixed(2)}
                                                <span className="text-xs text-gray-500 ml-1">/hr</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {coach.fideId && (
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-xs text-gray-600">FIDE ID: <span className='underline underline-offset-2'>{coach.fideId}</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 bg-white px-6 flex-shrink-0">
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`py-4 text-xs md:text-sm lg:text-sm xl:text-sm font-medium border-b-2 capitalize transition-colors ${activeTab === 'details'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Coach Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('cv')}
                                        className={`py-4 text-xs md:text-sm lg:text-sm xl:text-sm font-medium border-b-2 capitalize transition-colors ${activeTab === 'cv'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        CV & Certifications
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`py-4 text-xs md:text-sm lg:text-sm xl:text-sm font-medium border-b-2 capitalize transition-colors flex items-center gap-2 ${activeTab === 'reviews'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <FaStar className="w-4 h-4" />
                                        Reviews
                                        {reviews.length > 0 && (
                                            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                                                {reviews.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content Area - Fixed height with scrolling */}
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="p-6">
                                    {activeTab === 'details' ? (
                                        <div className="space-y-4">
                                            {/* Rating Summary */}
                                            {reviews.length > 0 && (
                                                <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-gray-900">{averageRating}</span>
                                                        <div className="flex items-center gap-1">
                                                            {renderStars(parseFloat(averageRating))}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Quick Info Grid */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {coach.price && coach.price > 0 && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <span className="text-xs text-gray-500">Hourly Rate</span>
                                                        <p className="text-base md:text-lg lg:text-xl xl:text-xl font-semibold text-gray-900">
                                                            {currencySymbol}{coach.price.toFixed(2)}
                                                            <span className="text-sm text-gray-500 ml-1">/hr</span>
                                                        </p>
                                                    </div>
                                                )}
                                                {coach.fideId && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <span className="text-xs text-gray-500">FIDE ID</span>
                                                        <p className="text-sm font-medium underline underline-offset-2 text-gray-900 mt-1">{coach.fideId}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Languages */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <h4 className="text-xs font-medium text-gray-500 mb-2">Languages</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {coach.languages?.map((lang, i) => (
                                                        <span key={i} className="px-2 py-1 bg-black/80 text-white rounded text-xs">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Chess Title */}
                                            {chessTitleInfo && (
                                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                    <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-2">
                                                        <FaChessKing className="w-3.5 h-3.5" />
                                                        Chess Title
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${chessTitleInfo.bgColor} border`}>
                                                            <chessTitleInfo.icon className="w-3.5 h-3.5" />
                                                            {chessTitleInfo.fullLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Achievements */}
                                            {hasAchievements && (
                                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                    <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-2">
                                                        <FaAward className="w-3.5 h-3.5" />
                                                        Achievements
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {coach.achievements?.map((achievement, i) => {
                                                            const style = getAchievementStyle(achievement);
                                                            return (
                                                                <span key={i} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border ${style.bgColor}`}>
                                                                    <style.icon className="w-3.5 h-3.5" />
                                                                    {achievement}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* About */}
                                            {coach.description && (
                                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                    <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                        <FaUser className="w-3.5 h-3.5" />
                                                        About
                                                    </h4>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{coach.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === 'cv' ? (
                                        <div className="space-y-4">
                                            {hasValidAttachment ? (
                                                <>
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className={`w-10 h-10 ${fileTypeInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                                    <fileTypeInfo.icon className={`w-5 h-5 ${fileTypeInfo.color}`} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className="font-medium text-sm text-gray-900 truncate">Curriculum Vitae</h3>
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {fileTypeInfo.label}
                                                                        </p>
                                                                        {fileInfo.contentType && (
                                                                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 flex-shrink-0">
                                                                                {fileInfo.contentType.split('/')[1] || fileInfo.contentType}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={coach.attachment}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs md:text-sm lg:text-sm xl:text-sm rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                                                            >
                                                                <FaDownload className="w-3 h-3" />
                                                                Download
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* File Preview */}
                                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                                                            <span className="text-xs font-medium text-gray-500">
                                                                {fileTypeInfo.type === 'pdf' ? 'PDF Preview' : 'File Preview'}
                                                            </span>
                                                            <a
                                                                href={coach.attachment}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:underline flex-shrink-0"
                                                            >
                                                                Open in new tab →
                                                            </a>
                                                        </div>

                                                        {fileTypeInfo.type !== 'pdf' && (
                                                            <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
                                                                <p className="text-sm text-amber-800 flex items-center gap-2">
                                                                    <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                                                                    <span>This file cannot be previewed. Please download to view.</span>
                                                                </p>
                                                            </div>
                                                        )}

                                                        {fileTypeInfo.type === 'pdf' && (
                                                            <>
                                                                {isLoadingPdf && (
                                                                    <div className="h-[400px] flex items-center justify-center bg-gray-50">
                                                                        <div className="text-center">
                                                                            <FaSpinner className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                                                                            <p className="text-sm text-gray-500">Loading PDF preview...</p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {!isValidPdf && !isLoadingPdf && (
                                                                    <div className="h-[400px] flex items-center justify-center bg-gray-50">
                                                                        <div className="text-center max-w-md px-4">
                                                                            <FaExclamationTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                                                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Preview Unavailable</h4>
                                                                            <p className="text-xs text-gray-500 mb-4">
                                                                                {pdfError || "Unable to display PDF preview."}
                                                                            </p>
                                                                            <div className="flex gap-2 justify-center">
                                                                                <a
                                                                                    href={coach.attachment}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                                                                >
                                                                                    <FaDownload className="w-4 h-4" />
                                                                                    Download PDF
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {isValidPdf && !isLoadingPdf && (
                                                                    <iframe
                                                                        src={`${coach.attachment}#toolbar=0&navpanes=0&view=FitH`}
                                                                        className="w-full h-[400px]"
                                                                        title={`${coach.name}'s CV`}
                                                                        onLoad={handlePdfLoad}
                                                                        onError={handlePdfError}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                                    <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">No CV Available</h4>
                                                    <p className="text-xs text-gray-500">
                                                        This coach hasn`&apos;`t uploaded their CV yet.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Reviews Tab - Scrollable */
                                        <div className="space-y-4">
                                            {reviewsLoading ? (
                                                <div className="flex justify-center py-8">
                                                    <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
                                                </div>
                                            ) : reviews.length === 0 ? (
                                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                                    <FaStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                                                    <p className="text-xs text-gray-500">
                                                        This coach hasn`&apos;t received any reviews yet.
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-0 z-10">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-gray-900">Student Reviews</h3>
                                                                <p className="text-xs text-gray-500">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-center gap-1 justify-end">
                                                                    <span className="text-md font-bold text-gray-900">{averageRating}</span>
                                                                    <span className="text-xs text-gray-500">/5</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    {renderStars(parseFloat(averageRating))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Scrollable Reviews List */}
                                                    <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                                                        {reviews.map((review: Review) => (
                                                            <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-4">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                                                                            <FaUser className="w-4 h-4 text-gray-600" />
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-xs md:text-sm lg:text-sm xl:text-sm text-gray-900">
                                                                                {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}
                                                                            </span>
                                                                            <div className="flex items-center gap-1 mt-1">
                                                                                {renderStars(review.rating)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">
                                                                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-700 mt-2 ml-10">
                                                                    {review.comment}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    {coach.price && coach.price > 0 && (
                                        <div className="hidden lg:block">
                                            <span className="text-xs text-gray-500">Rate</span>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {currencySymbol}{coach.price.toFixed(2)}<span className="text-sm text-gray-500 ml-1">/hr</span>
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 lg:py-2 text-base lg:text-sm"
                                    >
                                        Book a Session
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                coach={{ id: coach.id, name: coach.name, price: coach.price, currency: coach.currency }}
                onBookingComplete={(details) => console.log('Booking completed:', details)}
            />
        </div>
    );
}