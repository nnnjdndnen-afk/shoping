
import React, { useState, FormEvent, useEffect } from 'react';
import { CartItem, ShippingDetails, User, AppSettings, Order } from '../types';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';

interface CheckoutModalProps {
  items: CartItem[];
  currentUser: User;
  onClose: () => void;
  onPlaceOrder: (items: CartItem[], shippingDetails: ShippingDetails, paymentMethod: 'COD' | 'Online', coinsToUse: number) => Promise<Order>;
  onSubmitUtr: (orderId: string, utrId: string) => void;
  appSettings: AppSettings;
  t: (key: any) => string;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation' | 'qr-payment';

const biharDistricts = [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 
    'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 
    'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 
    'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 
    'Vaishali', 'West Champaran'
].sort();

const playOrderSuccessSound = () => {
    // Base64 encoded WAV file for a simple success chime
    const sound = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    const audio = new Audio(sound);
    audio.play().catch(e => console.error("Error playing sound:", e));
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, currentUser, onClose, onPlaceOrder, onSubmitUtr, appSettings, t }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(
    currentUser.shippingDetails || {
        fullName: currentUser.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    }
  );
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [utr, setUtr] = useState('');
  const [errors, setErrors] = useState<{ [key in keyof ShippingDetails]?: string }>({});
  const [timeLeft, setTimeLeft] = useState('');
  const [coinsToApply, setCoinsToApply] = useState(0);

  const isBlocked = currentUser.status === 'blocked' && currentUser.blockExpiresAt && new Date() < new Date(currentUser.blockExpiresAt);

