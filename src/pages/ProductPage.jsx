import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    mrp: "", // Added MRP
    description: "",
    category: "",
    inventory: "", // Added Inventory
  });
  const [categories, setCategories] = useState([]); // Categories state
  const { productId } = useParams(); // Get productId from URL params for editing
  const navigate = useNavigate(); // Use navigate instead of history

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/shop/api/product-categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();

    if (productId) {
      // Fetch product data for editing
      axios.get(`/shop/api/products/${productId}/`).then((response) => {
        setProduct(response.data);
      });
    }
  }, [productId]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        // Assuming shop is a static value or user-related, adjust accordingly
        shop: 1, // Replace with dynamic shop ID if required
      };

      if (productId) {
        // Update existing product
        await axios.put(`/shop/api/products/${productId}/`, payload);
      } else {
        // Create a new product
        await axios.post("/shop/api/products/", payload);
      }

      navigate("/products"); // Redirect to products list after saving
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        {productId ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSaveProduct} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-semibold">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* MRP (Maximum Retail Price) */}
        <div>
          <label htmlFor="mrp" className="block text-sm font-semibold">
            MRP
          </label>
          <input
            type="number"
            id="mrp"
            name="mrp"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.mrp}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory */}
        <div>
          <label htmlFor="inventory" className="block text-sm font-semibold">
            Inventory
          </label>
          <input
            type="number"
            id="inventory"
            name="inventory"
            className="w-full p-3 mt-1 border rounded-lg"
            value={product.inventory}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductPage;
