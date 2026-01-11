
import React from 'react';
import { User } from '../types';
import { XIcon } from './icons/XIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import AvatarDisplay from './AvatarDisplay';
import { PackageIcon } from './icons/PackageIcon';
import { TranslateIcon } from './icons/TranslateIcon';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onShowContent: (contentType: 'terms' | 'privacy') => void;
  onShowMyOrders: () => void;
  supportLink: string;
  user: User;
  language: 'en' | 'hi' | 'es' | 'fr';
  setLanguage: (lang: 'en' | 'hi' | 'es' | 'fr') => void;
  t: (key: any) => string;
  isCoinDiscountActive: boolean;
  onToggleCoinDiscount: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
    isOpen, onClose, onLogout, onShowContent, onShowMyOrders, supportLink, user,
    language, setLanguage, t, isCoinDiscountActive, onToggleCoinDiscount
}) => {
  const discountPercentage = Math.min(Math.floor(user.coins / 10), 50);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">{t('profileSettings')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 flex flex-col items-center">
            <AvatarDisplay avatarId={user.avatarId} />
            <p className="font-semibold text-gray-800 mt-4 text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-4 bg-yellow-50 text-yellow-800 rounded-lg px-4 py-2 text-center w-full">
                <p className="text-sm font-medium">{t('yourCoins')}</p>
                <p className="text-2xl font-bold">{user.coins || 0}</p>
            </div>
            <div className="mt-4 w-full flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <div>
                    <span className="font-medium text-indigo-800 text-sm">{t('applyVisualDiscountWithPercent').replace('{percent}', String(discountPercentage))}</span>
                    <p className="text-xs text-indigo-600">{t('visualDiscountNotice')}</p>
                </div>
                <button
                    onClick={onToggleCoinDiscount}
                    disabled={discountPercentage === 0}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                        isCoinDiscountActive ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={isCoinDiscountActive}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isCoinDiscountActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
          </div>
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
             <button onClick={onShowMyOrders} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                <PackageIcon className="h-6 w-6 text-gray-500"/>
                <span className="font-medium">{t('myCartAndOrders')}</span>
            </button>
            <button onClick={() => onShowContent('terms')} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                <DocumentTextIcon className="h-6 w-6 text-gray-500"/>
                <span className="font-medium">{t('termsAndConditions')}</span>
            </button>
            <button onClick={() => onShowContent('privacy')} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                <ShieldCheckIcon className="h-6 w-6 text-gray-500"/>
                <span className="font-medium">{t('privacyAndSecurity')}</span>
            </button>
            <a href={supportLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                 <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500"/>
                 <span className="font-medium">{t('customerSupport')}</span>
            </a>
            <div className="flex items-center gap-4 p-3 rounded-lg text-gray-700">
              <TranslateIcon className="h-6 w-6 text-gray-500" />
              <label htmlFor="language-select" className="font-medium sr-only">{t('changeLanguage')}</label>
              <select 
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'es' | 'fr')}
                className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>
          </nav>
          <div className="p-6 border-t">
             <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 text-red-600">
                <LogoutIcon className="h-6 w-6"/>
                <span className="font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
