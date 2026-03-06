'use client';

import { useState, useEffect } from 'react';
import { FaChessKnight, FaSearch, FaFilter, FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import CoachModal from '@/components/custom/coach-modal';
import CoachCard from '@/components/custom/coach-card';
import Header from '@/components/custom/header';
import { FETCH_COACH_TABLE } from '@/modules/coach/queries';
import { useQuery } from '@apollo/client/react';
import Footer from '@/components/custom/footer';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Coach {
    id: string;
    name: string;
    title: string;
    chessTitle?: string;
    showChessTitle?: boolean;
    languages: string[];
    image: string;
    fideId?: string;
    email?: string;
    availability?: string;
    location?: string;
    price?: number;
    currency?: string;
    achievements?: string[];
    attachment?: string;
}


interface FetchCoachTableResponse {
    fetchCoachTable: {
        edges: Array<{
            cursor: string;
            node: {
                _id: string;
                firstName: string;
                lastName: string;
                photo?: string;
                fideId?: string;
                languages: string[];
                hasStudentsOnApp: boolean;
                wantsToBeListed: boolean;
                applicationDate: string;
                experience?: string;
                location?: string;
                fideRating?: number;
                status: string;
                chessTitle?: string;
                price?: number;
                currency?: string;
                achievements?: string[];
            };
        }>;
        pageInfo: {
            total: number;
            hasNextPage: boolean;
            endCursor: string;
        };
    };
}

const getChessTitleDisplayName = (chessTitle: string): string => {
    const titleMap: Record<string, string> = {
        'WORLD_CHAMPION': 'World Champion',
        'GRANDMASTER': 'Grandmaster (GM)',
        'WOMAN_GRANDMASTER': 'Woman Grandmaster (WGM)',
        'INTERNATIONAL_MASTER': 'International Master (IM)',
        'WOMAN_INTERNATIONAL_MASTER': 'Woman International Master (WIM)',
        'FIDE_MASTER': 'FIDE Master (FM)',
        'WOMAN_FIDE_MASTER': 'Woman FIDE Master (WFM)',
        'CANDIDATE_MASTER': 'Candidate Master (CM)',
        'WOMAN_CANDIDATE_MASTER': 'Woman Candidate Master (WCM)',
        'ARENA_GRANDMASTER': 'Arena Grandmaster (AGM)',
        'WOMAN_ARENA_GRANDMASTER': 'Woman Arena Grandmaster (WAGM)',
        'ARENA_INTERNATIONAL_MASTER': 'Arena International Master (AIM)',
        'WOMAN_ARENA_INTERNATIONAL_MASTER': 'Woman Arena International Master (WAIM)',
        'ARENA_FIDE_MASTER': 'Arena FIDE Master (AFM)',
        'WOMAN_ARENA_FIDE_MASTER': 'Woman Arena FIDE Master (WAFM)',
        'NONE': ''
    };
    return titleMap[chessTitle] || '';
};

// Get currency symbol
// const getCurrencySymbol = (currency: string = 'USD'): string => {
//     const symbols: Record<string, string> = {
//         'USD': '$',
//         'EUR': '€',
//         'GBP': '£',
//         'JPY': '¥',
//         'CNY': '¥',
//         'AUD': 'A$',
//         'CAD': 'C$',
//         'CHF': 'Fr',
//         'HKD': 'HK$',
//         'SGD': 'S$',
//         'KRW': '₩',
//         'INR': '₹',
//     };
//     return symbols[currency] || currency;
// };

const transformCoach = (coachData: any): Coach => {
    console.log('🔍 DEBUG transformCoach raw data:', coachData);
    console.log('🔍 DEBUG coachData.chessTitle:', coachData.chessTitle);
    console.log('🔍 DEBUG coachData.price:', coachData.price, coachData.currency);
    console.log('🔍 DEBUG coachData.achievements:', coachData.achievements);
    console.log('🔍 DEBUG coachData.cvFile:', coachData.cvFile); // Add this log

    const getTitle = (chessTitle?: string, fideId?: string, rating?: number) => {
        if (chessTitle && chessTitle !== 'NONE') {
            return getChessTitleDisplayName(chessTitle);
        }

        if (rating && rating >= 2500) return 'Grandmaster';
        if (rating && rating >= 2400) return 'International Master';
        if (rating && rating >= 2300) return 'FIDE Master';
        if (rating && rating >= 2200) return 'Candidate Master';
        if (fideId) return 'FIDE Certified Coach';
        return 'Chess Coach';
    };

    return {
        id: coachData._id || '',
        name: `${coachData.firstName || ''} ${coachData.lastName || ''}`.trim(),
        title: getTitle(coachData.chessTitle, coachData.fideId, coachData.fideRating),
        chessTitle: coachData.chessTitle || '',
        showChessTitle: coachData.chessTitle &&
            coachData.chessTitle !== 'NONE' &&
            coachData.chessTitle !== '',
        languages: coachData.languages || ['English'],
        image: coachData.photo || '/api/placeholder/400/400',
        fideId: coachData.fideId || '',
        email: coachData.email || '',
        availability: 'Available this week',
        location: coachData.location || 'Online',
        price: coachData.price || 0,
        currency: coachData.currency || 'USD',
        achievements: coachData.achievements || [],
        attachment: coachData.cvFile || '', // THIS IS THE KEY LINE - add the CV file URL
    };
};

export default function FindCoachPage() {
    const { data: session } = useSession()
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTitle, setSelectedTitle] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [loading, setLoading] = useState(true);

    const { data, loading: queryLoading, error } = useQuery<FetchCoachTableResponse>(FETCH_COACH_TABLE, {
        variables: {
            first: 100,
            sort: { key: "applicationDate", order: "DESC" },
            filter: [{ key: "status", term: "verified", type: "SELECT" }] // Changed from "active" to "verified"
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (data?.fetchCoachTable?.edges) {
            const coachEdges = data.fetchCoachTable.edges;
            console.log('🔍 DEBUG Raw GraphQL data edges:', coachEdges);

            const coachesData = coachEdges
                .map((edge: any) => {
                    const coach = edge.node;
                    console.log('🔍 DEBUG Individual coach node:', coach);
                    return transformCoach(coach);
                })
                .filter(coach => coach.price && coach.price > 0); // Only show coaches with prices set

            console.log('🔍 DEBUG Transformed coaches with prices:', coachesData);
            setCoaches(coachesData);
            setFilteredCoaches(coachesData);
            setLoading(false);
            console.log(`Loaded ${coachesData.length} verified coaches with prices`);
        } else if (error) {
            console.error('Error fetching coaches:', error);
            setLoading(false);
        } else if (data && !data.fetchCoachTable?.edges) {
            // Handle case where data exists but no edges
            console.log('No verified coaches found');
            setCoaches([]);
            setFilteredCoaches([]);
            setLoading(false);
        }
    }, [data, error]);

    // Filter coaches based on search and filters
    useEffect(() => {
        if (!coaches.length) return;

        let results = coaches;

        // Search by name, title, or description
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(coach =>
                coach.name.toLowerCase().includes(term) ||
                coach.title.toLowerCase().includes(term) ||
                coach.languages.some(lang => lang.toLowerCase().includes(term))
            );
        }

        // Filter by title
        if (selectedTitle !== 'all') {
            results = results.filter(coach => coach.title === selectedTitle);
        }

        // Filter by price range
        results = results.filter(coach =>
            coach.price && coach.price >= priceRange[0] && coach.price <= priceRange[1]
        );

        setFilteredCoaches(results);
    }, [searchTerm, selectedTitle, priceRange, coaches]);

    const handleViewDetails = (coach: Coach) => {
        setSelectedCoach(coach);
        setIsModalOpen(true);
    };

    // Get unique titles for filter dropdown
    const uniqueTitles = ['all', ...new Set(coaches.map(coach => coach.title).filter(Boolean))];

    // Calculate min and max price from coaches
    const minPrice = coaches.length > 0
        ? Math.min(...coaches.map(c => c.price || 0).filter(p => p > 0))
        : 0;
    const maxPrice = coaches.length > 0
        ? Math.max(...coaches.map(c => c.price || 0))
        : 1000;

    if (loading || queryLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaChessKnight className="text-5xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Coaches</h2>
                    <p className="text-gray-600">Please try again later.</p>
                    <p className="text-sm text-gray-500 mt-2">{error.message}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header isLoggedIn={!!session} />

            <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12 px-4 border-b-4 border-gold-500">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <FaChessKnight className="text-2xl md:text-3xl lg:text-5xl xl:text-5xl text-gold-500" />
                        <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-bold tracking-tight">Find a Chess Coach</h1>
                    </div>
                    <p className="text-md md:text-md lg:text-lg xl:text-lg text-center text-gray-200 mb-6">
                        Connect with certified chess coaches from around the world
                    </p>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gold-500/10 px-4 py-2 rounded-full">
                            <FaCheckCircle className="text-green-400" />
                            <span className="text-sm">Only verified coaches with set rates are listed</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="relative w-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <FaSearch className="text-gray-400 w-3 h-3" />
                            </div>

                            <Input
                                type="text"
                                placeholder="Search coaches by name, title, or language..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 placeholder:text-xs rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            {/* Icon */}
                            <FaFilter className="absolute left-3 top-3.5 text-gray-400 w-3 h-3 pointer-events-none" />

                            <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                                <SelectTrigger
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                >
                                    {/* Show placeholder or selected value */}
                                    <SelectValue
                                        asChild
                                    >
                                        {selectedTitle === "all" ? (
                                            <span className="text-xs text-gray-500">All Titles</span>
                                        ) : (
                                            <span className="text-sm">{selectedTitle}</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {uniqueTitles.map((title) =>
                                        title === "all" ? (
                                            <SelectItem
                                                key={title}
                                                value={title}
                                                className="text-xs text-gray-500"
                                            >
                                                All Titles
                                            </SelectItem>
                                        ) : (
                                            <SelectItem
                                                key={title}
                                                value={title}
                                                className="text-sm"
                                            >
                                                {title}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Price Range Filter */}
                        {/* <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Price Range</span>
                                <span className="text-sm font-semibold text-black">
                                    ${priceRange[0]} - ${priceRange[1]}/hour
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 min-w-[60px]">Min: ${priceRange[0]}</span>
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        step="5"
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const min = parseInt(e.target.value);
                                            setPriceRange([Math.min(min, priceRange[1]), priceRange[1]]);
                                        }}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 min-w-[60px]">Max: ${priceRange[1]}</span>
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        step="5"
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const max = parseInt(e.target.value);
                                            setPriceRange([priceRange[0], Math.max(max, priceRange[0])]);
                                        }}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Active filters display */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedTitle !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                                {selectedTitle}
                                <button onClick={() => setSelectedTitle('all')} className="ml-1 hover:text-blue-600">
                                    ×
                                </button>
                            </span>
                        )}
                        {/* <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                            ${priceRange[0]} - ${priceRange[1]}/hr
                        </span> */}
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-sm">
                                {searchTerm}
                                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-gray-600">
                                    ×
                                </button>
                            </span>
                        )}
                        {coaches.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm ml-auto">
                                {filteredCoaches.length} of {coaches.length} coaches
                            </span>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Available Coaches <span className="text-gold-600">({filteredCoaches.length})</span>
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-sm">All coaches are verified with set rates</span>
                    </div>
                </div>

                {filteredCoaches.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow">
                        <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No coaches found</h3>
                        <p className="text-gray-500">
                            {coaches.length === 0
                                ? "No verified coaches with rates are currently available."
                                : "Try adjusting your search criteria"}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedTitle('all');
                                setPriceRange([minPrice, maxPrice]);
                            }}
                            className="mt-4 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoaches.map(coach => (
                            <CoachCard
                                key={coach.id}
                                coach={coach}
                                onViewDetails={() => handleViewDetails(coach)}
                            />
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-12 bg-white rounded-2xl shadow p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <FaSearch className="text-blue-600 text-lg md:text-xl" />
                            </div>
                            {/* Hidden on sm/md, visible on lg/xl */}
                            <div className="hidden lg:block">
                                <h4 className="font-semibold text-gray-800 mb-2">Find a Coach</h4>
                                <p className="text-gray-600 text-sm">Browse verified coaches with FIDE certification and set hourly rates</p>
                            </div>
                            {/* Tooltip-like hint for mobile (optional) */}
                            <span className="lg:hidden text-xs text-gray-500 mt-1 block truncate px-1">Find a Coach</span>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <FaEnvelope className="text-green-600 text-lg md:text-xl" />
                            </div>
                            <div className="hidden lg:block">
                                <h4 className="font-semibold text-gray-800 mb-2">Book Coach</h4>
                                <p className="text-gray-600 text-sm">Book a coach and pay for coaching lessons at their listed hourly rate</p>
                            </div>
                            <span className="lg:hidden text-xs text-gray-500 mt-1 block truncate px-1">Book Coach</span>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <FaChessKnight className="text-gold-600 text-lg md:text-xl" />
                            </div>
                            <div className="hidden lg:block">
                                <h4 className="font-semibold text-gray-800 mb-2">Start Learning</h4>
                                <p className="text-gray-600 text-sm">Begin your chess improvement journey with expert guidance</p>
                            </div>
                            <span className="lg:hidden text-xs text-gray-500 mt-1 block truncate px-1">Start Learning</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer variant='training' />

            {selectedCoach && (
                <CoachModal
                    coach={selectedCoach}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}