import { useEffect, useState } from "react";
import api from "../api/api";
import { useZxing } from "react-zxing";
import "../styles/sales.css";

function Sales() {
  // ==========================
  // State
  // ==========================

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [receipt, setReceipt] = useState(null);

  const [barcode, setBarcode] = useState("");

  const [customerId, setCustomerId] = useState("");

  const [currentItem, setCurrentItem] = useState({
    medicine_id: "",
    quantity: "1",
  });

  const [items, setItems] = useState([]);


  // ==========================
  // Fetch Sales
  // ==========================

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");

      setSales(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  };

  // ==========================
  // Fetch Customers
  // ==========================

  const fetchCustomers = async () => {
    try {
     const res = await api.get("/customers");

      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  // ==========================
  // Fetch Medicines
  // ==========================

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");

      setMedicines(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchMedicines();
  }, []);

  // ==========================
  // Barcode Search
  // ==========================

  const handleBarcodeSearch = () => {
    if (!barcode.trim()) return;

    const medicine = medicines.find(
      (m) =>
        String(m.barcode).trim() ===
        String(barcode).trim()
    );

    if (!medicine) {
      alert("Medicine not found");
      return;
    }

    setCurrentItem({
      medicine_id: String(medicine.ID),
      quantity: "1",
    });

    setBarcode("");
  };

  // ==========================
  // Barcode Camera
  // ==========================

  const { ref } = useZxing({
    paused: !showScanner,

    onDecodeResult(result) {
      const code = result.getText
        ? result.getText()
        : result.rawValue;

      setBarcode(code);

      const medicine = medicines.find(
        (m) =>
          String(m.barcode).trim() ===
          String(code).trim()
      );

      if (medicine) {
        setCurrentItem({
          medicine_id: String(medicine.ID),
          quantity: "1",
        });

        setShowScanner(false);
      }
    },
  });

  // ==========================
  // Add Item
  // ==========================

  const addItem = () => {
    if (
      !currentItem.medicine_id ||
      !currentItem.quantity
    ) {
      alert("Select medicine and quantity");
      return;
    }

    const medicine = medicines.find(
      (m) =>
        m.ID === Number(currentItem.medicine_id)
    );

    setItems([
      ...items,
      {
        medicine_id: Number(
          currentItem.medicine_id
        ),
        quantity: Number(
          currentItem.quantity
        ),
        name: medicine?.name,
        price: medicine?.price,
      },
    ]);

    setCurrentItem({
      medicine_id: "",
      quantity: "1",
    });
  };

  // ==========================
  // Remove Item
  // ==========================

  const removeItem = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  // ==========================
  // Create Sale
  // ==========================

  const createSale = async () => {
    try {
      if (!customerId) {
        alert("Select customer");
        return;
      }

      if (items.length === 0) {
        alert("Add at least one item");
        return;
      }

      await axios.post(
        `${API}/sales`,
        {
          customer_id: Number(customerId),
          items: items.map((item) => ({
            medicine_id: item.medicine_id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            ...config.headers,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Sale completed");

      setItems([]);
      setCustomerId("");
      setShowModal(false);

      fetchSales();
      fetchMedicines();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.error ||
          "Failed to create sale"
      );
    }
  };

  // ==========================
  // View Receipt
  // ==========================

  const viewReceipt = async (id) => {
    try {
      const res = await axios.get(
        `${API}/sales/${id}/receipt`,
        config
      );

      setReceipt(res.data.receipt);
      setShowReceipt(true);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Download Receipt
  // ==========================

  const downloadReceipt = async (id) => {
    try {
      const res = await axios.get(
        `${API}/receipt/${id}/pdf`,
        {
          ...config,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `receipt-${id}.pdf`;

      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Filtered Sales
  // ==========================

  const filteredSales = sales.filter((sale) =>
    sale.customer?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="sales-page">

        {/* ================= HEADER ================= */}

        <div className="page-header">
          <div>
            <h1 className="page-title">
              Sales
            </h1>

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

        {/* ================= SEARCH ================= */}

        <div className="table-toolbar">

          <input
            className="table-search"
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* ================= SALES TABLE ================= */}

        <div className="table-card">

          <table className="medicine-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No sales found
                  </td>
                </tr>
              ) : (

                filteredSales.map((sale) => (

                  <tr key={sale.ID}>

                    <td>{sale.ID}</td>

                    <td>
                      {sale.customer?.name}
                    </td>

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
                            viewReceipt(sale.ID)
                          }
                        >
                          Receipt
                        </button>

                        <button
                          className="pdf-btn"
                          onClick={() =>
                            downloadReceipt(sale.ID)
                          }
                        >
                          PDF
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ================= CREATE SALE MODAL ================= */}

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

                  {customers.map((customer) => (

                    <option
                      key={customer.ID}
                      value={customer.ID}
                    >
                      {customer.name}
                    </option>

                  ))}

                </select>

                <div className="barcode-row">

                  <input
                    className="modal-input"
                    placeholder="Barcode"
                    value={barcode}
                    onChange={(e) =>
                      setBarcode(
                        e.target.value
                      )
                    }
                  />

                  <button
                    className="secondary-btn"
                    onClick={
                      handleBarcodeSearch
                    }
                  >
                    Find
                  </button>

                </div>

                <button
                  className="scanner-btn"
                  onClick={() =>
                    setShowScanner(true)
                  }
                >
                  📷 Open Camera Scanner
                </button>

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

                  {medicines.map((medicine) => (

                    <option
                      key={medicine.ID}
                      value={medicine.ID}
                    >
                      {medicine.name}
                      {" - ₦"}
                      {medicine.price}
                    </option>

                  ))}

                </select>

                <input
                  type="number"
                  className="modal-input"
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

                {/* ================= CART ================= */}

                <div className="cart-list">

                  {items.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="cart-item"
                      >

                        <div>

                          <strong>
                            {item.name}
                          </strong>

                          <p>
                            Qty :
                            {" "}
                            {item.quantity}
                          </p>

                        </div>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeItem(index)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    )
                  )}

                </div>

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

        {/* ================= SCANNER ================= */}

        {showScanner && (

          <div className="modal-overlay">

            <div className="scanner-modal">

              <div className="modal-header">

                <h2>
                  Scan Barcode
                </h2>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowScanner(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="modal-body">

                <video
                  ref={ref}
                  className="scanner-video"
                  autoPlay
                  muted
                  playsInline
                />

              </div>

            </div>

          </div>

        )}

        {/* ================= RECEIPT ================= */}

        {showReceipt && receipt && (

          <div className="modal-overlay">

            <div className="receipt-modal">

              <div className="modal-header">

                <h2>
                  Pharmacy Receipt
                </h2>

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
                  <strong>ID:</strong>
                  {" "}
                  {receipt.receipt_id}
                </p>

                <p>
                  <strong>Customer:</strong>
                  {" "}
                  {receipt.customer}
                </p>

                <p>
                  <strong>Cashier:</strong>
                  {" "}
                  {receipt.cashier}
                </p>

                <p>
                  <strong>Date:</strong>
                  {" "}
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