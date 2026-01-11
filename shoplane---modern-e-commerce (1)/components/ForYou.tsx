
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ForYouProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  wishlist: string[];
  onAddToWishlist: (id: string) => void;
  onRemoveFromWishlist: (id: string) => void;
  t: (key: string) => string;
}

const ForYou: React.FC<ForYouProps> = ({ products, t, ...productCardProps }) => {
  if (products.length === 0) return null;

  return (
    <div className="my-12">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('justForYou')}</h2>
        <p className="text-gray-500">{t('recommendationsBasedOnActivity')}</p>
      </div>
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {products.map(product => (
            <div key={product.id} className="w-64 flex-shrink-0">
              <ProductCard product={product} {...productCardProps} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForYou;
