import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            alert("로그인이 필요한 서비스입니다.");
        } else if (!loading && user && allowedRoles) {
            // 권한 체크
            const userRole = user.type === 'member' ? 'member' : user.userType;
            if (!allowedRoles.includes(userRole)) {
                alert("접근 권한이 없습니다.");
            }
        }
    }, [loading, user, allowedRoles]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // 현재 경로가 관리자 또는 행원 페이지인 경우 AdminLogin으로 리디렉션
        if (location.pathname.startsWith('/AdminMain') || location.pathname.startsWith('/BankerWorkSpace')) {
            return <Navigate to="/AdminLogin" state={{ from: location }} replace />;
        }
        // 그 외(일반 고객 페이지)는 일반 로그인 페이지로 리디렉션
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (allowedRoles) {
        const userRole = user.type === 'member' ? 'member' : user.userType;
        if (!allowedRoles.includes(userRole)) {
            // 권한이 없는 경우 메인 페이지나 적절한 곳으로 리디렉션
            if (userRole === 'admin') return <Navigate to="/AdminMain" replace />;
            if (userRole === 'member') return <Navigate to="/BankerWorkSpace" replace />;
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
