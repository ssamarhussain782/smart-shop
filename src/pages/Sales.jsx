import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { Link } from "react-router-dom";

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Fetch sales data
    axios
      .get("/shop/api/sales")
      .then((response) => {
        setSales(response.data);
      })
      .catch((err) => {
        console.error("Error fetching sales:", err);
      });
  }, []);

  const handleDelete = async (saleId) => {
    try {
      await axios.delete(`/shop/api/sales/${saleId}/`);
      setSales(sales.filter((sale) => sale.id !== saleId));
    } catch (err) {
      console.error("Error deleting sale:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
        Sales List
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-lg">
          View and manage all recorded sales.
        </p>
        <Link
          to="/sales/add"
          className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-indigo-700 transition"
        >
          Add Sale
        </Link>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200 bg-white">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Receipt Number
              </th>
              <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Sale Date
              </th>
              <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                Total Sales (PKR)
              </th>
              <th className="border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-800">
                    {sale.id}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-800">
                    {sale.receipt_number}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-800">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-sm text-gray-800">
                    {sale.total_sales}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-center">
                    <Link
                      to={`/sales/${sale.id}`}
                      className="text-indigo-600 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(sale.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-200 px-6 py-4 text-center text-gray-500"
                >
                  No sales records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
