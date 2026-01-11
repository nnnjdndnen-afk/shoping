
import React from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { HeartIcon } from './icons/HeartIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  t: (key: any) => string;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ 
    isOpen, onClose, wishlistProducts, onRemoveFromWishlist, onAddToCart, t 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <h2 className="text-2xl font-bold text-gray-900">{t('wishlist')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistProducts.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 h-full flex flex-col justify-center items-center">
                <HeartIcon className="h-16 w-16 mx-auto text-gray-300" />
                <p className="text-lg mt-4 font-semibold">{t('wishlistIsEmpty')}</p>
                <p className="text-sm mt-1 max-w-xs mx-auto">{t('wishlistEmptyMessage')}</p>
              </div>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200">
                {wishlistProducts.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={product.imageUrls[0]} alt={product.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{product.name}</h3>
                          <p className="ml-4">₹{(product.salePrice || product.originalPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <button 
                            onClick={() => onAddToCart(product)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            <PlusIcon className="h-4 w-4" />
                            {t('addToCart')}
                        </button>
                        <div className="flex">
                          <button 
                            onClick={() => onRemoveFromWishlist(product.id)} 
                            type="button" 
                            className="font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistModal;
