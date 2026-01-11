
import React, { useState } from 'react';
import { Order } from '../types';
import { XIcon } from './icons/XIcon';
import { translations } from '../translations';

interface CancelOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (orderId: string, reason: string) => void;
  t: (key: any) => string;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ order, onClose, onConfirm, t }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasonKeys: (keyof typeof translations['en'])[] = [
    'reasonOrderedByMistake',
    'reasonBetterPrice',
    'reasonNoLongerNeeded',
    'reasonIncorrectAddress',
  ];
  const otherReasonText = t('otherReason');

  const handleConfirmCancellation = () => {
    if (!selectedReason) {
        alert("Please select a reason for cancellation.");
        return;
    }
    const finalReason = selectedReason === otherReasonText ? customReason : selectedReason;
    if (!finalReason.trim()) {
        alert("Please provide a reason for cancellation.");
        return;
    }
    onConfirm(order.id, finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">{t('cancelOrderModalTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            <p className="text-sm text-gray-700">{t('cancelOrderPrompt')} <strong>#{order.id.split('-')[1]}</strong>. {t('cancelOrderReasonPrompt')}</p>
            <div className="space-y-2">
                {predefinedReasonKeys.map(key => {
                    const reasonText = t(key);
                    return (
                        <label key={key} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                            <input 
                                type="radio" 
                                name="cancellationReason" 
                                value={reasonText} 
                                checked={selectedReason === reasonText} 
                                onChange={(e) => { setSelectedReason(e.target.value); setCustomReason(''); }} 
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                            />
                            <span className="ml-3 text-sm font-medium text-gray-800">{reasonText}</span>
                        </label>
                    );
                })}
                <label className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input 
                        type="radio" 
                        name="cancellationReason" 
                        value={otherReasonText} 
                        checked={selectedReason === otherReasonText} 
                        onChange={(e) => setSelectedReason(e.target.value)} 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 mt-1" 
                    />
                    <div className="ml-3 flex-1">
                        <span className="text-sm font-medium text-gray-800">{otherReasonText}</span>
                        {selectedReason === otherReasonText && (
                            <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)} rows={3} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder={t('enterReasonHere')}></textarea>
                        )}
                    </div>
                </label>
            </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {t('keepOrder')}
            </button>
            <button onClick={handleConfirmCancellation} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                {t('confirmCancellation')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
