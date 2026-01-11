import React from 'react';

// FIX: The 'PromoBlock' type is obsolete and has been removed from '../types'.
// This component appears to be unused legacy code. Defining the type locally to resolve the compilation error.
interface PromoBlock {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  bgColor: string;
  textColor: string;
}

interface SmallPromoProps {
  promoBlock: PromoBlock;
}

const SmallPromo: React.FC<SmallPromoProps> = ({ promoBlock }) => {
  if (!promoBlock) return null;

  return (
    <div className="my-12">
        <div className={`relative rounded-lg overflow-hidden ${promoBlock.bgColor} ${promoBlock.textColor} p-8`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                    <img 
                        src={promoBlock.imageUrl} 
                        alt={promoBlock.title} 
                        className="h-32 w-32 rounded-full object-cover shadow-md border-4 border-white" 
                    />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-bold">{promoBlock.title}</h3>
                    <p className="mt-2 max-w-2xl">{promoBlock.description}</p>
                </div>
                <div className="flex-shrink-0">
                     <a 
                        href={promoBlock.link} 
                        className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SmallPromo;