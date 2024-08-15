import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [, setImageUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length >= 2 && selectedFiles.length <= 6) {
      setImages(selectedFiles);
      setErrorMessage('');  // Clear error message if image selection is valid
    } else {
      setErrorMessage('Please select between 2 and 3 images.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length < 2 || images.length > 6) {
      setErrorMessage('You must upload between 2 and 3 images.');
      return;
    }

    try {
      const storage = getStorage();
      const imageUrls = await Promise.all(images.map(async (image) => {
        const imageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      }));

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        description,
        images: imageUrls
      });

      alert('Product added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setImages([]);
      setImageUrls([]);
    } catch (error) {
      console.error("Error adding product: ", error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="images">Product Images:</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
