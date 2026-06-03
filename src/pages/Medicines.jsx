import { useState } from "react";
function Medicines() {
  const [showModal, setShowModal] = useState(false);

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      category: "Tablet",
      stock: 120,
      price: 500,
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Capsule",
      stock: 15,
      price: 1200,
    },
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Medicines</h1>
          <p className="page-subtitle">
            Manage pharmacy inventory and stock
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Medicine
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.stock}</td>
                <td>₦{medicine.price}</td>

                <td>
                  {medicine.stock > 20 ? (
                    <span className="status-badge success">
                      In Stock
                    </span>
                  ) : (
                    <span className="status-badge danger">
                      Low Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <h2>Add Medicine</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">

              <input
                type="text"
                placeholder="Medicine Name"
                className="modal-input"
              />

              <input
                type="text"
                placeholder="Category"
                className="modal-input"
              />

              <input
                type="number"
                placeholder="Stock"
                className="modal-input"
              />

              <input
                type="number"
                placeholder="Price"
                className="modal-input"
              />

            </div>

            <div className="modal-footer">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn">
                Save Medicine
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Medicines;