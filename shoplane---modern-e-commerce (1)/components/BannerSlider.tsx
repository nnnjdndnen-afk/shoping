import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface BannerSliderProps {
    banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // FIX: Use ReturnType<typeof setTimeout> for the ref type, as NodeJS.Timeout is not available in the browser.
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        if (banners.length > 1) {
            timeoutRef.current = setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length),
                5000
            );
        }
        return () => {
            resetTimeout();
        };
    }, [currentIndex, banners.length]);

    if (!banners || banners.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === banners.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative h-56 md:h-72 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg group">
            <div className="w-full h-full relative">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
                    >
                        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-8">
                                <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">{banner.title}</h2>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Left & Right Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full text-gray-800 hover:bg-white transition opacity-0 group-hover:opacity-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full text-gray-800 hover:bg-white transition opacity-0 group-hover:opacity-100"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {banners.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                            currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;