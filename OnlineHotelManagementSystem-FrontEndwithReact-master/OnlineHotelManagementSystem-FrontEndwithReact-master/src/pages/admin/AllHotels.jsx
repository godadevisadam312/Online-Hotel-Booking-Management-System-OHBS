import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GettingSalaryDetails() {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const formattedData = response.data.map((user) => ({
          employeeCode: user.id,
          monthOfSalary: 'October',
          creditedAmount: Math.floor(Math.random() * 10000),
        }));
        setUserData(formattedData);
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (employeeCode) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${employeeCode}`);
      setUserData((prevUserData) =>
        prevUserData.filter((user) => user.employeeCode !== employeeCode)
      );
      setDeleteConfirmation(null);
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Error deleting user. Please try again.');
    }
  };

  const confirmDelete = (employeeCode) => {
    setDeleteConfirmation(employeeCode);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleUpdate = (employeeCode) => {
    navigate(`/updatingSalaryDetails/${employeeCode}`);
  };

  const filteredUserData = userData.filter(user =>
    user.employeeCode.toString().includes(searchQuery) || 
    user.monthOfSalary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h3>All Employee Salary Details</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Employee Code or Month..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div style={{ overflowY: 'auto', maxHeight: '350px', width: '100%' }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Month</th>
                <th>Credited Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No salary details available.
                  </td>
                </tr>
              ) : (
                filteredUserData.map((data) => (
                  <tr key={data.employeeCode}>
                    <td>{data.employeeCode}</td>
                    <td>{data.monthOfSalary}</td>
                    <td>{data.creditedAmount}</td>
                    <td>
                      <i
                        className="fas fa-pencil-alt text-primary"
                        style={{ cursor: 'pointer', marginRight: '10px', fontSize: '20px' }}
                        onClick={() => handleUpdate(data.employeeCode)}
                        title="Edit"
                      ></i>
                      <i
                        className="fas fa-trash-alt text-danger"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => confirmDelete(data.employeeCode)}
                        title="Delete"
                      ></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {deleteConfirmation && (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
          <div className="relative w-auto max-w-sm mx-auto my-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col p-4">
              <div className="text-center p-4">
                <p className="text-lg font-semibold">Are you sure you want to delete this user?</p>
              </div>
              <div className="flex justify-end p-4 space-x-4">
                <button
                  onClick={() => handleDelete(deleteConfirmation)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default GettingSalaryDetails;
