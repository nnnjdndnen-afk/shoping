
import React, { useState, FormEvent } from 'react';
import { User } from '../types';
import { XIcon } from './icons/XIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';

interface RedeemBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRedeemRequest: (amount: number, upiId: string) => Promise<void>;
  t: (key: string) => string;
}

const RedeemBalanceModal: React.FC<RedeemBalanceModalProps> = ({ isOpen, onClose, currentUser, onRedeemRequest, t }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const redeemAmount = parseFloat(amount);

    if (isNaN(redeemAmount) || redeemAmount <= 0) {
      setError(t('invalidAmountError'));
      return;
    }
    if (redeemAmount > currentUser.balance) {
      setError(t('insufficientBalanceError'));
      return;
    }
    if (!upiId.trim() || !/^[a-zA-Z0-9.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim())) {
      setError(t('invalidUpiError'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onRedeemRequest(redeemAmount, upiId.trim());
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || t('redeemRequestFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset state on close
    setAmount('');
    setUpiId('');
    setError('');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={handleClose} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <h2 className="text-2xl font-bold text-gray-900">{t('redeemBalance')}</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {isSuccess ? (
                <div className="text-center p-6 bg-white rounded-lg border flex flex-col items-center">
                    <BanknotesIcon className="h-16 w-16 text-green-500" />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">{t('requestSubmitted')}</h3>
                    <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">{t('requestSubmittedMessage')}</p>
                    <button 
                        onClick={handleClose}
                        className="mt-6 w-full inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        {t('done')}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-6">
                    <div>
                        <div className="flex justify-between items-baseline">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">{t('amountToRedeem')}</label>
                            <span className="text-xs text-gray-500">{t('available')}: <span className="font-bold">₹{currentUser.balance.toFixed(2)}</span></span>
                        </div>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="block w-full rounded-md border-gray-300 pl-7 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                step="0.01"
                                min="1"
                                max={currentUser.balance}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">{t('upiId')}</label>
                        <input
                            type="text"
                            name="upiId"
                            id="upiId"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="yourname@upi"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t('submittingRequest') : t('submitRequest')}
                    </button>
                </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemBalanceModal;
