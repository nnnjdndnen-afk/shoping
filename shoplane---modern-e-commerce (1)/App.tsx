
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useStore } from './hooks/useStore';
import { Order, Product, User, ShippingDetails } from './types';
import { LogoIcon } from './components/icons/LogoIcon';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import ProductList from './components/ProductList';
import AuthScreen from './components/AuthScreen';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ProfileSidebar from './components/ProfileSidebar';
import ContentModal from './components/ContentModal';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import MyOrdersModal from './components/MyOrdersModal';
import UserOrderDetailModal from './components/UserOrderDetailModal';
import CancelOrderModal from './components/CancelOrderModal';
import WishlistModal from './components/WishlistModal';
import BottomNavBar from './components/BottomNavBar';
import CategoryModal from './components/CategoryModal';
import AddressDisplay from './components/AddressDisplay';
import ShippingDetailsModal from './components/ShippingDetailsModal';

export default function App() {
  const { 
    loading, products, banners, categories, promoBanners, orders, currentUser, appSettings,
    cart, addToCart, removeFromCart, updateQuantity,
    addToWishlist, removeFromWishlist,
    login, register, logout, placeOrder, submitUtr, cancelOrder, updateUserShippingDetails,
    language, setLanguage, t,
    userActivity, logProductView, logSearchTerm,
  } = useStore();

  // User storefront state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentModalData, setContentModalData] = useState({ title: '', content: '' });
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isMyOrdersModalOpen, setIsMyOrdersModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [viewingUserOrder, setViewingUserOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCoinDiscountActive, setIsCoinDiscountActive] = useState(false);

  // "Bot" Features State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [recommendationsTriggered, setRecommendationsTriggered] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    // The date might be a Firebase Timestamp, convert to Date object for sorting
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, currentUser]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchTerm]);
  
  const wishlistProducts = useMemo(() => {
    if (!currentUser?.wishlist) return [];
    return products.filter(p => currentUser.wishlist.includes(p.id));
  }, [products, currentUser?.wishlist]);

  const applyCoinDiscount = useCallback((productsToDiscount: Product[]): Product[] => {
    if (!isCoinDiscountActive || !currentUser) {
        return productsToDiscount;
    }
    
    const discountPercentage = Math.min(Math.floor(currentUser.coins / 10), 50);
    const discount = discountPercentage / 100;

    if (discount === 0) return productsToDiscount;

    return productsToDiscount.map(p => {
        const priceToDiscount = (p.salePrice && p.salePrice < p.originalPrice) ? p.salePrice : p.originalPrice;
        const discountedPrice = priceToDiscount * (1 - discount);

        return {
            ...p,
            originalPrice: priceToDiscount,
            salePrice: discountedPrice,
            isOnSale: true,
        };
    });
  }, [isCoinDiscountActive, currentUser]);

  const discountedFilteredProducts = useMemo(() => applyCoinDiscount(filteredProducts), [applyCoinDiscount, filteredProducts]);
  const discountedRecommendedProducts = useMemo(() => applyCoinDiscount(recommendedProducts), [applyCoinDiscount, recommendedProducts]);
  const discountedWishlistProducts = useMemo(() => applyCoinDiscount(wishlistProducts), [applyCoinDiscount, wishlistProducts]);

  const handleAddToCart = (product: Product) => {
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct) {
        addToCart(originalProduct);
    }
  };

  const handleShowContent = (contentType: 'terms' | 'privacy') => {
    if (contentType === 'terms') {
      setContentModalData({ title: t('termsAndConditions'), content: appSettings.termsContent });
    } else {
      setContentModalData({ title: t('privacyAndSecurity'), content: appSettings.privacyContent });
    }
    setIsContentModalOpen(true);
    setIsProfileSidebarOpen(false);
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailModalOpen(true);
    logProductView(product.id);
  };

  const handleBuyNow = (product: Product) => {
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct) {
        addToCart(originalProduct);
        setIsProductDetailModalOpen(false);
        setIsCheckoutModalOpen(true);
    }
  };
  
  const handleCancelOrder = async (orderId: string, reason: string) => {
    await cancelOrder(orderId, reason);
    setCancellingOrder(null);
  };

  const handleHomeClick = () => {
    setIsMyOrdersModalOpen(false);
    setIsCategoryModalOpen(false);
    setIsWishlistModalOpen(false);
    setIsProfileSidebarOpen(false);
    setSelectedCategory('All');
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNavClick = () => {
    setIsMyOrdersModalOpen(false);
    setIsWishlistModalOpen(false);
    setIsProfileSidebarOpen(false);
    setIsCategoryModalOpen(true);
  };
  
  const handleMyOrderNavClick = () => {
    setIsCategoryModalOpen(false);
    setIsWishlistModalOpen(false);
    setIsProfileSidebarOpen(false);
    setIsMyOrdersModalOpen(true);
  };

  const handleCategorySelectFromModal = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsCategoryModalOpen(false);
  };

  const handleSaveShippingDetails = (details: ShippingDetails) => {
    if (currentUser) {
      updateUserShippingDetails(currentUser.uid, details);
      setIsShippingModalOpen(false);
    }
  };

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }
    
    if (!term.trim() || term.trim().length < 2) {
        setSuggestions([]);
        return;
    }

    setIsSuggestionsLoading(true);
    
    searchTimeoutRef.current = window.setTimeout(() => {
        const lowerCaseTerm = term.toLowerCase();
        const productSuggestions = products
            .filter(p => p.name.toLowerCase().includes(lowerCaseTerm))
            .map(p => p.name);

        const categorySuggestions = categories
            .filter(c => c.name.toLowerCase().includes(lowerCaseTerm))
            .map(c => c.name);
        
        const combined = [...productSuggestions, ...categorySuggestions];
        const uniqueSuggestions = Array.from(new Set(combined));

        setSuggestions(uniqueSuggestions.slice(0, 5));
        logSearchTerm(term);
        setIsSuggestionsLoading(false);
    }, 300);
  }, [products, categories, logSearchTerm]);

  const handleSuggestionClick = (term: string) => {
    setSearchTerm(term);
    setSuggestions([]);
  };

  useEffect(() => {
    if (recommendationsTriggered || !currentUser) return;
    
    const activityCount = userActivity.viewedProductIds.size + userActivity.searchTerms.size;
    
    if (activityCount >= 3) {
        setRecommendationsTriggered(true);

        const viewedCategories = Array.from(userActivity.viewedProductIds)
            .map(id => products.find(p => p.id === id)?.category)
            .filter((c): c is string => !!c);
        
        if (viewedCategories.length > 0) {
            const categoryCounts = viewedCategories.reduce((acc, cat) => {
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

            const recs = products.filter(p =>
                p.category === topCategory &&
                !userActivity.viewedProductIds.has(p.id)
            );
            
            const shuffledRecs = recs.sort(() => 0.5 - Math.random()).slice(0, 6);
            setRecommendedProducts(shuffledRecs);
        }
    }
  }, [userActivity, recommendationsTriggered, products, currentUser]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (loading || !appSettings.appName) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50">
          <LogoIcon className="h-16 w-16 animate-pulse text-indigo-600"/>
          <p className="mt-4 text-xl font-semibold text-gray-700">{t('loadingStore')}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <AuthScreen 
          appName={t('appName')} 
          imageUrl={appSettings.authScreenImageUrl} 
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
        />
        {isLoginOpen && <LoginModal t={t} onClose={() => setIsLoginOpen(false)} onLogin={login} onSuccess={() => setIsLoginOpen(false)} onSwitchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} />}
        {isRegisterOpen && <RegisterModal t={t} onClose={() => setIsRegisterOpen(false)} onRegister={register} onSuccess={() => setIsRegisterOpen(false)} onSwitchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        appName={t('appName')}
        cartItemCount={cartItemCount}
        wishlistItemCount={currentUser.wishlist?.length || 0}
        onCartClick={() => setIsMyOrdersModalOpen(true)}
        onWishlistClick={() => setIsWishlistModalOpen(true)}
        currentUser={currentUser}
        onProfileClick={() => setIsProfileSidebarOpen(true)}
        t={t}
      />
      <AddressDisplay
        shippingDetails={currentUser.shippingDetails}
        onAddressClick={() => setIsShippingModalOpen(true)}
        t={t}
      />
      <main className="container mx-auto p-4 sm:p-6 pb-20 md:pb-6">
        <BannerSlider banners={banners} />
        <ProductList 
          products={discountedFilteredProducts}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          promoBanners={promoBanners}
          wishlist={currentUser.wishlist || []}
          onAddToWishlist={addToWishlist}
          onRemoveFromWishlist={removeFromWishlist}
          suggestions={suggestions}
          isSuggestionsLoading={isSuggestionsLoading}
          onSuggestionClick={handleSuggestionClick}
          recommendedProducts={discountedRecommendedProducts}
          t={t}
        />
      </main>
      
      <BottomNavBar 
        onHomeClick={handleHomeClick}
        onCategoryClick={handleCategoryNavClick}
        onMyOrderClick={handleMyOrderNavClick}
        t={t}
      />

      {isProfileSidebarOpen && (
          <ProfileSidebar 
            isOpen={isProfileSidebarOpen}
            onClose={() => setIsProfileSidebarOpen(false)}
            onLogout={logout}
            onShowContent={handleShowContent}
            onShowMyOrders={() => { setIsProfileSidebarOpen(false); setIsMyOrdersModalOpen(true); }}
            supportLink={appSettings.customerSupportLink}
            user={currentUser}
            language={language}
            setLanguage={setLanguage}
            t={t}
            isCoinDiscountActive={isCoinDiscountActive}
            onToggleCoinDiscount={() => setIsCoinDiscountActive(prev => !prev)}
          />
      )}
      {isContentModalOpen && <ContentModal title={contentModalData.title} content={contentModalData.content} onClose={() => setIsContentModalOpen(false)} t={t} />}
      {isProductDetailModalOpen && selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setIsProductDetailModalOpen(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isItemInCart={cart.some(item => item.id === selectedProduct.id)}
          wishlist={currentUser.wishlist || []}
          onAddToWishlist={addToWishlist}
          onRemoveFromWishlist={removeFromWishlist}
          t={t}
        />
      )}
      {isCheckoutModalOpen && (
        <CheckoutModal 
          items={cart}
          currentUser={currentUser}
          onClose={() => setIsCheckoutModalOpen(false)}
          onPlaceOrder={placeOrder}
          onSubmitUtr={submitUtr}
          appSettings={appSettings}
          t={t}
        />
      )}
      {isMyOrdersModalOpen && (
          <MyOrdersModal
            isOpen={isMyOrdersModalOpen}
            onClose={() => setIsMyOrdersModalOpen(false)}
            cartItems={cart}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={() => { setIsMyOrdersModalOpen(false); setIsCheckoutModalOpen(true); }}
            userOrders={userOrders}
            onViewOrderDetails={setViewingUserOrder}
            onCancelOrder={setCancellingOrder}
            t={t}
          />
      )}
      {isWishlistModalOpen && (
        <WishlistModal
            isOpen={isWishlistModalOpen}
            onClose={() => setIsWishlistModalOpen(false)}
            wishlistProducts={discountedWishlistProducts}
            onRemoveFromWishlist={removeFromWishlist}
            onAddToCart={handleAddToCart}
            t={t}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onSelectCategory={handleCategorySelectFromModal}
          t={t}
        />
      )}
      {isShippingModalOpen && (
        <ShippingDetailsModal
          currentUser={currentUser}
          onClose={() => setIsShippingModalOpen(false)}
          onSave={handleSaveShippingDetails}
          t={t}
        />
      )}
      {viewingUserOrder && (
          <UserOrderDetailModal
            order={viewingUserOrder}
            onClose={() => setViewingUserOrder(null)}
            onCancelOrder={(order) => { setViewingUserOrder(null); setCancellingOrder(order); }}
            t={t}
          />
      )}
      {cancellingOrder && (
          <CancelOrderModal
            order={cancellingOrder}
            onClose={() => setCancellingOrder(null)}
            onConfirm={handleCancelOrder}
            t={t}
          />
      )}
    </div>
  );
}
