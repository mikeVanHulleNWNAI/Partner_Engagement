import React, { ReactNode } from 'react';

interface ItemGridProps {
  children: ReactNode;
}

const ItemGrid: React.FC<ItemGridProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-10 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ItemGrid;