
import { useEffect, useState } from "react";
import axios from "axios";

function Sales() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [customerId, setCustomerId] = useState("");

  const [currentItem, setCurrentItem] = useState({
    medicine_id: "",
    quantity: "",
  });

  const [items, setItems] = useState([]);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSales(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/medicines`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMedicines(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchMedicines();
  }, []);

  const addItem = () => {
    if (
      !currentItem.medicine_id ||
      !currentItem.quantity
    ) {
      alert("Select medicine and quantity");
      return;
    }

    setItems([
      ...items,
      {
        medicine_id: Number(
          currentItem.medicine_id
        ),
        quantity: Number(
          currentItem.quantity
        ),
      },
    ]);

    setCurrentItem({
      medicine_id: "",
      quantity: "",
    });
  };

  const removeItem = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const handleBarcodeSearch = () => {
  if (!barcode.trim()) return;

  const medicine = medicines.find(
    (m) => m.barcode === barcode.trim()
  );

  if (!medicine) {
    alert("Medicine not found");
    return;
  }

  setCurrentItem((prev) => ({
    ...prev,
    medicine_id: String(medicine.ID),
    quantity: prev.quantity || "1",
  })
);
  setBarcode("");
};

  const createSale = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!customerId) {
        alert("Select customer");
        return;
      }

      if (items.length === 0) {
        alert("Add at least one medicine");
        return;
      }

      await axios.post(
        `${API}/sales`,
        {
          customer_id: Number(customerId),
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      alert("Sale created successfully");

      setCustomerId("");
      setItems([]);
      setShowModal(false);

      fetchSales();
      fetchMedicines();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
          "Failed to create sale"
      );
    }
  };

  const viewReceipt = async (saleId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API}/sales/${saleId}/receipt`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReceipt(res.data.receipt);
    setShowReceipt(true);
  } catch (error) {
    console.log(error);
    alert("Failed to load receipt");
  }
};

const downloadReceipt = async (
  saleId
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API}/receipt/${saleId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `receipt-${saleId}.pdf`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();
  } catch (error) {
    console.log(error);
    alert(
      "Failed to download receipt"
    );
  }
}; 
  return (
  <>
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-subtitle">
            Manage pharmacy sales
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + New Sale
        </button>
      </div>

      <div className="table-card">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Customer</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="7">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.flatMap((sale) =>
                sale.sale_items?.map((item) => (
                  <tr
                    key={`${sale.ID}-${item.ID}`}
                  >
                    <td>{sale.ID}</td>

                    <td>
                      {sale.customer?.name}
                    </td>

                    <td>
                      {item.medicine?.name}
                    </td>

                    <td>{item.quantity}</td>

                    <td>
                      ₦
                      {Number(
                        sale.total || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      {new Date(
                        sale.CreatedAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="sales-actions">
                        <button
                          className="receipt-btn"
                          onClick={() =>
                            viewReceipt(
                              sale.ID
                            )
                          }
                        >
                          Receipt
                        </button>

                        <button
                          className="pdf-btn"
                          onClick={() =>
                            downloadReceipt(
                              sale.ID
                            )
                          }
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Sale</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <select
                className="modal-input"
                value={customerId}
                onChange={(e) =>
                  setCustomerId(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer.ID}
                      value={
                        customer.ID
                      }
                    >
                      {customer.name}
                    </option>
                  )
                )}
              </select>

              <input
  className="modal-input"
  type="text"
  placeholder="Scan Barcode"
  value={barcode}
  onChange={(e) =>
    setBarcode(e.target.value)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleBarcodeSearch();
    }
  }}
/>

<button
  className="save-btn"
  onClick={handleBarcodeSearch}
>
  Find Medicine
</button>

              <hr />

              <select
                className="modal-input"
                value={
                  currentItem.medicine_id
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    medicine_id:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Medicine
                </option>

                {medicines.map(
                  (medicine) => (
                    <option
                      key={medicine.ID}
                      value={
                        medicine.ID
                      }
                    >
                      {medicine.name} - ₦
                      {medicine.price}
                    </option>
                  )
                )}
              </select>

              <input
                className="modal-input"
                type="number"
                placeholder="Quantity"
                value={
                  currentItem.quantity
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    quantity:
                      e.target.value,
                  })
                }
              />

              <button
                className="save-btn"
                onClick={addItem}
              >
                Add Item
              </button>

              {items.map(
                (item, index) => {
                  const medicine =
                    medicines.find(
                      (m) =>
                        m.ID ===
                        item.medicine_id
                    );

                  return (
                    <div
                      key={index}
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginTop:
                          "10px",
                        padding:
                          "10px",
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "8px",
                      }}
                    >
                      <div>
                        <strong>
                          {
                            medicine?.name
                          }
                        </strong>
                        {" | Qty: "}
                        {
                          item.quantity
                        }
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          removeItem(
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={createSale}
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceipt && receipt && (
        <div className="modal-overlay">
          <div className="receipt-modal">
            <div className="modal-header">
              <h2>Pharmacy Receipt</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowReceipt(false)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>
                  Receipt ID:
                </strong>{" "}
                {receipt.receipt_id}
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {receipt.customer}
              </p>

              <p>
                <strong>
                  Cashier:
                </strong>{" "}
                {receipt.cashier}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  receipt.date
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);
}

export default Sales;