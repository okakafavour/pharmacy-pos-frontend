import { useEffect, useState } from "react";
import axios from "axios";

function Supplier() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

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
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/suppliers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuppliers(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!formData.name) {
        alert("Supplier name is required");
        return;
      }

      await axios.post(
        `${API}/suppliers`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      console.log(error);

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

      <div className="search-card">
        <input
          className="search-input"
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