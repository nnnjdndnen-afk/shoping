
import React from 'react';
import { Order } from '../types';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface UserOrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onCancelOrder: (order: Order) => void;
  t: (key: any) => string;
}

const StatusStep: React.FC<{ title: string; date?: string; isActive: boolean; isComplete: boolean; isFirst?: boolean; isLast?: boolean }> = ({ title, date, isActive, isComplete, isFirst, isLast }) => {
  const circleClass = isComplete || isActive ? 'bg-indigo-600' : 'bg-gray-300';
  const textClass = isComplete || isActive ? 'text-indigo-600' : 'text-gray-500';

  return (
    <div className="flex items-start">
        <div className="flex flex-col items-center mr-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${circleClass}`}>
                {isComplete && <CheckCircleIcon className="w-5 h-5 text-white" />}
            </div>
            {!isLast && <div className={`w-0.5 grow ${isComplete ? 'bg-indigo-600' : 'bg-gray-300'}`} />}
        </div>
        <div className={`pb-8 ${isLast ? '' : ''}`}>
            <p className={`font-semibold ${textClass}`}>{title}</p>
            {date && <p className="text-sm text-gray-500">{date}</p>}
        </div>
    </div>
  );
};

const UserOrderDetailModal: React.FC<UserOrderDetailModalProps> = ({ order, onClose, onCancelOrder, t }) => {
    const statuses: Order['status'][] = ['pending', 'shipped', 'delivered'];
    const currentStatusIndex = order.status === 'payment-pending' ? 0 : statuses.indexOf(order.status);

    const getStatusTitle = (status: Order['status']) => {
        switch (status) {
            case 'payment-pending': return t('paymentPending');
            case 'pending': return t('orderPlaced');
            case 'shipped': return t('shipped');
            case 'delivered': return t('delivered');
            case 'cancelled': return t('orderCancelled');
            default: return status;
        }
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{t('orderDetailsUser')}{order.id.split('-')[1]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{t('itemsOrdered')}</h3>
                        <ul className="divide-y divide-gray-200 border rounded-md">
                            {order.items.map(item => (
                                <li key={item.id} className="flex items-center gap-4 p-3">
                                    <img src={item.imageUrls[0]} alt={item.name} className="h-16 w-16 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-gray-800">₹{((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{t('shippingAddress')}</h3>
                        <address className="text-sm text-gray-600 not-italic mt-2 p-4 bg-gray-50 rounded-md">
                            {order.shippingDetails.fullName}<br/>
                            {order.shippingDetails.phone}<br/>
                            {order.shippingDetails.address}<br/>
                            {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.postalCode}
                        </address>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{t('orderStatus')}</h3>
                    {order.status === 'cancelled' ? (
                        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                            <p className="font-semibold">{t('orderCancelled')}</p>
                            {order.cancellationReason && (
                                <p className="mt-1 text-sm">{t('reason')} {order.cancellationReason}</p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4">
                           <StatusStep title={getStatusTitle(order.status === 'payment-pending' ? 'payment-pending' : 'pending')} date={order.orderDate} isActive={currentStatusIndex >= 0} isComplete={currentStatusIndex > 0} isFirst />
                           <StatusStep title={t('shipped')} date={order.estimatedDeliveryDate ? `${t('est')} ${order.estimatedDeliveryDate}` : ''} isActive={currentStatusIndex === 1} isComplete={currentStatusIndex > 1} />
                           <StatusStep title={t('delivered')} isActive={currentStatusIndex === 2} isComplete={currentStatusIndex === 2} isLast />
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end items-center gap-4">
            {(order.status === 'pending' || order.status === 'payment-pending') && (
                <button onClick={() => onCancelOrder(order)} className="inline-flex items-center gap-2 rounded-md bg-red-50 py-2 px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    <XCircleIcon className="h-5 w-5" />
                    {t('cancelOrder')}
                </button>
            )}
            <button onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {t('close')}
            </button>
        </div>

      </div>
    </div>
    );
};

export default UserOrderDetailModal;
