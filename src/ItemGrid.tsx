import React, { ReactNode } from 'react';

interface ItemGridProps {
  children: ReactNode;
}

const ItemGrid: React.FC<ItemGridProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-15 2xl:grid-cols-18 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ItemGrid;