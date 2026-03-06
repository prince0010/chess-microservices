"use client"

import React, { useState, useRef, useEffect } from 'react'
import {
    Menu,
    X,
    LogIn,
    ChevronDown,
    Download,
    User
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface HeaderProps {
    isLoggedIn?: boolean
    userName?: string
    userInitials?: string
}

interface NavigationItem {
    label: string
    href: string
    hasDropdown?: boolean
    className?: string
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false }) => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCoachesDropdownOpen, setIsCoachesDropdownOpen] = useState(false)
    const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false)
    const appDropdownRef = useRef<HTMLDivElement>(null)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    // Animation variants
    const menuVariants: Variants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    }

    const menuItemVariants: Variants = {
        hidden: {
            opacity: 0,
            x: -20
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    }

    const dropdownVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    }

    const hamburgerIconVariants: Variants = {
        closed: { rotate: 0 },
        open: { rotate: 90 }
    }

    // Determine the dashboard link based on user role
    const getDashboardLink = () => {
        const role = session?.user?.role;
        if (role === "coach") {
            return "/coach-dashboard";
        } else if (role === "user") {
            return "/users-dashboard";
        }
        return "/dashboard";
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (appDropdownRef.current && !appDropdownRef.current.contains(event.target as Node)) {
                setIsAppDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const appStoreLink = "https://apps.apple.com/app/we-chess/id6756325408";
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.wechess.wechess.prod";

    const navigationItems: NavigationItem[] = [
        { label: 'Training Program', href: '/training-program' },
        { label: 'Find a Coach', href: '/find-coach' },
        { label: 'We Chess App', href: '/we-chess' },
        { label: 'Contact', href: '/contact', className: 'ml-4' },
        { label: 'Join us as a Coach', href: '/coach' },
    ]

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left section - Logo */}
                    <div className="flex items-center space-x-3">
                        <motion.button
                            className="lg:hidden text-gray-700"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={hamburgerIconVariants}
                            transition={{ duration: 0.3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isMenuOpen ? "close" : "menu"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        <Link href="/" className="flex items-center gap-2">
                            <motion.div
                                className="relative w-8 h-8"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Image
                                    src="/logo/chess-logo.svg"
                                    alt="We Chess Logo"
                                    width={32}
                                    height={32}
                                    className="w-full h-full"
                                />
                            </motion.div>
                            <motion.span
                                className="font-bold text-xl text-gray-900"
                                whileHover={{ scale: 1.02 }}
                            >
                                We Chess
                            </motion.span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile/tablet */}
                    <nav className="hidden lg:flex items-center gap-5">
                        {navigationItems.map((item, index) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                className={`text-sm text-gray-700 hover:text-orange-500 transition-colors font-medium ${item.className || ''}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                whileHover={{ y: -2, color: "#f97316" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </nav>

                    {/* Right section - Get App Dropdown and Login/Profile */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Get App Dropdown */}
                        <div className="relative" ref={appDropdownRef}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
                                    className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex items-center gap-1"
                                >
                                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    {/* Show text only on large screens (LG and above) */}
                                    <span className="hidden md:inline lg:inline">Get App</span>
                                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300" style={{ transform: isAppDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                </Button>
                            </motion.div>

                            <AnimatePresence>
                                {isAppDropdownOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200"
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <motion.a
                                            href={appStoreLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors group"
                                            onClick={() => setIsAppDropdownOpen(false)}
                                            whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black rounded-lg"
                                                whileHover={{ rotate: 5 }}
                                            >
                                                <Image
                                                    src="/img/download/appstore.svg"
                                                    alt="App Store"
                                                    width={16}
                                                    height={16}
                                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                                />
                                            </motion.div>
                                            <div className="flex-1">
                                                <div className="text-[10px] sm:text-xs text-gray-500">Download on the</div>
                                                <div className="text-xs sm:text-sm font-semibold text-gray-900">App Store</div>
                                            </div>
                                        </motion.a>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <motion.a
                                            href={playStoreLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors group"
                                            onClick={() => setIsAppDropdownOpen(false)}
                                            whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] rounded-lg"
                                                whileHover={{ rotate: -5 }}
                                            >
                                                <Image
                                                    src="/img/download/playstore.svg"
                                                    alt="Google Play"
                                                    width={16}
                                                    height={16}
                                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                                />
                                            </motion.div>
                                            <div className="flex-1">
                                                <div className="text-[10px] sm:text-xs text-gray-500">Get it on</div>
                                                <div className="text-xs sm:text-sm font-semibold text-gray-900">Google Play</div>
                                            </div>
                                        </motion.a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {isLoggedIn ? (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href={getDashboardLink()}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-300 px-1 sm:px-2 py-1 rounded-full transition-all hover:shadow-lg group"
                                >
                                    <motion.div
                                        className="relative"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <motion.div
                                            className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-white"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                    {/* Show "Account" text only on large screens (LG and above) */}
                                    <div className="hidden lg:block pr-2">
                                        <div className="text-xs text-gray-500 font-semibold">Account</div>
                                    </div>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/login"
                                    className="flex items-center space-x-1 bg-orange-500 h-8 sm:h-9 text-white px-2 sm:px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm font-medium"
                                >
                                    <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {/* Show "Login" text only on large screens (LG and above) */}
                                    <span className="hidden md:inline lg:inline">Login</span>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu - Visible only below LG breakpoint */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="lg:hidden overflow-hidden"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <div className="pb-3 border-t border-gray-100 pt-3">
                                <nav className="flex flex-col space-y-3">
                                    {navigationItems.map((item) => (
                                        <motion.a
                                            key={item.label}
                                            href={item.href}
                                            className="text-sm text-gray-700 hover:text-orange-600 py-1.5 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                            variants={menuItemVariants}
                                            whileHover={{ x: 4, color: "#f97316" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                {item.label}
                                                {item.hasDropdown && (
                                                    <motion.div
                                                        animate={{ rotate: 180 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="h-3.5 w-3.5" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.a>
                                    ))}

                                    {/* Mobile Get App options */}
                                    <motion.div
                                        className="mt-2"
                                        variants={menuItemVariants}
                                    >
                                        <div className="text-xs font-semibold text-gray-500 px-2 mb-2">Download App</div>
                                        <div className="flex flex-row gap-2">
                                            <motion.a
                                                href={appStoreLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                                whileHover={{ y: -2, backgroundColor: "#f3f4f6" }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <motion.div
                                                    className="w-6 h-6 flex items-center justify-center bg-black rounded-md"
                                                    whileHover={{ rotate: 5 }}
                                                >
                                                    <Image
                                                        src="/img/download/appstore.svg"
                                                        alt="App Store"
                                                        width={14}
                                                        height={14}
                                                        className="w-3.5 h-3.5"
                                                    />
                                                </motion.div>
                                                <span className="text-xs font-medium text-gray-900">App Store</span>
                                            </motion.a>

                                            <motion.a
                                                href={playStoreLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                                whileHover={{ y: -2, backgroundColor: "#f3f4f6" }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <motion.div
                                                    className="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#0D9D58] to-[#1A73E8] rounded-md"
                                                    whileHover={{ rotate: -5 }}
                                                >
                                                    <Image
                                                        src="/img/download/playstore.svg"
                                                        alt="Google Play"
                                                        width={14}
                                                        height={14}
                                                        className="w-3.5 h-3.5"
                                                    />
                                                </motion.div>
                                                <span className="text-xs font-medium text-gray-900">Google Play</span>
                                            </motion.a>
                                        </div>
                                    </motion.div>

                                    {!isLoggedIn && (
                                        <motion.a
                                            href="/login"
                                            className="flex items-center justify-center space-x-1.5 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium mt-1"
                                            onClick={() => setIsMenuOpen(false)}
                                            variants={menuItemVariants}
                                            whileHover={{ scale: 1.02, backgroundColor: "#ea580c" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <LogIn className="h-4 w-4" />
                                            <span>Login to Account</span>
                                        </motion.a>
                                    )}
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isCoachesDropdownOpen && (
                <motion.div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCoachesDropdownOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </header>
    )
}

export default Header