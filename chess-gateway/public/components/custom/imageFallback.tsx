"use client"

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: string;
    fallback?: React.ReactNode;
    fallbackSrc?: string;
}

export function ImageWithFallback({
    src,
    alt,
    fallback,
    fallbackSrc = '/placeholder.svg',
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // If there's an error and we have a fallback component, render it
    if (error && fallback) {
        return <>{fallback}</>;
    }

    // If there's an error but we have a fallbackSrc, use that
    const finalSrc = error ? fallbackSrc : src;

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <Image
                src={finalSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
                className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
            />
        </div>
    );
}