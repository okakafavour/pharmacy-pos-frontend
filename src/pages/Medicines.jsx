import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/medicines.css";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    description: "",
    price: "",
    stock: "",
    expire_date: "",
  });

    const fetchMedicines = async () => {
      try {
        const res = await api.get("/medicines");

        setMedicines(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      }
    };

    useEffect(() => {
      fetchMedicines();
    }, []);

  const handleAddMedicine = async () => {
    try {
      if (
        !formData.name ||
        !formData.barcode ||
        !formData.description ||
        !formData.price ||
        !formData.stock ||
        !formData.expire_date
      ) {
        alert("Please fill all fields");
        return;
      }

      const payload = {
        name: formData.name.trim(),
        barcode: formData.barcode.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        expire_date: `${formData.expire_date}T00:00:00Z`,
      };

      const res = await api.post("/medicines", payload);

      alert("Medicine added successfully");

      setShowModal(false);

      setFormData({
        name: "",
        barcode: "",
        description: "",
        price: "",
        stock: "",
        expire_date: "",
      });

      fetchMedicines();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Failed to add medicine"
      );
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const res = await api.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (error) {
      console.log(error);
      alert("Failed to delete medicine");
    }
  };

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      medicine.barcode
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="medicines-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Medicines
          </h1>

          <p className="page-subtitle">
            Manage pharmacy inventory
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Medicine
        </button>
      </div>

      <div className="table-card">

        <div className="table-toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              className="table-search"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="medicine-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan="7">
                  No medicines found
                </td>
              </tr>
            ) : (
              filteredMedicines.map(
                (medicine) => (
                  <tr key={medicine.ID}>
                    <td>
                      <div className="medicine-name">
                        <div className="medicine-avatar">
                          💊
                        </div>

                        <div>
                          <strong>{medicine.name}</strong>
                          <small>{medicine.barcode}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {medicine.description}
                    </td>

                    <td>
                      <span
                        className={
                          medicine.stock <= 5
                            ? "stock-badge low"
                            : "stock-badge good"
                        }
                      >
                        {medicine.stock}
                      </span>
                    </td>

                   <td className="price">
                      ₦{Number(medicine.price || 0).toLocaleString()}
                   </td>

                    <td className="expiry-date">
                      {medicine.expire_date
                        ? new Date(medicine.expire_date).toLocaleDateString()
                        : "--"}
                    </td>

                    <div className="action-group">
                      <button className="edit-btn">
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm(`Delete ${medicine.name}?`)) {
                            deleteMedicine(medicine.ID);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </div>
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
              <h2>💊 Add New Medicine</h2>

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

              <input
                className="modal-input modal-textarea"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="modal-input"
                placeholder="Barcode"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    barcode: e.target.value,
                  })
                }
              />

              <textarea
                className="modal-input"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="modal-input"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />

              <input
                className="modal-input"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
              />

              <input
                className="modal-input"
                type="date"
                value={formData.expire_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expire_date: e.target.value,
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
                onClick={handleAddMedicine}
              >
                Save Medicine
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;