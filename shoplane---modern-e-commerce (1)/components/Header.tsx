
import React from 'react';
import { CartIcon } from './icons/CartIcon';
import { LogoIcon } from './icons/LogoIcon';
import { User } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
  appName: string;
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  currentUser: User | null;
  onProfileClick: () => void;
  t: (key: any) => string;
}

const Header: React.FC<HeaderProps> = ({ 
  appName, 
  cartItemCount, 
  wishlistItemCount,
  onCartClick, 
  onWishlistClick,
  onProfileClick,
  currentUser,
  t,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-indigo-600"/>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{appName}</h1>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
            <button onClick={onWishlistClick} className="relative text-gray-600 hover:text-indigo-600 transition-colors p-2" aria-label={t('wishlist')}>
                <HeartIcon className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {wishlistItemCount}
                </span>
                )}
            </button>
            <button onClick={onCartClick} className="relative text-gray-600 hover:text-indigo-600 transition-colors p-2" aria-label={t('myCartAndOrders')}>
                <CartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount}
                </span>
                )}
            </button>
             <div className="flex items-center">
                <button onClick={onProfileClick} className="text-gray-600 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-gray-100" aria-label={t('profileSettings')}>
                   <MenuIcon className="h-6 w-6"/>
                </button>
            </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;