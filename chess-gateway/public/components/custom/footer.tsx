"use client"

import Image from "next/image"

interface FooterProps {
    variant?: "default" | "training" | "app"
}

interface FooterLink {
    label: string
    href: string
}

interface FooterSection {
    title: string
    links?: FooterLink[]
    items?: string[]
}

export default function Footer({ variant = "default" }: FooterProps) {
    const currentYear = new Date().getFullYear()

    const getConfig = () => {
        switch (variant) {
            case "training":
                return {
                    accentColor: "hover:text-blue-400",
                    logoColor: "text-blue-400",
                    description:
                        "Making chess education accessible and effective for institutions and individuals worldwide.",
                    tagline: "Standardized chess education for all. ♟️",
                    sections: [
                        // {
                        //     title: "For Institutions",
                        //     links: [
                        //         { label: "Schools", href: "#" },
                        //         { label: "Chess Clubs", href: "#" },
                        //         { label: "After-School Programs", href: "#" },
                        //         { label: "Summer Camps", href: "#" },
                        //     ],
                        // },
                        // {
                        //     title: "Resources",
                        //     links: [
                        //         { label: "Curriculum Guide", href: "#" },
                        //         { label: "Teacher Training", href: "#" },
                        //         { label: "Case Studies", href: "#" },
                        //         { label: "Research Papers", href: "#" },
                        //     ],
                        // },
                        {
                            title: "Contact",
                            items: [
                                "Email: info@we-chess.com",
                                // "Phone: +62 812-3456-7890",
                                "Institution Support: Dedicated Line",
                            ],
                            links: [
                                { label: "FAQ", href: "/faq" },
                                { label: "Contact Us", href: "/contact" },
                            ],
                        },
                    ] as FooterSection[],
                }

            case "app":
                return {
                    accentColor: "hover:text-orange-400",
                    logoColor: "text-orange-400",
                    description:
                        "Making chess accessible and fun for everyone through expert coaching and innovative technology.",
                    tagline: "One smart move at a time. ♟️",
                    sections: [
                        {
                            title: "App Features",
                            links: [
                                { label: "GM Puzzles", href: "#" },
                                { label: "Interactive Lessons", href: "#" },
                                { label: "Tournaments", href: "#" },
                                { label: "Progress Tracking", href: "#" },
                            ],
                        },
                        {
                            title: "Resources",
                            links: [
                                { label: "Help Center", href: "#" },
                                { label: "Community", href: "#" },
                                { label: "Blog", href: "#" },
                                { label: "Chess Guides", href: "#" },
                            ],
                        },
                        {
                            title: "Contact",
                            items: [
                                "Email: info@we-chess.com",
                                "Phone: (555) 123-4567",
                                "Support: 24/7 Live Chat",
                            ],
                            links: [
                                { label: "FAQ", href: "/faq" },
                                { label: "Contact Us", href: "/contact" },
                            ],
                        },
                    ] as FooterSection[],
                }

            default:
                return {
                    accentColor: "hover:text-orange-400",
                    logoColor: "text-orange-400",
                    description:
                        "Making chess accessible and fun for everyone through expert coaching and innovative technology.",
                    tagline: "One smart move at a time. ♟️",
                    sections: [
                        {
                            title: "Programs",
                            links: [
                                { label: "Kids (5-7)", href: "#" },
                                { label: "Juniors (8-10)", href: "#" },
                                { label: "Advanced (11+)", href: "#" },
                                { label: "Private Coaching", href: "#" },
                            ],
                        },
                        {
                            title: "Resources",
                            links: [
                                { label: "Free Puzzles", href: "#" },
                                { label: "Video Lessons", href: "#" },
                                { label: "Tournament Schedule", href: "#" },
                                { label: "Parent's Guide", href: "#" },
                            ],
                        },
                        {
                            title: "Contact",
                            items: [
                                "Email: info@we-chess.com",
                                "Phone: (555) 123-4567",
                                "Support: 24/7 Live Chat",
                            ],
                            links: [
                                { label: "FAQ", href: "/faq" },
                                { label: "Contact Us", href: "/contact" },
                            ],
                        },
                    ] as FooterSection[],
                }
        }
    }

    const config = getConfig()

    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Logo + Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-6 h-6">
                                <Image
                                    src="/logo/chess-logo.svg"
                                    alt="We Chess Logo"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span className="font-bold text-xl">We Chess</span>
                        </div>
                        <p className="text-gray-400 text-sm">{config.description}</p>
                    </div>

                    {/* Sections */}
                    {config.sections.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-bold mb-4">{section.title}</h4>

                            {section.items && (
                                <ul className="space-y-2 text-sm text-gray-400 mb-2">
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {section.links && (
                                <ul className="space-y-2 text-sm text-gray-400">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.href}
                                                className={`${config.accentColor} transition-colors hover:underline hover:underline-offset-2`}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    © {currentYear} We Chess. All rights reserved. {config.tagline}
                </div>
            </div>
        </footer>
    )
}
