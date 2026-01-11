
import React, { useState, FormEvent } from 'react';
import { XIcon } from './icons/XIcon';
import { User } from '../types';

interface RegisterModalProps {
    onClose: () => void;
    onRegister: (name: string, email: string, password_param: string) => Promise<User>;
    onSuccess: (user: User) => void;
    onSwitchToLogin: () => void;
    t: (key: any) => string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister, onSuccess, onSwitchToLogin, t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if(password.length < 6) {
            setError(t('passwordLengthWarning'));
            return;
        }

        setIsLoading(true);
        try {
            const user = await onRegister(name, email, password);
            onSuccess(user);
        } catch (err: any) {
            setError(err.message || 'Failed to register.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm" role="dialog" aria-modal="true">
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{t('createAnAccount')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label={t('close')}>
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" autoComplete="name" />
                        </div>
                        <div>
                            <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                            <input type="email" name="email-register" id="email-register" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" autoComplete="email" />
                        </div>
                        <div>
                            <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">{t('password')}</label>
                            <input type="password" name="password-register" id="password-register" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" autoComplete="new-password" />
                        </div>
                    </div>
                    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                    <div className="mt-6">
                        <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                            {isLoading ? t('creatingAccount') : t('register')}
                        </button>
                    </div>
                     <p className="mt-4 text-center text-sm text-gray-600">
                        {t('alreadyHaveAccount')}{' '}
                        <button type="button" onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {t('login')}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;