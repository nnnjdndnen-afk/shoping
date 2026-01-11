
import React from 'react';
import { XIcon } from './icons/XIcon';

interface ContentModalProps {
    title: string;
    content: string;
    onClose: () => void;
    t: (key: any) => string;
}

const ContentModal: React.FC<ContentModalProps> = ({ title, content, onClose, t }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" role="dialog" aria-modal="true">
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 prose max-w-none overflow-y-auto">
                    <p className="whitespace-pre-wrap">{content}</p>
                </div>
                 <div className="p-4 border-t text-right">
                    <button 
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