  useEffect(() => {
    if (isBlocked) {
      const interval = setInterval(() => {
        const expiryDate = new Date(currentUser.blockExpiresAt!);
        const now = new Date();
        const diff = expiryDate.getTime() - now.getTime();
        if (diff <= 0) {
          setTimeLeft(t('blockExpired'));
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours > 0 ? `${hours}h ` : ''}${minutes}m ${t('blockTimeRemaining')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isBlocked, currentUser.blockExpiresAt, t]);

  const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  const shippingCost = 5.00;
  const total = subtotal + shippingCost - coinsToApply;
  
  const validateShippingDetails = (): boolean => {
    const newErrors: { [key in keyof ShippingDetails]?: string } = {};
    
    if (!shippingDetails.fullName.trim()) newErrors.fullName = t('fullNameRequired');
    else if (!/^[a-zA-Z\s'-]+$/.test(shippingDetails.fullName)) newErrors.fullName = t('validNameRequired');
    if (!shippingDetails.phone.trim()) newErrors.phone = t('phoneRequired');
    else if (!/^\+?[0-9\s-()]{10,15}$/.test(shippingDetails.phone)) newErrors.phone = t('validPhoneRequired');
    if (!shippingDetails.address.trim()) newErrors.address = t('addressRequired');
    if (!shippingDetails.city.trim()) newErrors.city = t('cityRequired');
    if (!shippingDetails.state.trim()) newErrors.state = t('stateRequired');
    if (!shippingDetails.postalCode.trim()) newErrors.postalCode = t('postalCodeRequired');
    else if (!/^[0-9]{5,6}(-[0-9]{4})?$/.test(shippingDetails.postalCode)) newErrors.postalCode = t('validPostalCodeRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleShippingSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (validateShippingDetails()) {
          setStep('payment');
      }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setShippingDetails(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof ShippingDetails]) {
          setErrors(prev => ({ ...prev, [name]: undefined }));
      }
  };

  const handleApplyCoins = () => {
    const inputCoins = parseFloat((document.getElementById('coins-input') as HTMLInputElement).value) || 0;
    const maxApplicable = Math.min(currentUser.coins, subtotal + shippingCost);
    const coinsToSet = Math.max(0, Math.min(inputCoins, maxApplicable));
    setCoinsToApply(coinsToSet);
  };
  
  const handlePlaceOrder = async () => {
    const newOrder = await onPlaceOrder(items, shippingDetails, paymentMethod, coinsToApply);
    if (paymentMethod === 'Online') {
        setPendingOrder(newOrder);
        setStep('qr-payment');
    } else {
        playOrderSuccessSound();
        setStep('confirmation');
    }
  };
  
  const handleUtrSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pendingOrder && utr.trim()) {
        onSubmitUtr(pendingOrder.id, utr.trim());
        playOrderSuccessSound();
        setStep('confirmation');
    }
  };
  
  const renderBlockedView = () => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
        <LockClosedIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800">{t('accountBlocked')}</h3>
        <p className="text-gray-600 mt-2 max-w-md">{t('accountBlockedMessage')}</p>
        <p className="mt-4 text-lg font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-md">{timeLeft}</p>
    </div>
  );

  const renderShippingForm = () => {
    const inputClass = (fieldName: keyof ShippingDetails) =>
      `mt-1 block w-full rounded-md border bg-white py-2 px-3 text-gray-900 shadow-sm sm:text-sm ${
        errors[fieldName]
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      }`;
      
    return (
        <form onSubmit={handleShippingSubmit} noValidate>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('shippingInformation')}</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                        <input type="text" name="fullName" id="fullName" value={shippingDetails.fullName} onChange={handleInputChange} required className={inputClass('fullName')} autoComplete="name" />
                        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
                        <input type="tel" name="phone" id="phone" value={shippingDetails.phone} onChange={handleInputChange} required className={inputClass('phone')} autoComplete="tel" />
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('streetAddress')}</label>
                    <input type="text" name="address" id="address" value={shippingDetails.address} onChange={handleInputChange} required className={inputClass('address')} autoComplete="street-address" />
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('city')}</label>
                        <input type="text" name="city" id="city" value={shippingDetails.city} onChange={handleInputChange} required className={inputClass('city')} autoComplete="address-level2" />
                        {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                    </div>
                     <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">{t('stateProvince')}</label>
                        <select name="state" id="state" value={shippingDetails.state} onChange={handleInputChange} required className={inputClass('state')} autoComplete="address-level1">
                            <option value="" disabled>{t('selectDistrict')}</option>
                            {biharDistricts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                    </div>
                     <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">{t('zipPostalCode')}</label>
                        <input type="text" name="postalCode" id="postalCode" value={shippingDetails.postalCode} onChange={handleInputChange} required className={inputClass('postalCode')} autoComplete="postal-code" />
                        {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
                    </div>
                </div>
            </div>
             <div className="pt-8 flex justify-end">
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {t('continueToPayment')}
                </button>
              </div>
        </form>
    );
  };

  const renderPayment = () => (
     <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('paymentAndConfirmation')}</h3>
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="font-semibold text-gray-700 mb-2">{t('shippingTo')}</h4>
                <p className="text-sm text-gray-600">{shippingDetails.fullName}</p>
                <p className="text-sm text-gray-600">{shippingDetails.address}, {shippingDetails.city}, {shippingDetails.state} {shippingDetails.postalCode}</p>
                <button onClick={() => setStep('shipping')} className="text-sm text-indigo-600 hover:underline mt-1">{t('edit')}</button>
            </div>
             <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('paymentMethod')}</h4>
                <div className="space-y-3">
                    <label htmlFor="cod" className={`flex items-center p-4 border rounded-md cursor-pointer ${paymentMethod === 'COD' ? 'border-indigo-500 bg-indigo-50' : ''}`}>
                        <input type="radio" name="paymentMethod" id="cod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-3 font-medium text-sm text-gray-800">{t('cod')}</span>
                    </label>
                    <label htmlFor="online" className={`flex items-center p-4 border rounded-md cursor-pointer ${paymentMethod === 'Online' ? 'border-indigo-500 bg-indigo-50' : ''}`}>
                        <input type="radio" name="paymentMethod" id="online" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-3 font-medium text-sm text-gray-800">{t('onlinePayment')}</span>
                    </label>
                </div>
             </div>
        </div>
         <div className="pt-8 flex justify-end">
            <button onClick={handlePlaceOrder} className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              {paymentMethod === 'COD' ? t('placeOrder') : t('proceedToPay')}
            </button>
        </div>
     </div>
  );

