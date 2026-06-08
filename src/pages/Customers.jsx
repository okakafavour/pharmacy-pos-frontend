import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!formData.name) {
        alert("Customer name is required");
        return;
      }

      await axios.post(
        `${API}/customers`,
        {
          name: formData.name,
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

      alert("Customer added successfully");

      setFormData({
        name: "",
        phone: "",
        address: "",
      });

      setShowModal(false);

      fetchCustomers();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
          "Failed to add customer"
      );
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Customers
          </h1>

          <p className="page-subtitle">
            Manage customer records
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Customer
        </button>
      </div>

      <div className="search-card">
        <input
          className="search-input"
          placeholder="Search customer..."
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
              <th>Phone</th>
              <th>Address</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map(
                (customer) => (
                  <tr key={customer.ID}>
                    <td>{customer.ID}</td>

                    <td>{customer.name}</td>

                    <td>{customer.phone}</td>

                    <td>{customer.address}</td>

                    <td>
                      {new Date(
                        customer.CreatedAt
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
              <h2>Add Customer</h2>

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
                placeholder="Customer Name"
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
                onClick={handleAddCustomer}
              >
                Save Customer
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Customers;