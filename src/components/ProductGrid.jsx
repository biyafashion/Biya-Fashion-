import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import { PackageX } from 'lucide-react';

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No Products Found',
  emptyDescription = 'Try adjusting your search or filter criteria to find what you are looking for.',
  onResetFilters,
  columns = 4, // 2, 3, 4
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden animate-pulse flex flex-col"
          >
            <div className="aspect-[3/4] bg-gray-200 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 pt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageX}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear All Filters' : 'Explore All Products'}
        actionTo={onResetFilters ? null : '/shop'}
        onAction={onResetFilters}
      />
    );
  }

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
