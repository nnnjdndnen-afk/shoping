
import React, { useState } from 'react';
import { User, AppSettings } from '../types';
import { XIcon } from './icons/XIcon';
import { ShareIcon } from './icons/ShareIcon';
import { GiftIcon } from './icons/GiftIcon';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  appSettings: AppSettings;
  t: (key: any) => string;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, currentUser, appSettings, t }) => {
  const [copyStatus, setCopyStatus] = useState(t('tapToCopy'));

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareData = {
      title: `${t('appName')}`,
      text: `${appSettings.referralMessageTemplate} ${t('yourReferralCode')}: ${currentUser.referralCode}`,
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Referral message copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      alert('Could not share. Link copied to clipboard instead.');
      await navigator.clipboard.writeText(shareData.text);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopyStatus(t('copied'));
    setTimeout(() => {
      setCopyStatus(t('tapToCopy'));
    }, 2000);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <h2 className="text-2xl font-bold text-gray-900">{t('referAndEarn')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center bg-white p-6 rounded-lg border">
                <GiftIcon className="h-16 w-16 mx-auto text-indigo-500" />
                <h3 className="mt-4 text-xl font-bold text-gray-800">{t('shareYourCode')}</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">{t('shareCodeDescription')}</p>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">{t('yourReferralCode')}</p>
                    <div 
                        onClick={handleCopyCode} 
                        className="mt-2 inline-block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3"
                    >
                        <p className="text-2xl font-bold tracking-widest text-indigo-600">{currentUser.referralCode}</p>
                    </div>
                     <p className="mt-1 text-xs text-gray-400 h-4">{copyStatus}</p>
                </div>

                <button 
                    onClick={handleShare}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    <ShareIcon className="h-5 w-5" />
                    {t('shareNow')}
                </button>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('yourReferrals')} ({currentUser.referredUsers?.length || 0})</h3>
                {(!currentUser.referredUsers || currentUser.referredUsers.length === 0) ? (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-lg border">
                        <p>{t('noReferralsYet')}</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {currentUser.referredUsers.map(user => (
                            <li key={user.uid} className="bg-white p-3 rounded-md border flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Joined</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralModal;
