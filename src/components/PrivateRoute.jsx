import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext.jsx';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { openModal } = useModal();
    const [navigationBlocked, setNavigationBlocked] = useState(false);

    const showAlert = (message, callback = null) => {
        openModal({
            message: message,
            onConfirm: callback
        });
    };

    useEffect(() => {
        if (loading || navigationBlocked) {
            return;
        }

        const handleNavigation = (path) => {
            setNavigationBlocked(true); // Prevent further alerts/navigation
            navigate(path, { state: { from: location }, replace: true });
        };

        if (!user) {
            const targetPath = location.pathname.startsWith('/AdminMain') || location.pathname.startsWith('/BankerWorkSpace')
                ? "/AdminLogin"
                : "/Login";
            showAlert("로그인이 필요한 서비스입니다.", () => handleNavigation(targetPath));
            return; // Stop further execution in this effect
        }

        if (allowedRoles) {
            const userRole = user.type === 'member' ? 'member' : user.userType;
            if (!allowedRoles.includes(userRole)) {
                const fallbackPath = userRole === 'admin' ? "/AdminMain" : (userRole === 'member' ? "/BankerWorkSpace" : "/");
                showAlert("접근 권한이 없습니다.", () => handleNavigation(fallbackPath));
            }
        }
    }, [loading, user, location, navigate, allowedRoles, navigationBlocked]);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    // Render children only if user is authenticated and has the correct role
    if (user && (!allowedRoles || allowedRoles.includes(user.type === 'member' ? 'member' : user.userType))) {
        return children;
    }

    // While waiting for the modal confirmation and navigation, render nothing or a loading indicator
    return null;
};

export default PrivateRoute;
