import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import ProductList from './pages/ProductList';
// import PurchaseForm from './pages/PurchaseForm';
import AddProduct from './pages/admin/AddProduct';
import Auth from './pages/Auth';
import Header from './components/Header';
import Orders from './pages/admin/Orders';
import ProductDetail from '../src/pages/ProductDetail'; 
import WrappedPurchaseForm from './pages/Checkout';

const db = getFirestore();

function App() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Fetch user data from Firestore
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserDoc(docSnap.data());
        } else {
          console.log('No such document!');
        }

        // Fetch orders data from Firestore if user is an owner
        if (userDoc?.isOwner) {
          const ordersRef = collection(db, 'orders');
          const ordersSnap = await getDocs(ordersRef);
          const ordersData = ordersSnap.docs.map(doc => doc.data());
          setOrders(ordersData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userDoc?.isOwner]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header user={user} userDoc={userDoc} />
        <main className="flex-1 p-8 bg-white">
          <Routes>
            <Route path="/"   element={<ProductList userDoc={userDoc} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<WrappedPurchaseForm />} />
            <Route path="/order" element={userDoc?.isOwner ? <Orders orders={orders}/> : <Navigate to="/auth"/>}/>
            <Route path="/add-product" element={userDoc?.isOwner ? <AddProduct /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 text-center py-4 text-gray-700">
          <p>&copy; 2024 E-commerce Site. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
