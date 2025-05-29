import React from 'react';
import { Loader } from 'lucide-react';

const Spinner = () => (
  <div className="animate-spin slow-spin">
    <Loader className='w-5 h-5 '/>
  </div>
);

export default Spinner;