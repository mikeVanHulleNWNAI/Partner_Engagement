import React, { ReactNode } from 'react';

interface ItemGridProps {
  children: ReactNode;
}

const ItemGrid: React.FC<ItemGridProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ItemGrid;