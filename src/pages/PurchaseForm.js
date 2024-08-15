import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db, stripePromise } from '../firebase';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';

function PurchaseForm({ product, onClose }) {
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();

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
      // В реальном приложении здесь нужно отправить запрос на ваш сервер
      // для создания платежа в Stripe и получения подтверждения
      const paymentResult = { success: true, id: paymentMethod.id };

      if (paymentResult.success) {
        const orderData = {
          productId: product.id,
          productName: product.name,
          price: product.price,
          size,
          color,
          address,
          phone,
          email,
          purchaseDate: new Date(),
          paymentStatus: 'Completed',
          paymentId: paymentResult.id,
        };

        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order placed with ID: ", docRef.id);
        
        alert(`Thank you for purchasing ${product.name}! Order confirmation sent to your email.`);
        onClose();
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
    <div className="purchase-form">
      <h3>Complete Your Purchase</h3>
      <form onSubmit={handleSubmit}>
        {/* Существующие поля формы */}
        <div>
          <label htmlFor="size">Size:</label>
          <select id="size" value={size} onChange={(e) => setSize(e.target.value)} required>
            <option value="">Select Size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </select>
        </div>
        <div>
          <label htmlFor="color">Color:</label>
          <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        {/* Stripe CardElement */}
        <div>
          <label>Card details:</label>
          <CardElement />
        </div>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Complete Purchase'}
        </button>
        <button type="button" onClick={onClose} disabled={isProcessing}>Cancel</button>
      </form>
    </div>
  );
}

// Оберните PurchaseForm в Elements провайдер
export default function WrappedPurchaseForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <PurchaseForm {...props} />
    </Elements>
  );
}