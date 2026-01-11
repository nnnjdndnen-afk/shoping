
import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { AllIcon } from './icons/CategoryIcons';
import { PackageIcon } from './icons/PackageIcon';

interface BottomNavBarProps {
  onHomeClick: () => void;
  onCategoryClick: () => void;
  onMyOrderClick: () => void;
  t: (key: any) => string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onHomeClick, onCategoryClick, onMyOrderClick, t }) => {
  const navButtonClass = "flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors w-full";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[51] bg-white/80 backdrop-blur-md shadow-[0_-2px_5px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around items-center h-16">
        <button onClick={onHomeClick} className={navButtonClass}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs font-medium">{t('home')}</span>
        </button>
        <button onClick={onCategoryClick} className={navButtonClass}>
          <AllIcon className="h-6 w-6" />
          <span className="text-xs font-medium">{t('categories')}</span>
        </button>
        <button onClick={onMyOrderClick} className={navButtonClass}>
          <PackageIcon className="h-6 w-6" />
          <span className="text-xs font-medium">{t('myOrders')}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;
