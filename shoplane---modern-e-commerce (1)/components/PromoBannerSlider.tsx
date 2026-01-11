
import React, { useState, useEffect, useRef } from 'react';
import { PromoBannerData } from '../types';
import CategoryPromo from './CategoryPromo';

interface PromoBannerSliderProps {
    promoBanners: PromoBannerData[];
    onPromoClick: (category: string) => void;
}

const PromoBannerSlider: React.FC<PromoBannerSliderProps> = ({ promoBanners, onPromoClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activePromoBanners = promoBanners.filter(p => p.enabled);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        if (activePromoBanners.length > 1) {
            timeoutRef.current = setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex + 1) % activePromoBanners.length),
                4000
            );
        }
        return () => {
            resetTimeout();
        };
    }, [currentIndex, activePromoBanners.length]);

    if (!activePromoBanners || activePromoBanners.length === 0) {
        return null;
    }

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative my-8 h-40 w-full group">
            <div className="w-full h-full relative">
                {activePromoBanners.map((promo, index) => (
                    <div
                        key={promo.id}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
                    >
                        <CategoryPromo
                          imageUrl={promo.imageUrl}
                          title={promo.title}
                          description={`Check out our latest arrivals in the ${promo.category} collection.`}
                          buttonText={`Shop ${promo.category}`}
                          category={promo.category}
                          onPromoClick={onPromoClick}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            {activePromoBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {activePromoBanners.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white'
                            }`}
                            aria-label={`Go to promo slide ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromoBannerSlider;
