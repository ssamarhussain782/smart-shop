import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const SalePage = () => {
  const [saleDetails, setSaleDetails] = useState({
    saleDate: new Date().toISOString().split("T")[0],
  });
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { saleId } = useParams();

  useEffect(() => {
    axios
      .get("/shop/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (saleId) {
      axios
        .get(`/shop/api/sales/${saleId}`)
        .then((response) => {
          const sale = response.data;
          setSaleDetails((prevDetails) => ({
            ...prevDetails,
            saleDate: sale.sale_date,
          }));

          axios
            .get(`/shop/api/sale-items/?sale=${saleId}`)
            .then((itemResponse) => {
              const saleItems = itemResponse.data.filter(
                (item) => `${item.sale}` === saleId
              );

              const updatedItems = saleItems.map((item) => {
                const product = products.find(
                  (product) => product.id === item.product
                );
                return {
                  ...item,
                  product_name: product ? product.name : "",
                  product_price: product ? parseFloat(product.price) : 0,
                };
              });

              setSelectedItems(updatedItems);
            })
            .catch((error) =>
              console.error("Error fetching sale items:", error)
            );
        })
        .catch((error) => console.error("Error fetching sale:", error));
    }
  }, [saleId, products]);

  const handleQuantityChange = (index, e) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = e.target.value;
    updatedItems[index].lineTotal =
      updatedItems[index].quantity * updatedItems[index].product_price;
    setSelectedItems(updatedItems);
  };

  const handleProductChange = (index, e) => {
    const updatedItems = [...selectedItems];
    const productId = e.target.value;
    updatedItems[index].product = productId;

    const selectedProduct = products.find(
      (product) => product.id === parseInt(productId)
    );
    updatedItems[index].product_price = selectedProduct
      ? parseFloat(selectedProduct.price)
      : 0;
    updatedItems[index].lineTotal =
      updatedItems[index].quantity * updatedItems[index].product_price;

    setSelectedItems(updatedItems);
  };

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        product: "",
        quantity: 1,
        product_name: "",
        product_price: 0,
        lineTotal: 0,
      },
    ]);
  };

  const handleCreateSale = async (e) => {
    e.preventDefault();
    try {
      const shopsResponse = await axios.get("/shop/api/shops/");
      const shopId = shopsResponse.data[0]?.id || "1";

      const saleResponse = await axios.post("/shop/api/sales/", {
        shop: shopId,
      });

      const saleId = saleResponse.data.id;
      const saleItemsData = selectedItems.map((item) => ({
        sale: saleId,
        product: item.product,
        quantity: item.quantity,
      }));

      await Promise.all(
        saleItemsData.map((item) => axios.post("/shop/api/sale-items/", item))
      );

      navigate("/sales");
    } catch (err) {
      console.error("Error creating sale:", err);
    }
  };

  const handleUpdateSale = async (e) => {
    e.preventDefault();
    try {
      const saleItemsData = selectedItems.map((item) => ({
        quantity: item.quantity,
      }));

      await Promise.all(
        saleItemsData.map((item, index) =>
          axios.put(`/shop/api/sale-items/${selectedItems[index].id}/`, item)
        )
      );

      navigate("/sales");
    } catch (err) {
      console.error("Error updating sale:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        {saleId ? "View Sale" : "Create New Sale"}
      </h2>
      <form
        onSubmit={saleId ? handleUpdateSale : handleCreateSale}
        className="space-y-6"
      >
        <div>
          <label htmlFor="saleDate" className="block text-sm font-semibold">
            Sale Date
          </label>
          <input
            type="date"
            id="saleDate"
            name="saleDate"
            className="w-full p-3 mt-1 border rounded-lg"
            value={saleDetails.saleDate}
            readOnly // This makes the field non-editable
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Sale Items</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={item.product}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full p-3 border rounded-lg"
                      disabled={saleId} // Make product selection disabled when viewing sale
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e)}
                      min="1"
                      className="w-full p-3 border rounded-lg"
                      disabled={saleId} // Disable the quantity field when viewing sale
                    />
                  </td>
                  <td>{item.product_price}</td>
                  <td>{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!saleId && (
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Add Item
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          disabled={saleId} // Disable submit button when viewing sale
        >
          {saleId ? "View Sale" : "Create Sale"}
        </button>
      </form>
    </div>
  );
};

export default SalePage;
