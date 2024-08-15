import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import PurchaseForm from './PurchaseForm';

const db = getFirestore();

function ProductList({ userDoc }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Перенаправление на страницу с деталями продукта
  };

  console.log(products);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Products</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div 
              key={product.id} 
              className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 w-80 flex flex-col items-center cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              {product.images && (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-280px object-cover" 
                />
              )}
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">{product.price} сом</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Остановить всплытие события клика для кнопки
                    handleBuyClick(product);
                  }} 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Buy
                </button>
                {userDoc?.isOwner && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Остановить всплытие события клика для кнопки
                      handleDelete(product.id);
                    }} 
                    className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <PurchaseForm 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default ProductList;
