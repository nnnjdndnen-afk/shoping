
import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  userOrders: Order[];
  onViewOrderDetails: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
  t: (key: any) => string;
}

const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ 
    isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout, 
    userOrders, onViewOrderDetails, onCancelOrder, t
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  
  const statusColors: { [key in Order['status']]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    'payment-pending': 'bg-orange-100 text-orange-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const tabClass = (isActive: boolean) => 
    `px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`;

  const renderCart = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p className="text-lg">{t('cartIsEmpty')}</p>
              </div>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                      <img src={item.imageUrls[0]} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">₹{((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">₹{(item.price ?? 0).toFixed(2)} {t('each')}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md bg-white">
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-gray-800"><MinusIcon className="h-4 w-4"/></button>
                          <p className="w-8 text-center">{item.quantity}</p>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-gray-800"><PlusIcon className="h-4 w-4"/></button>
                        </div>
                        <div className="flex">
                          <button onClick={() => onRemoveItem(item.id)} type="button" className="font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
                            <TrashIcon className="h-4 w-4"/>{t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <p>{t('subtotal')}</p>
                <p>₹{(subtotal ?? 0).toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{t('shippingCalculatedAtCheckout')}</p>
              <div className="mt-6">
                <button onClick={onCheckout} className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">{t('checkout')}</button>
              </div>
            </div>
        )}
    </div>
  );

  const renderOrders = () => (
    <div className="flex-1 overflow-y-auto p-6">
        {userOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
                <p className="text-lg">{t('noOrdersYet')}</p>
            </div>
        ) : (
            <ul className="space-y-4">
                {userOrders.map(order => (
                    <li key={order.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800">{t('order')} #{order.id.split('-')[1]}</p>
                                <p className="text-sm text-gray-500">{order.orderDate}</p>
                            </div>
                            <span className={`capitalize px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>{order.status.replace('-', ' ')}</span>
                        </div>
                        <div className="mt-4">
                            {order.status === 'shipped' && order.estimatedDeliveryDate && (
                                <p className="text-sm text-green-700 font-medium">{t('estDelivery')}: {order.estimatedDeliveryDate}</p>
                            )}
                            <p className="text-lg font-bold text-gray-900 mt-1">₹{(order.total ?? 0).toFixed(2)}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <button onClick={() => onViewOrderDetails(order)} className="text-sm font-medium text-indigo-600 hover:underline">{t('viewDetails')}</button>
                            {(order.status === 'pending' || order.status === 'payment-pending') && (
                                <button onClick={() => onCancelOrder(order)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 rounded-md hover:bg-red-50 px-2 py-1">
                                    <XCircleIcon className="h-4 w-4" />
                                    {t('cancelOrder')}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pb-16 md:pb-0">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <h2 className="text-2xl font-bold text-gray-900">{t('myCartAndOrders')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
          </div>
          <div className="p-2 border-b bg-white">
            <div className="flex justify-center bg-gray-100 rounded-lg p-1">
                <button onClick={() => setActiveTab('cart')} className={tabClass(activeTab === 'cart')}>{t('shoppingCart')} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</button>
                <button onClick={() => setActiveTab('orders')} className={tabClass(activeTab === 'orders')}>{t('myOrders')} ({userOrders.length})</button>
            </div>
          </div>
          {activeTab === 'cart' ? renderCart() : renderOrders()}
        </div>
      </div>
    </>
  );
};

export default MyOrdersModal;
