import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [profitLast30Days, setProfitLast30Days] = useState(0);
  const [totalSalesLast30Days, setTotalSalesLast30Days] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesChartData, setSalesChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const today = new Date();
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
      const formattedToday = format(today, "yyyy-MM-dd");
      const formattedLastMonth = format(lastMonth, "yyyy-MM-dd");

      try {
        const productResponse = await axios.get("/shop/api/products/");
        const products = productResponse.data;

        const soldProductsResponse = await Promise.all(
          products.map((product) =>
            axios.get(
              `/shop/api/products-sold/?product=${product.id}&start_date=${formattedLastMonth}&end_date=${formattedToday}`
            )
          )
        );

        const productsSoldData = soldProductsResponse.map(
          (response, index) => ({
            ...response.data[0],
            name: products[index].name,
            inventory: products[index].inventory,
          })
        );

        const sortedProducts = productsSoldData
          .filter((item) => item.total_quantity_sold > 0)
          .sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)
          .slice(0, 10);

        setTopSellingProducts(sortedProducts);

        const salesResponse = await axios.get("/shop/api/sales/");
        const salesInLast30Days = salesResponse.data.filter((sale) => {
          const saleDate = new Date(sale.sale_date);
          return saleDate >= lastMonth;
        });

        const totalProfit = salesInLast30Days.reduce(
          (acc, sale) => acc + (sale.total_profit || 0),
          0
        );
        const totalSales = salesInLast30Days.reduce(
          (acc, sale) => acc + (sale.total_sales || 0),
          0
        );

        const averageOrderValue =
          salesInLast30Days.length > 0
            ? totalSales / salesInLast30Days.length
            : 0;

        const salesData = salesInLast30Days.map((sale) => {
          return {
            x: format(new Date(sale.sale_date), "MMM dd, yyyy"),
            y: sale.total_sales || 0,
          };
        });

        setSalesChartData(salesData);
        setProfitLast30Days(totalProfit);
        setTotalSalesLast30Days(totalSales);
        setAverageOrderValue(averageOrderValue);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
        <h2 className="text-3xl font-semibold text-blue-700 animate-pulse">
          Loading Metrics...
        </h2>
      </div>
    );
  }

  const chartData = {
    labels: salesChartData.map((data) => data.x),
    datasets: [
      {
        label: "Total Sales Value",
        data: salesChartData.map((data) => data.y),
        fill: true,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#4CAF50",
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
        title: {
          display: true,
          text: "Sales Value",
          color: "#4CAF50",
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen text-gray-800">
      {/* Metrics Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {[
            { title: "Total Profit", value: profitLast30Days.toFixed(2) },
            { title: "Total Sales", value: totalSalesLast30Days.toFixed(2) },
            { title: "Avg Order Value", value: averageOrderValue.toFixed(2) },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center hover: transition-shadow"
            >
              <h3 className="text-lg font-bold text-blue-700 mb-2">
                {item.title} (Last 30 Days)
              </h3>
              <p className="text-3xl text-gray-700 font-semibold">
                ${item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
            Top Selling Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topSellingProducts.length ? (
              topSellingProducts.map((product, index) => (
                <Link
                  to={`/products/${product.product_id}`}
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transform hover:-translate-y-1 transition"
                >
                  <h3 className="font-semibold text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    Quantity Sold: {product.total_quantity_sold}
                  </p>
                  <p className="text-gray-600">
                    Stock Available: {product.inventory}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No products sold in the last month.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sales Trend Chart */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
            Sales Trend (Last 30 Days)
          </h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
