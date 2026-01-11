
import React from 'react';
import { ShippingDetails } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface AddressDisplayProps {
  shippingDetails: ShippingDetails | null;
  onAddressClick: () => void;
  t: (key: string) => string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ shippingDetails, onAddressClick, t }) => {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto">
        <button 
          onClick={onAddressClick} 
          className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <MapPinIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          {shippingDetails ? (
            <span className="truncate">
              {t('deliverTo')}: <span className="font-semibold">{shippingDetails.fullName}</span> - {shippingDetails.city}, {shippingDetails.postalCode}
            </span>
          ) : (
            <span className="font-semibold">{t('addDeliveryAddress')}</span>
          )}
          <ChevronRightIcon className="h-4 w-4 ml-auto text-gray-500 flex-shrink-0"/>
        </button>
      </div>
    </div>
  );
};

export default AddressDisplay;
