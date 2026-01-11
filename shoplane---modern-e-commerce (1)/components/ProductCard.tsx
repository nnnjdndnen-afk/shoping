
import React, { useState, useEffect, MouseEvent } from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  wishlist: string[];
  onAddToWishlist: (id: string) => void;
  onRemoveFromWishlist: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick, wishlist, onAddToWishlist, onRemoveFromWishlist }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const isWishlisted = wishlist.includes(product.id);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHovering && product.imageUrls.length > 1) {
      interval = setInterval(() => {
        setHoveredImageIndex(prevIndex => (prevIndex + 1) % product.imageUrls.length);
      }, 1000); // Change image every 1 second on hover
    }
    return () => {
      clearInterval(interval);
      setHoveredImageIndex(0); // Reset to first image when not hovering
    };
  }, [isHovering, product.imageUrls.length]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => {
        setIsAdding(false);
    }, 1000);
  }
  
  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isWishlisted) {
        onRemoveFromWishlist(product.id);
    } else {
        onAddToWishlist(product.id);
    }
  };
  
  const hasSalePrice = product.salePrice && product.salePrice > 0;
  const displayPrice = hasSalePrice ? product.salePrice : product.originalPrice;

  return (
    <div 
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onProductClick(product)}
    >
       {product.isOnSale && (
        <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
          SALE
        </div>
      )}
      <button 
        onClick={handleWishlistToggle} 
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-all duration-200"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon className={`h-6 w-6 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`} isFilled={isWishlisted} />
      </button>
      <div className="aspect-w-1 aspect-h-1 h-48 overflow-hidden">
        <img
          src={product.imageUrls[hoveredImageIndex] || product.imageUrls[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-3">
        <h3 className="text-base font-bold text-gray-900">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex flex-1 flex-col justify-end pt-2">
            <p className="text-xs italic text-gray-500">{product.category}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-gray-900">₹{(displayPrice ?? 0).toFixed(2)}</p>
              {hasSalePrice && <p className="text-sm font-medium text-gray-500 line-through">₹{(product.originalPrice ?? 0).toFixed(2)}</p>}
            </div>
        </div>
      </div>
      <div className="p-3 pt-0">
         <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex w-full items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isAdding
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
            {isAdding ? (
                'Added!'
            ) : (
                <>
                <PlusIcon className="w-4 h-4 mr-1 -ml-1" />
                Add to cart
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;