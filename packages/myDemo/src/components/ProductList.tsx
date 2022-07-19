import React, { useDeferredValue } from 'react';

interface ProductsProps {
  products: Array<String>
}

function ProductList({ products }: ProductsProps) {
  const deferredProducts = useDeferredValue(products)
  return (
    <ul>
      {deferredProducts.map((product) => (
        <li>{product}</li>
      ))}
    </ul>
  );
}

export default ProductList