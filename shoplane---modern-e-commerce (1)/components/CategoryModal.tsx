
import React from 'react';
import { Category } from '../types';
import { XIcon } from './icons/XIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
  t: (key: string) => string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categories, onSelectCategory, t }) => {
  if (!isOpen) return null;

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{t('allCategories')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center justify-start gap-2 text-center group focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg p-2"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden bg-gray-100 group-hover:bg-gray-200 ring-2 ring-gray-200 group-hover:ring-indigo-400">
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium transition-colors text-gray-700 group-hover:text-indigo-600">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
