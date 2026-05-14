import { useState, useEffect } from 'react';
import axios from 'axios';

function GettingSalaryDetails() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  const paginatedUserData = userData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Salary Details</h1>
      {loading ? (
        <div className="text-center text-gray-600 mt-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8">{error}</div>
      ) : userData.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">No salary details available.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credited Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUserData.map((data) => (
                  <tr key={data.employeeCode}>
                    <td className="px-6 py-4 whitespace-nowrap">{data.employeeCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.monthOfSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.creditedAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-l-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-200 text-gray-600">
                Page {page + 1} of {Math.ceil(userData.length / rowsPerPage)}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= Math.ceil(userData.length / rowsPerPage) - 1}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-r-md hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default GettingSalaryDetails;
