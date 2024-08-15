import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const db = getFirestore();

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [giftPackaging, setGiftPackaging] = useState('Нет');

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const handlePurchase = () => {
    const totalPrice = product.price * quantity;
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          id,
          selectedSize: size,
          selectedQuantity: quantity,
          selectedImage: product.images?.[selectedImage],
          totalPrice,
          giftPackaging,
        },
      },
    });
  };
  console.log(id);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      <div className="lg:w-1/2">
        <div className="relative">
          <img 
            src={product.images?.[selectedImage] || ''} 
            alt={product.name} 
            className="w-full h-[480px] object-contain rounded-lg"
          />
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          {product.images?.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`${product.name} thumbnail  ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={`w-16 h-16 object-cover cursor-pointer rounded-lg transition-transform transform ${
                selectedImage === index ? 'border-2 border-black scale-105' : 'hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="lg:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl font-semibold text-gray-700 mb-4">{product.price} р.</p>
        <div className="mb-6">
          <p className="font-semibold mb-2">Размер</p>
          <div className="flex gap-2">
            {["M", "L", "XL", "XXL"].map(sizeOption => (
              <button 
                key={sizeOption} 
                onClick={() => setSize(sizeOption)}
                className={`px-4 py-2 border rounded-lg transition ${
                  size === sizeOption ? 'bg-gray-200' : 'hover:bg-gray-200'
                }`}
              >
                {sizeOption}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="font-semibold mb-2">Праздничная упаковка</p>
          <select 
            value={giftPackaging} 
            onChange={(e) => setGiftPackaging(e.target.value)}
            className="border rounded-lg p-2 w-[65px]"
          >
            <option value="Нет">Нет</option>
            <option value="Да">Да</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => handleQuantityChange(-1)} 
            className="px-4 py-2 border rounded-lg hover:bg-gray-200 transition"
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity} 
            readOnly 
            className="w-12 text-center border rounded-lg"
          />
          <button 
            onClick={() => handleQuantityChange(1)} 
            className="px-4 py-2 border rounded-lg hover:bg-gray-200 transition"
          >
            +
          </button>
          <button 
            onClick={handlePurchase}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Купить
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-200 transition">
            ❤
          </button>
        </div>
        <h1>{product.description}</h1>
      </div>
    </div>
  );
}

export default ProductDetail;
