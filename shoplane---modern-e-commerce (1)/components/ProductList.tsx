
import React from 'react';
import { Product, PromoBannerData, Category } from '../types';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons/SearchIcon';
import PromoBannerSlider from './PromoBannerSlider';
import { AllIcon } from './icons/CategoryIcons';
import ForYou from './ForYou';
import { XIcon } from './icons/XIcon';


interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  promoBanners: PromoBannerData[];
  wishlist: string[];
  onAddToWishlist: (id: string) => void;
  onRemoveFromWishlist: (id: string) => void;
  suggestions: string[];
  isSuggestionsLoading: boolean;
  onSuggestionClick: (term: string) => void;
  recommendedProducts: Product[];
  t: (key: string) => string;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onAddToCart,
  onProductClick,
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  promoBanners,
  wishlist,
  onAddToWishlist,
  onRemoveFromWishlist,
  suggestions,
  isSuggestionsLoading,
  onSuggestionClick,
  recommendedProducts,
  t
}) => {
  return (
    <div className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{t('ourCollection')}</h2>
        <p className="text-gray-500">{t('findPerfectItem')}</p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="block w-full rounded-lg border-2 border-gray-300 py-3 pl-12 pr-12 text-base shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
           {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
              aria-label="Clear search"
            >
              <XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          )}
           {(isSuggestionsLoading || suggestions.length > 0) && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg border-2 border-gray-300 shadow-lg z-20">
                  {isSuggestionsLoading ? (
                      <div className="p-4 text-sm text-gray-500">{t('loadingSuggestions')}</div>
                  ) : (
                      <ul className="divide-y divide-gray-100">
                          {suggestions.map((s, i) => (
                              <li key={i} onClick={() => onSuggestionClick(s)} className="p-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">{s}</li>
                          ))}
                      </ul>
                  )}
              </div>
          )}
        </div>

        {/* Category Filters with Logos */}
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('categories')}</h3>
            <div className="flex space-x-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <button
                key="all"
                onClick={() => onSelectCategory('All')}
                className="flex-shrink-0 flex flex-col items-center justify-start gap-2 w-24 text-center group focus:outline-none"
                aria-pressed={selectedCategory === 'All'}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600 shadow-lg text-white'
                    : 'bg-gray-100 group-hover:bg-gray-200 text-gray-600 group-hover:text-gray-800'
                }`}>
                  <AllIcon className="h-8 w-8" />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'text-indigo-600'
                    : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  {t('allCategories')}
                </span>
              </button>

              {categories.map(category => {
                const isSelected = selectedCategory === category.name;

                return (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.name)}
                    className="flex-shrink-0 flex flex-col items-center justify-start gap-2 w-24 text-center group focus:outline-none"
                    aria-pressed={isSelected}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'bg-indigo-600 shadow-lg ring-4 ring-indigo-300'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-xs font-medium transition-colors ${
                      isSelected
                        ? 'text-indigo-600'
                        : 'text-gray-600 group-hover:text-gray-800'
                    }`}>
                      {category.name}
                    </span>
                  </button>
                )
              })}
            </div>
        </div>
      </div>
      
      {/* "For You" Recommendations */}
      <ForYou 
        products={recommendedProducts}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        wishlist={wishlist}
        onAddToWishlist={onAddToWishlist}
        onRemoveFromWishlist={onRemoveFromWishlist}
        t={t}
      />

      {/* Promotional Banners Slider */}
      <PromoBannerSlider 
        promoBanners={promoBanners}
        onPromoClick={onSelectCategory}
      />
      
      <div className="mt-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onProductClick={onProductClick}
                wishlist={wishlist}
                onAddToWishlist={onAddToWishlist}
                onRemoveFromWishlist={onRemoveFromWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
              <p className="text-xl font-semibold text-gray-700">{t('noProductsFound')}</p>
              <p className="text-gray-500 mt-2">{t('adjustSearch')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
