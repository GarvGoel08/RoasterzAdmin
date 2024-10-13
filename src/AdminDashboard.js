import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [authToken, setAuthToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCategory, setNewCategory] = useState({ categoryName: "", categoryIcon: "" });
  const [newItem, setNewItem] = useState({ ItemName: "", ItemDescription: "", price: "180", quantity: "999", discount: "50", type: "Anime", itemImage: null });
  
  const baseURL = 'https://roasterz-backend.vercel.app/api';

  // Load authToken from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  // Fetch categories, items, and orders
  useEffect(() => {
    if (authToken) {
      const fetchCategories = async () => {
        try {
          const res = await axios.get(`${baseURL}/categories/Get`, {
            headers: { "auth-token": authToken },
          });
          setCategories(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      const fetchItems = async () => {
        try {
          const res = await axios.get(`${baseURL}/items/Get`, {
            headers: { "auth-token": authToken },
          });
          setItems(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      const fetchOrders = async () => {
        try {
          const res = await axios.get(`${baseURL}/orders/get-all-orders`, {
            headers: { "auth-token": authToken },
          });
          setOrders(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchCategories();
      fetchItems();
      fetchOrders();
    }
  }, [authToken]);

  // Save the token to localStorage
  const handleSaveToken = () => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      alert("Token saved to localStorage!");
    }
  };

  // Clear token from localStorage
  const handleClearToken = () => {
    localStorage.removeItem("authToken");
    setAuthToken("");
    alert("Token removed from localStorage!");
  };

  // Add Category
  const handleAddCategory = async () => {
    try {
      const res = await axios.post(`${baseURL}/categories/Add`, newCategory, {
        headers: {
          "auth-token": authToken,
        },
      });
      alert(res.data.message);
      setCategories([...categories, newCategory]);
      setNewCategory({ categoryName: "", categoryIcon: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Item
  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append("ItemName", newItem.ItemName);
    formData.append("ItemDescription", newItem.ItemDescription);
    formData.append("price", newItem.price);
    formData.append("quantity", newItem.quantity);
    formData.append("discount", newItem.discount);
    formData.append("type", newItem.type);
    formData.append("itemImage", newItem.itemImage);

    try {
      const res = await axios.post(`${baseURL}/items/Add`, formData, {
        headers: {
          "auth-token": authToken,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
      setItems([...items, newItem]);
      setNewItem({ ItemName: "", ItemDescription: "", price: "", quantity: "", discount: "", type: "", itemImage: null });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Order
  const handleEditOrder = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${baseURL}/orders/update-order-status`, { status: newStatus, orderId: orderId }, {
        headers: {
          "auth-token": authToken,
        },
      });
      alert(res.data.message);
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Auth Token Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Auth Token"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          className="border p-2 w-full"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleSaveToken} className="bg-blue-500 text-white p-2 rounded">Save Token</button>
          <button onClick={handleClearToken} className="bg-red-500 text-white p-2 rounded">Clear Token</button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.categoryName}
            onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
            className="border p-2 mr-4"
          />
          <input
            type="text"
            placeholder="Category Icon URL"
            value={newCategory.categoryIcon}
            onChange={(e) => setNewCategory({ ...newCategory, categoryIcon: e.target.value })}
            className="border p-2"
          />
        </div>
        <button onClick={handleAddCategory} className="bg-blue-500 text-white p-2 rounded">Add Category</button>

        {/* List of Categories */}
        <h2 className="text-lg font-semibold mt-6">Categories List</h2>
        <ul className="list-disc pl-5">
          {categories.map((category, idx) => (
            <li key={idx}>{category.categoryName}</li>
          ))}
        </ul>
      </div>

      {/* Items Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Add Item</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.ItemName}
            onChange={(e) => setNewItem({ ...newItem, ItemName: e.target.value })}
            className="border p-2"
          />
          <textarea
            type="text"
            placeholder="Item Description"
            value={newItem.ItemDescription}
            onChange={(e) => setNewItem({ ...newItem, ItemDescription: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Discount"
            value={newItem.discount}
            onChange={(e) => setNewItem({ ...newItem, discount: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Type"
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            className="border p-2"
          />
          <input
            type="file"
            onChange={(e) => setNewItem({ ...newItem, itemImage: e.target.files[0] })}
            className="border p-2"
          />
        </div>
        <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded">Add Item</button>

        {/* List of Items */}
        <h2 className="text-lg font-semibold mt-6">Items List</h2>
        <ul className="list-disc pl-5">
          {items.map((item, idx) => (
            <li key={idx}>{item.ItemName}</li>
          ))}
        </ul>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
        <ul className="list-disc pl-5">
          {orders.map((order) => (
            <li key={order._id}>
              <div className="mb-2">
                <strong>Order ID:</strong> {order._id}
                <br />
                <strong>Status:</strong> {order.OrderStatus}
                <br />
                <strong>Order Date:</strong> {order.OrderDate}
                <br />
                <strong>Items:</strong>
                <ul>
                  {order.Items.map((item, idx) => (
                    <li key={idx}>
                      <div>
                        <strong>Item ID:</strong> {item.item}
                        <br />
                        <strong>Item Link:</strong>
                        <a
                          href={`https://roasterz.vercel.app/item/${item.item}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "blue" }}
                        >
                          https://roasterz.vercel.app/item/{item.item}
                        </a>
                        <br />
                        <strong>Item Price:</strong> ${item.pricePerItem}
                        <br />
                        <strong>Quantity:</strong> {item.quantity}
                      </div>
                      {item.item.ItemName} - {item.quantity} x $
                      {item.pricePerItem}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    handleEditOrder(order._id, "Printing and Packing")
                  }
                  className="bg-green-500 text-white p-1 rounded mr-2"
                >
                  Mark as Printing and Packing
                </button>
                <button
                  onClick={() => handleEditOrder(order._id, "Ready to Ship")}
                  className="bg-blue-500 text-white p-1 rounded"
                >
                  Mark as Ready to Ship
                </button>
                <button
                  onClick={() => handleEditOrder(order._id, "Delivered")}
                  className="bg-blue-500 text-white p-1 rounded"
                >
                  Mark as Delivered
                </button>
              </div>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
