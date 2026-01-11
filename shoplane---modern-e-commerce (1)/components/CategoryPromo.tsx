
import React from 'react';

interface CategoryPromoProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  category: string;
  onPromoClick: (category: string) => void;
}

const CategoryPromo: React.FC<CategoryPromoProps> = ({ imageUrl, title, description, buttonText, category, onPromoClick }) => {

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md group h-40">
       <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 p-8 flex flex-col justify-center items-start">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
          <p className="text-white/90 mt-1 mb-4 max-w-md text-sm md:text-base">{description}</p>
          <button
            onClick={() => onPromoClick(category)}
            className="inline-block rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPromo;
