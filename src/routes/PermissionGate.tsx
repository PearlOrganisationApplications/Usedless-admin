import React from 'react';
import { useAuthStore } from '@/store/auth.store';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  role?: string[];
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  permission, 
  role 
}) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const hasRole = !role || (user?.role && role.includes(user.role));
  const hasPermission = !permission || (user?.permissions && user.permissions.includes(permission));

  if (!hasRole || !hasPermission) {
    return null;
  }

  return <>{children}</>;
};
