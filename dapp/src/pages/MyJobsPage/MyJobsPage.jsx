import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MyJobsPage.css';

const MyJobsDashboard = () => {
  // Mock data for demonstration
  const analyticsData = [
    { month: 'Jan', completedJobs: 18, tokens: 540, rating: 4.3 },
    { month: 'Feb', completedJobs: 22, tokens: 660, rating: 4.5 },
    { month: 'Mar', completedJobs: 25, tokens: 750, rating: 4.6 },
    { month: 'Apr', completedJobs: 30, tokens: 900, rating: 4.7 },
    { month: 'May', completedJobs: 28, tokens: 840, rating: 4.8 },
    { month: 'Jun', completedJobs: 35, tokens: 1050, rating: 5.0 },
  ];

  const stats = [
    { 
      title: "Completed Jobs",
      value: "120",
      trend: "+12% vs last month",
      className: "stat-card completed"
    },
    {
      title: "Pending Jobs",
      value: "8",
      trend: "-3% vs last month",
      className: "stat-card pending"
    },
    {
      title: "In Progress",
      value: "5",
      trend: "Same as last month",
      className: "stat-card progress"
    },
    {
      title: "Total Tokens",
      value: "1,050",
      trend: "+25% vs last month",
      className: "stat-card tokens"
    }
  ];

  const recentJobs = [
    { id: 1, title: "Garden Maintenance", date: "2024-03-10", status: "Completed", rating: 5 },
    { id: 2, title: "House Cleaning", date: "2024-03-09", status: "In Progress", rating: null },
    { id: 3, title: "Pet Sitting", date: "2024-03-08", status: "Completed", rating: 4.8 },
    { id: 4, title: "Lawn Mowing", date: "2024-03-07", status: "Pending", rating: null },
  ];

  const getStatusClassName = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'Pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Caretaker Dashboard</h1>
          <div className="rating-display">
            ⭐ <span>4.8</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={stat.className}>
              <div className="stat-content">
                <div className="stat-header">
                  <h3>{stat.title}</h3>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div className="stat-trend">
                  <span>📈</span> {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h2>Performance Overview</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="completedJobs" stroke="#2196F3" name="Completed Jobs" />
                  <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#4CAF50" name="Rating" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h2>Tokens Earned</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tokens" stroke="#9C27B0" name="Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="recent-jobs-card">
          <h2>Recent Jobs</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.date}</td>
                    <td>
                      <span className={`status-badge ${getStatusClassName(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.rating ? (
                        <div className="rating">
                          ⭐ {job.rating}
                        </div>
                      ) : (
                        <span className="pending-rating">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsDashboard;