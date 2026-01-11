
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface AuthScreenProps {
    appName: string;
    imageUrl: string;
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ appName, imageUrl, onLoginClick, onRegisterClick }) => {
    return (
        <div 
            className="h-screen w-screen bg-cover bg-center flex flex-col justify-center items-center p-8"
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="relative z-10 flex flex-col items-center text-center text-white bg-black/30 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-lg border border-white/20">
                <LogoIcon className="h-16 w-16 text-white mb-4"/>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    Welcome to {appName}
                </h1>
                <p className="mt-4 max-w-lg text-lg text-white/90">
                    Your one-stop shop for the latest trends and styles. Please login or create an account to continue.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={onLoginClick}
                        className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform hover:scale-105"
                    >
                        Login
                    </button>
                    <button 
                        onClick={onRegisterClick}
                        className="rounded-md bg-white/10 px-8 py-3 text-lg font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform hover:scale-105"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
