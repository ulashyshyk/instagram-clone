import React from 'react';
import { Loader } from 'lucide-react';

const sizeToClass = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <span className={`inline-flex items-center justify-center animate-spin slow-spin ${className}`} aria-hidden="true">
    <Loader className={sizeToClass[size] || sizeToClass.md} />
  </span>
);

export default Spinner;