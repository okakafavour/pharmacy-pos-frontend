import { useEffect, useState } from "react";
import api from "../api/api";

function Restocks() {
  const [restocks, setRestocks] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    medicine_id: "",
    supplier_id: "",
    quantity: "",
  });

  const fetchRestocks = async () => {
    try {
      const res = await api.get("/restocks");

      setRestocks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");

      setMedicines(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");

      setSuppliers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  useEffect(() => {
    fetchRestocks();
    fetchMedicines();
    fetchSuppliers();
  }, []);

  const createRestock = async () => {
  try {
    if (
      !formData.medicine_id ||
      !formData.supplier_id ||
      !formData.quantity
    ) {
      alert("All fields are required");
      return;
    }

    await api.post("/restocks", {
      medicine_id: Number(formData.medicine_id),
      supplier_id: Number(formData.supplier_id),
      quantity: Number(formData.quantity),
    });

    alert("Medicine restocked successfully");

    setFormData({
      medicine_id: "",
      supplier_id: "",
      quantity: "",
    });

    setShowModal(false);

    fetchRestocks();
    fetchMedicines();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      "Failed to create restock"
    );
  }
};

  const filteredRestocks = restocks.filter(
    (restock) =>
      restock.medicine?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      restock.supplier?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="restocks-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Restocks
          </h1>

          <p className="page-subtitle">
            Manage medicine inventory restocks
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + New Restock
        </button>
      </div>

      <div className="search-card">
        <input
          className="search-input"
          placeholder="Search medicine or supplier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="table-card">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Current Stock</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredRestocks.length === 0 ? (
              <tr>
                <td colSpan="7">
                  No restocks found
                </td>
              </tr>
            ) : (
              filteredRestocks.map(
                (restock) => (
                  <tr key={restock.ID}>
                    <td>{restock.ID}</td>

                    <td>
                      {
                        restock.medicine
                          ?.name
                      }
                    </td>

                    <td>
                      {
                        restock.supplier
                          ?.name
                      }
                    </td>

                    <td>
                      {
                        restock.quantity
                      }
                    </td>

                    <td>
                      {
                        restock.medicine
                          ?.stock
                      }
                    </td>

                    <td>
                      ₦
                      {Number(
                        restock
                          .medicine
                          ?.price || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      {new Date(
                        restock.CreatedAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h2>New Restock</h2>

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
                value={
                  formData.medicine_id
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
                      {medicine.name}
                      {" (Stock: "}
                      {medicine.stock}
                      {")"}
                    </option>
                  )
                )}
              </select>

              <select
                className="modal-input"
                value={
                  formData.supplier_id
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplier_id:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Supplier
                </option>

                {suppliers.map(
                  (supplier) => (
                    <option
                      key={supplier.ID}
                      value={
                        supplier.ID
                      }
                    >
                      {supplier.name}
                    </option>
                  )
                )}
              </select>

              <input
                className="modal-input"
                type="number"
                placeholder="Quantity"
                value={
                  formData.quantity
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity:
                      e.target.value,
                  })
                }
              />

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
                onClick={createRestock}
              >
                Save Restock
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Restocks;