  const renderQrPayment = () => (
    <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-gray-800">{t('completeYourPayment')}</h3>
        <p className="text-gray-600 mt-2">{t('scanQrMessage')}</p>
        <div className="flex justify-center my-6">
            <img src={appSettings.paymentQRCodeUrl} alt="Payment QR Code" className="w-56 h-56 rounded-lg border shadow-md" />
        </div>
        <form onSubmit={handleUtrSubmit} className="max-w-sm mx-auto">
            <label htmlFor="utr" className="block text-sm font-medium text-gray-700">{t('utrId')}</label>
            <input 
                type="text" 
                name="utr" 
                id="utr" 
                value={utr} 
                onChange={(e) => setUtr(e.target.value)} 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                placeholder={t('utrId')}
            />
            <button type="submit" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {t('submitUtr')}
            </button>
        </form>
    </div>
  );
  
   const renderConfirmation = () => (
    <div className="text-center py-8">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800">{t('orderPlacedSuccessfully')}</h3>
        <p className="text-gray-600 mt-2">
            {paymentMethod === 'Online'
                ? t('paymentVerificationMessage')
                : t('codSuccessMessage')
            }
        </p>
        <div className="mt-8">
            <button onClick={onClose} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {t('continueShopping')}
            </button>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{t('checkout')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="w-full md:w-3/5 p-8 overflow-y-auto">
            {isBlocked ? renderBlockedView() : (
              <>
                {step === 'shipping' && renderShippingForm()}
                {step === 'payment' && renderPayment()}
                {step === 'qr-payment' && renderQrPayment()}
                {step === 'confirmation' && renderConfirmation()}
              </>
            )}
          </div>
          {/* Order Summary */}
          {step !== 'confirmation' && !isBlocked && (
            <div className="w-full md:w-2/5 bg-gray-50 p-8 border-l overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('orderSummary')}</h3>
                <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {items.map(item => (
                        <li key={item.id} className="flex items-center gap-4 text-sm">
                            <img src={item.imageUrls[0]} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                            <div className="flex-grow">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-800">₹{((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
                {currentUser.coins > 0 && step === 'payment' && (
                  <div className="mt-6 pt-6 border-t">
                    <label htmlFor="coins-input" className="block text-sm font-medium text-gray-700">{t('applyCoins')}</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="number" id="coins-input" name="coins-input" className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder={`${t('coinsAvailable')}: ${currentUser.coins}`} max={Math.min(currentUser.coins, subtotal + shippingCost)} />
                        <button type="button" onClick={handleApplyCoins} className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100">{t('apply')}</button>
                    </div>
                  </div>
                )}
                <div className="mt-6 pt-6 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                        <p className="text-gray-600">{t('subtotal')}</p>
                        <p className="font-medium text-gray-800">₹{(subtotal ?? 0).toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between">
                        <p className="text-gray-600">{t('shipping')}</p>
                        <p className="font-medium text-gray-800">₹{shippingCost.toFixed(2)}</p>
                    </div>
                     {coinsToApply > 0 && (
                        <div className="flex justify-between text-green-600">
                            <p>{t('discountFromCoins')}</p>
                            <p className="font-medium">- ₹{coinsToApply.toFixed(2)}</p>
                        </div>
                    )}
                     <div className="flex justify-between text-base font-semibold text-gray-900 mt-4 pt-4 border-t">
                        <p>{t('total')}</p>
                        <p>₹{(total ?? 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
