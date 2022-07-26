import React, { useState, useEffect, useMemo, useCallback, useTransition } from 'react';
import ProductList from '../../components/ProductList';
import { generateProducts } from './data';
const dummyProducts = generateProducts();
function filterProducts(filterTerm: string) {
  if (!filterTerm) {
    return dummyProducts;
  }
  return dummyProducts.filter(product => product.includes(filterTerm))
}

function ProductsMain() {
  const [filterTerm, setFilterTerm] = useState('');

  const filteredProducts = filterProducts(filterTerm);

  const [isPending, startTransition] = useTransition()
  function updateFilterHandler(event) {
    // startTransition(() => {
    //   setFilterTerm(event.target.value)
    // })
    setFilterTerm(event.target.value)

  }

  return (
    <div>
      <input type="text" onChange={updateFilterHandler} />
      {/* {isPending && <p >Updating List...</p>} */}
      <ProductList products={filteredProducts} />
    </div>
  )
}

export default ProductsMain;