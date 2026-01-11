
import React, { useState } from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { HeartIcon } from './icons/HeartIcon';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isItemInCart: boolean;
  wishlist: string[];
  onAddToWishlist: (id: string) => void;
  onRemoveFromWishlist: (id: string) => void;
  t: (key: any) => string;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onBuyNow, isItemInCart, wishlist, onAddToWishlist, onRemoveFromWishlist, t }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const hasSalePrice = product.salePrice && product.salePrice > 0;
  const displayPrice = hasSalePrice ? product.salePrice : product.originalPrice;
  const isWishlisted = wishlist.includes(product.id);
    
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      onRemoveFromWishlist(product.id);
    } else {
      onAddToWishlist(product.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row" role="dialog" aria-modal="true">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-20 bg-white/50 rounded-full p-1" aria-label={t('close')}>
          <XIcon className="h-6 w-6" />
        </button>
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 p-4 flex flex-col gap-4">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                <img src={product.imageUrls[selectedImageIndex]} alt={`${product.name} view ${selectedImageIndex + 1}`} className="w-full h-full object-cover" />
            </div>
            {product.imageUrls.length > 1 && (
                <div className="flex gap-2 justify-center">
                    {product.imageUrls.map((url, index) => (
                        <button key={index} onClick={() => setSelectedImageIndex(index)} className={`h-16 w-16 rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}>
                            <img src={url} alt={`thumbnail ${index+1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="flex-grow">
            <span className="text-sm font-medium text-indigo-600">{product.category}</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">{product.name}</h2>
            
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-3xl font-bold text-gray-900">₹{(displayPrice ?? 0).toFixed(2)}</p>
              {hasSalePrice && <p className="text-xl font-medium text-gray-500 line-through">₹{(product.originalPrice ?? 0).toFixed(2)}</p>}
            </div>

            <p className="text-gray-600 mt-6 whitespace-pre-wrap">{product.description}</p>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => onAddToCart(product)}
              disabled={isItemInCart}
              className={`flex-1 w-full flex items-center justify-center rounded-md border py-3 px-8 text-base font-medium shadow-sm transition-colors ${
                isItemInCart
                  ? 'bg-gray-800 text-white border-transparent cursor-not-allowed'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {isItemInCart ? t('addedToCart') : t('addToCart')}
            </button>
            <button
              onClick={() => onBuyNow(product)}
              className="flex-1 w-full flex items-center justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-base font-medium text-white shadow-sm hover:bg-green-700"
            >
              {t('buyNow')}
            </button>
             <button 
                onClick={handleWishlistToggle} 
                className={`p-3 border rounded-md transition-colors ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
             >
                <HeartIcon className="h-6 w-6" isFilled={isWishlisted} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;