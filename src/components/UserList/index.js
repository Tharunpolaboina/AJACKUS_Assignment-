import React, { Component } from "react";
import axios from "axios";
import "./index.css";

class UserManagement extends Component {
  state = {
    users: [],
    editingUser: null,
    formData: { firstName: "", lastName: "", email: "", department: "" },
    error: null,
    currentPage: 1,
    usersPerPage: 3,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await axios.get("https://ajackus-assignment-1-7m8z.onrender.com/users");
      this.setState({ users: response.data, error: null });
    } catch (error) {
      this.setState({ error: "Failed to fetch users" });
    }
  };

  handleInputChange = (e) => {
    this.setState({ formData: { ...this.state.formData, [e.target.name]: e.target.value } });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { users, editingUser, formData } = this.state;

    try {
      if (editingUser) {
        await axios.put(`https://ajackus-assignment-1-7m8z.onrender.com/users/${editingUser.id}`, formData);
      } else {
        const response = await axios.post("https://ajackus-assignment-1-7m8z.onrender.com/users", formData);
        this.setState({ users: [...users, response.data] });
      }
      this.setState({ editingUser: null, formData: { firstName: "", lastName: "", email: "", department: "" }, error: null });
      this.fetchUsers();
    } catch (error) {
      this.setState({ error: "Failed to save user" });
    }
  };

  handleEdit = (user) => {
    this.setState({ editingUser: user, formData: { ...user } });
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`https://ajackus-assignment-1-7m8z.onrender.com/users/${id}`);
      this.fetchUsers();
    } catch (error) {
      this.setState({ error: "Failed to delete user" });
    }
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { users, formData, editingUser, error, currentPage, usersPerPage } = this.state;

                        {/* Pagination Logic */}
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;                       
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
      <div className="container">
        <h2>User Management</h2>
  
                            {/* User Form Section */}
        <div className="form-container">
          <h3>{editingUser ? "Edit User" : "Add User"}</h3>
          <form onSubmit={this.handleSubmit}>
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={this.handleInputChange} required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={this.handleInputChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={this.handleInputChange} required />
            <input name="department" placeholder="Department" value={formData.department} onChange={this.handleInputChange} required />
        <div className="btn-container">    <button type="submit" className="btn submit">{editingUser ? "Update User" : "Add User"}</button></div>
          </form>
        </div>

                          {/*User Table Section*/}
        <div className="table-responsive">
          {users.length > 0 && (             
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.department}</td>
                      <td>
                        <button onClick={() => this.handleEdit(user)} className="btn edit">Edit</button>
                        <button onClick={() => this.handleDelete(user.id)} className="btn delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             
                { /* Pagination Controls */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (        
                  <button 
                    key={index + 1} 
                    onClick={() => this.handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

export default UserManagement;
