
import React, { useState, FormEvent } from 'react';
import { ShippingDetails, User } from '../types';
import { XIcon } from './icons/XIcon';

const biharDistricts = [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 
    'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 
    'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 
    'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 
    'Vaishali', 'West Champaran'
].sort();

interface ShippingDetailsModalProps {
  currentUser: User;
  onClose: () => void;
  onSave: (details: ShippingDetails) => void;
  t: (key: string) => string;
}

const ShippingDetailsModal: React.FC<ShippingDetailsModalProps> = ({ currentUser, onClose, onSave, t }) => {
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
  const [errors, setErrors] = useState<{ [key in keyof ShippingDetails]?: string }>({});

  const validateShippingDetails = (): boolean => {
    const newErrors: { [key in keyof ShippingDetails]?: string } = {};
    if (!shippingDetails.fullName.trim()) newErrors.fullName = t('fullNameRequired');
    if (!shippingDetails.phone.trim()) newErrors.phone = t('phoneRequired');
    if (!/^\+?[0-9\s-()]{10,15}$/.test(shippingDetails.phone)) newErrors.phone = t('validPhoneRequired');
    if (!shippingDetails.address.trim()) newErrors.address = t('addressRequired');
    if (!shippingDetails.city.trim()) newErrors.city = t('cityRequired');
    if (!shippingDetails.state.trim()) newErrors.state = t('stateRequired');
    if (!shippingDetails.postalCode.trim()) newErrors.postalCode = t('postalCodeRequired');
    if (!/^[0-9]{5,6}(-[0-9]{4})?$/.test(shippingDetails.postalCode)) newErrors.postalCode = t('validPostalCodeRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingDetails]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (validateShippingDetails()) {
        onSave(shippingDetails);
    }
  };

  const inputClass = (fieldName: keyof ShippingDetails) =>
      `mt-1 block w-full rounded-md border bg-white py-2 px-3 text-gray-900 shadow-sm sm:text-sm ${
        errors[fieldName]
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{t('yourShippingDetails')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 overflow-y-auto" noValidate>
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
          <div className="pt-6 mt-4 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {t('cancel')}
            </button>
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {t('saveAddress')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetailsModal;
