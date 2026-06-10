import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "cashier",
    });

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${API}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        `${API}/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User created successfully");

      setShowModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "cashier",
      });

      fetchUsers();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
          "Failed to create user"
      );
    }
  };

  return (
    <div className="users-page">

      <div className="page-header">
        <div>
          <h1 className="page-title">
            Users
          </h1>

          <p className="page-subtitle">
            Manage system users
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + New User
        </button>
      </div>

      <div className="table-card">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.ID}>
                  <td>{user.ID}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`role-badge ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      user.CreatedAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h2>Create User</h2>

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
                placeholder="Full Name"
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
                placeholder="Email"
                type="email"
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
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
              />

              <select
                className="modal-input"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              >
                <option value="admin">
                  Admin
                </option>

                <option value="manager">
                  Manager
                </option>

                <option value="pharmacist">
                  Pharmacist
                </option>

                <option value="cashier">
                  Cashier
                </option>
              </select>

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
                onClick={createUser}
              >
                Create User
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Users;