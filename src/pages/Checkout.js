import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { addDoc, collection } from 'firebase/firestore';

import { db, stripePromise } from '../firebase';

export function Checkout() {
  const location = useLocation();
  const { product } = location.state || {};

  // Add debugging statement to check if product is available
  console.log("Product data:", product);

  // Default values in case `product` is undefined
  const [size, ] = useState(product?.selectedSize || 'Not specified');
  const [color, ] = useState(product?.selectedColor || 'Not specified');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  console.log(product);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      // Mock payment result for demonstration
      const paymentResult = { success: true, id: paymentMethod.id };

      if (paymentResult.success) {
        // Add default values to ensure no `undefined` values are included
        const orderData = {
          productId: product?.id || '',
          productName: product?.name || 'Unknown',
          price: product?.price || 0,
          size: size || 'Not specified',
          address: address || 'Not provided',
          phone: phone || 'Not provided',
          email: email || 'Not provided',
          purchaseDate: new Date(),
          paymentStatus: 'Completed',
          paymentId: paymentResult.id || 'Unknown',
        };

        // Log the order data before saving
        console.log("Order data:", orderData);

        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order placed with ID: ", docRef.id);

        alert(`Thank you for purchasing ${product?.name || 'your product'}! Order confirmation sent to your email.`);
      } else {
        setErrorMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order: ", error);
      setErrorMessage("An error occurred while placing the order. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img 
              src={product?.selectedImage || 'placeholder-image-url'} 
              alt={product?.name || 'Product Image'} 
              className="w-full h-[480px] object-contain rounded-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{product?.name || 'Product Name'}</h2>
            <p className="text-xl font-semibold text-gray-700 mb-4">Цена: {product?.price || 0} р.</p>
            <p className="text-xl font-semibold text-gray-700 mb-4">Количество: {product?.selectedQuantity || 0}</p>
            <p className="text-xl font-semibold text-gray-700 mb-4">Размер: {size}</p>
            <p className="text-xl font-semibold text-gray-700 mb-4">Праздничная упаковка: {product?.giftPackaging || 'Not specified'}</p>
            <p className="text-2xl font-bold mb-4">Общая стоимость: {product?.totalPrice || 0} р.</p>
            
            {/* Form for user details */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Адрес доставки</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-lg p-2 w-full" 
                placeholder="Введите адрес доставки"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Номер телефона</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg p-2 w-full" 
                placeholder="Введите номер телефона"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Электронная почта</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-2 w-full" 
                placeholder="Введите ваш email"
              />
            </div>
            <div className="mb-4">
              <label>Card details:</label>
              <CardElement />
            </div>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            
            <button 
              type="submit" 
              disabled={isProcessing}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              {isProcessing ? 'Processing...' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function WrappedPurchaseForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <Checkout {...props} />
    </Elements>
  );
}
