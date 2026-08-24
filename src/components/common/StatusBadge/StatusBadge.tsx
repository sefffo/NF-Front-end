import React from 'react';

export type StatusVariant = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'DELIVERED' | 'FAILED' | 'QUEUED' | 'SENDING' | 'SCHEDULED' | 'HIGH' | 'URGENT';

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const normalized = status.toUpperCase();

  const getStatusClass = (val: string) => {
    switch (val) {
      case 'ACTIVE':
      case 'DELIVERED':
        return 'badge-success';
      case 'PENDING':
      case 'QUEUED':
      case 'SENDING':
      case 'SCHEDULED':
        return 'badge-warning';
      case 'FAILED':
      case 'SUSPENDED':
      case 'HIGH':
      case 'URGENT':
        return 'badge-danger';
      case 'INACTIVE':
      default:
        return 'badge-neutral';
    }
  };

  return <span className={`badge ${getStatusClass(normalized)}`}>{label || status}</span>;
};
