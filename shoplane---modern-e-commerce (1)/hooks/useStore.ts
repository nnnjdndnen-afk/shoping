
import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Banner, PromoBannerData, User, Order, AppSettings, ShippingDetails, Category } from '../types';
import { translations } from '../translations';
import { auth, db } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, setDoc, addDoc, updateDoc, arrayUnion, arrayRemove, query, where, Timestamp } from 'firebase/firestore';

export const useStore = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBannerData[]>([]);
  const [users, setUsers] = useState<User[]>([]); // This will now only contain the current user.
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>({} as AppSettings);
  const [language, setLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en');
  const [userActivity, setUserActivity] = useState<{ viewedProductIds: Set<string>, searchTerms: Set<string> }>({
    viewedProductIds: new Set(),
    searchTerms: new Set(),
  });

  const t = useCallback((key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  }, [language]);

  useEffect(() => {
    setLoading(true);
    const unsubscribes = [
        onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(productsData);
        }),
        onSnapshot(collection(db, 'banners'), (snapshot) => {
            const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
            setBanners(bannersData);
        }),
        onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            setCategories(categoriesData);
        }),
        onSnapshot(collection(db, 'promoBanners'), (snapshot) => {
            const promoBannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoBannerData));
            setPromoBanners(promoBannersData);
        }),
        onSnapshot(doc(db, 'settings', 'app'), (doc) => {
            if (doc.exists()) {
                setAppSettings(doc.data() as AppSettings);
            }
        }),
    ];

    Promise.all([
        getDoc(doc(db, 'settings', 'app'))
    ]).then(() => setLoading(false))
      .catch(() => setLoading(false));

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribeUser = onSnapshot(userDocRef, (userDocSnap) => {
                if (userDocSnap.exists()) {
                    const userData = { uid: user.uid, ...userDocSnap.data() } as User;
                    setCurrentUser(userData);
                    setUsers([userData]); // Keep users array updated with current user
                } else {
                    signOut(auth);
                }
            });

            const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
            const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
                const userOrders = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore Timestamp to ISO String for consistency
                    const orderDate = data.orderDate instanceof Timestamp ? data.orderDate.toDate().toISOString() : data.orderDate;
                    return { id: doc.id, ...data, orderDate } as Order;
                });
                setOrders(userOrders);
            });
            
            return () => {
                unsubscribeUser();
                unsubscribeOrders();
            };
        } else {
            setCurrentUser(null);
            setOrders([]);
            setCart([]);
            setUsers([]);
        }
    });
    return () => unsubscribe();
}, []);
  
  const login = async (email: string, password_param: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password_param);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists() && userDocSnap.data().status === 'blocked') {
        await signOut(auth);
        throw new Error('Account blocked by an administrator.');
    }
    return { uid: userCredential.user.uid, ...userDocSnap.data() } as User;
  };

  const register = async (name: string, email: string, password_param: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password_param);
    const { user } = userCredential;
    const newUser: Omit<User, 'uid'> = {
        name,
        email: user.email || '',
        registeredAt: new Date().toISOString().split('T')[0],
        status: 'active',
        avatarId: Math.floor(Math.random() * 5) + 1,
        consecutiveCancellations: 0,
        blockExpiresAt: null,
        blockLevel: 0,
        shippingDetails: null,
        wishlist: [],
        isAdmin: false,
        coins: 0,
    };
    await setDoc(doc(db, 'users', user.uid), newUser);
    return { uid: user.uid, ...newUser };
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const updateUserShippingDetails = async (userId: string, details: ShippingDetails) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { shippingDetails: details });
  };

  const logProductView = useCallback((productId: string) => {
    setUserActivity(prev => {
        const newSet = new Set(prev.viewedProductIds);
        newSet.add(productId);
        return { ...prev, viewedProductIds: newSet };
    });
  }, []);

  const logSearchTerm = useCallback((term: string) => {
      if (term.trim().length > 2) {
          setUserActivity(prev => {
              const newSet = new Set(prev.searchTerms);
              newSet.add(term.trim().toLowerCase());
              return { ...prev, searchTerms: newSet };
          });
      }
  }, []);

  const addToCart = (product: Product) => {
    if (!currentUser) {
        alert("Please log in to add items to your cart.");
        return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const price = (product.salePrice && product.salePrice > 0 ? product.salePrice : product.originalPrice) ?? 0;
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const placeOrder = async (items: CartItem[], shippingDetails: ShippingDetails, paymentMethod: 'COD' | 'Online', coinsToUse: number): Promise<Order> => {
    if (!currentUser) throw new Error("User must be logged in.");
    
    const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
    const shippingCost = 5.00;
    const discount = Math.min(coinsToUse, currentUser.coins, subtotal + shippingCost);
    const total = subtotal + shippingCost - discount;

    const newOrderData = {
        userId: currentUser.uid, 
        userName: currentUser.name, 
        items,
        total,
        coinsUsed: discount,
        orderDate: new Date(),
        paymentMethod,
        status: paymentMethod === 'Online' ? 'payment-pending' : 'pending',
        shippingDetails,
    };
    
    const newOrderRef = await addDoc(collection(db, 'orders'), newOrderData);
    setCart([]);
    await updateUserShippingDetails(currentUser.uid, shippingDetails);
    
    const coinsEarned = Math.floor(total * 0.1);
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
        coins: currentUser.coins - discount + coinsEarned,
    });

    return { id: newOrderRef.id, ...newOrderData } as Order;
  };

  const submitUtr = async (orderId: string, utrId: string) => {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { utrId });
  };
  
  const cancelOrder = async (orderId: string, reason: string) => {
    const orderToCancelRef = doc(db, 'orders', orderId);
    await updateDoc(orderToCancelRef, { status: 'cancelled', cancellationReason: reason });

    if (currentUser) {
        const COIN_PENALTY = 25;
        const newCoinBalance = Math.max(0, currentUser.coins - COIN_PENALTY);
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { coins: newCoinBalance });
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
        wishlist: arrayUnion(productId)
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
        wishlist: arrayRemove(productId)
    });
  };
  
  return { 
    loading, products, cart, banners, categories, promoBanners, users, orders, currentUser, appSettings,
    language, setLanguage, t,
    login, register, logout,
    addToCart, removeFromCart, updateQuantity, 
    addToWishlist, removeFromWishlist,
    placeOrder, submitUtr, cancelOrder, updateUserShippingDetails,
    userActivity, logProductView, logSearchTerm,
  };
};
