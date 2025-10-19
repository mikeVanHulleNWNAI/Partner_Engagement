import React, { ReactNode } from 'react';

interface ItemGridProps {
  children: ReactNode;
}

const ItemGrid: React.FC<ItemGridProps> = ({ children }) => {
  return (
    <div className="bg-transparent p-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ItemGrid;