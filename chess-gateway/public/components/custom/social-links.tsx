import {
    FaFacebookF,
    FaYoutube,
    FaInstagram,
    FaTiktok,
    FaTwitch,
    FaExternalLinkAlt
} from 'react-icons/fa';

export default function SocialLinks() {
    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/WeChessOfficial/',
            icon: FaFacebookF,
            gradient: 'from-blue-600 to-blue-800',
        },
        {
            name: 'YouTube',
            href: 'https://www.youtube.com/@WeChessOfficial',
            icon: FaYoutube,
            gradient: 'from-red-600 to-red-800',
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/we_chess/',
            icon: FaInstagram,
            gradient: 'from-purple-600 to-pink-600',
        },
        {
            name: 'TikTok',
            href: 'https://www.tiktok.com/@we_chess',
            icon: FaTiktok,
            gradient: 'from-gray-900 to-gray-700',
        },
        {
            name: 'Twitch',
            href: 'https://www.twitch.tv/we_chess',
            icon: FaTwitch,
            gradient: 'from-purple-500 to-purple-700',
        }
    ];

    return (
        <div className="text-center bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Follow our channels for updates, chess tips, tournament announcements, and educational content.
            </p>

            {/* Responsive grid layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex flex-col items-center gap-2 bg-gradient-to-b ${link.gradient} hover:brightness-110 text-white px-4 py-3 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <Icon className="text-2xl md:text-3xl" />
                            <span className="text-sm md:text-base font-medium">{link.name}</span>
                            <FaExternalLinkAlt className="text-xs opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2" />
                        </a>
                    );
                })}
            </div>

            <p className="text-sm text-gray-400 mt-8">
                Follow us on all platforms for the complete We Chess experience!
            </p>
        </div>
    );
}