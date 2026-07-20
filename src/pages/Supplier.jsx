import { useEffect, useState } from "react";
import api from "../api/api";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");

      setSuppliers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async () => {
  try {
    if (!formData.name.trim()) {
      alert("Supplier name is required");
      return;
    }

    await api.post("/suppliers", {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });

    alert("Supplier added successfully");

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setShowModal(false);

    fetchSuppliers();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      "Failed to add supplier"
    );
  }
};

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="supplier-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Suppliers
          </h1>

          <p className="page-subtitle">
            Manage suppliers
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Supplier
        </button>
      </div>

      <div className="table-toolbar">
        <input
          className="table-search"
          placeholder="Search supplier..."
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No suppliers found
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(
                (supplier) => (
                  <tr key={supplier.ID}>
                    <td>{supplier.ID}</td>

                    <td>{supplier.name}</td>

                    <td>{supplier.email}</td>

                    <td>{supplier.phone}</td>

                    <td>{supplier.address}</td>

                    <td>
                      {new Date(
                        supplier.CreatedAt
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
              <h2>Add Supplier</h2>

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
                className="modal-input"
                placeholder="Supplier Name"
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
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <input
                className="modal-input"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <textarea
                className="modal-input"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
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
                onClick={handleAddSupplier}
              >
                Save Supplier
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Supplier;