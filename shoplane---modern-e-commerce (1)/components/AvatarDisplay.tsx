
import React from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { AvatarIcon1, AvatarIcon2, AvatarIcon3, AvatarIcon4, AvatarIcon5 } from './icons/avatars';

interface AvatarDisplayProps {
    avatarId: number;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarId }) => {
    const avatarSize = "h-24 w-24 text-gray-600";
    const containerSize = "h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md";

    const renderAvatar = () => {
        switch (avatarId) {
            case 1:
                return <AvatarIcon1 className={avatarSize} />;
            case 2:
                return <AvatarIcon2 className={avatarSize} />;
            case 3:
                return <AvatarIcon3 className={avatarSize} />;
            case 4:
                return <AvatarIcon4 className={avatarSize} />;
            case 5:
                return <AvatarIcon5 className={avatarSize} />;
            default:
                return <UserCircleIcon className={avatarSize} />;
        }
    };

    return (
        <div className={containerSize}>
            {renderAvatar()}
        </div>
    );
};

export default AvatarDisplay;
