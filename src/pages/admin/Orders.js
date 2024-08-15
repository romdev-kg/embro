import React  from 'react';

function Orders({ orders }) {

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="p-2 border-b">Product Name</th>
            <th className="p-2 border-b">Price</th>
            <th className="p-2 border-b">Size</th>
            <th className="p-2 border-b">Color</th>
            <th className="p-2 border-b">Address</th>
            <th className="p-2 border-b">Phone</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Purchase Date</th>
          </tr>
        </thead>
        <tbody >
          {orders.length > 0 ? orders.map(order => (
            <tr key={order.id} >
              <td className="p-2 border-b">{order.productName}</td>
              <td className="p-2 border-b">{order.price}</td>
              <td className="p-2 border-b">{order.size}</td>
              <td className="p-2 border-b">{order.color}</td>
              <td className="p-2 border-b">{order.address}</td>
              <td className="p-2 border-b">{order.phone}</td>
              <td className="p-2 border-b">{order.email}</td>
              <td className="p-2 border-b">{new Date(order.purchaseDate.seconds * 1000).toLocaleString()}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="p-2 border-b text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
