import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../Dashboard/Dashboard.css';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my-requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await api.delete(`/requests/${requestId}`);
        fetchRequests();
      } catch (error) {
        console.error('Error cancelling request:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Adoption Requests</h1>
        <p>Track your adoption requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="no-data">
          <p>You haven't made any adoption requests yet.</p>
        </div>
      ) : (
        <div className="requests-table">
          <table>
            <thead>
              <tr><th>Pet Name</th><th>Request Date</th><th>Pickup Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.petName}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(request.pickupDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <button onClick={() => cancelRequest(request._id)} className="btn-danger">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequests;