import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await axios.get("/shop/api/products");
        setProducts(productResponse.data);

        const categoryResponse = await axios.get(
          "/shop/api/product-categories"
        );
        setCategories(categoryResponse.data);
      } catch (err) {
        console.log("Error fetching products or categories:", err);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    if (searchTerm) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.category_name &&
          product.category_name.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (sortConfig.key) {
      tempProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(tempProducts);
  }, [searchTerm, categoryFilter, products, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Products
      </h2>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          to="/products/add"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        >
          Add Product
        </Link>
      </div>

      <table className="w-full border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-blue-100">
            {[
              { label: "ID", key: "id" },
              { label: "Name", key: "name" },
              { label: "Category", key: "category_name" },
              { label: "Price (PKR)", key: "price" },
              { label: "MRP (PKR)", key: "mrp" },
              { label: "Stock", key: "inventory" },
              { label: "Added At", key: "added_at" },
            ].map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-4 py-2 text-left text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2 text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, idx) => (
            <tr
              key={product.id}
              className={`${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition duration-150`}
            >
              <td className="border border-gray-300 px-4 py-2">{product.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {product.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.category_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.price}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.mrp}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.inventory}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(product.added_at).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  to={`/products/${product.id}`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={async () => {
                    try {
                      await axios.delete(`/shop/api/products/${product.id}/`);
                      setProducts(products.filter((p) => p.id !== product.id));
                    } catch (err) {
                      console.error("Error deleting product:", err);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
