import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // Kiểm tra xem user có role hợp lệ không
  if (!user || !allowedRoles.includes(user.role)) {
    // Nếu không có quyền, chuyển hướng đến trang login
    return <Navigate to="/login" />;
  }

  // Nếu có quyền, render component con
  return <Outlet />;
};

export default ProtectedRoute;
