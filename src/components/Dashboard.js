import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ profile }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {profile.user_act}</h1>

      {(profile.role === 'Owner' || profile.role === 'Supervisor') && (
        <button onClick={() => navigate('/signup')} style={{ marginBottom: 20 }}>
          Add New User
        </button>
      )}

      <div>
        <h2>Patients</h2>
        <button onClick={() => navigate('/patients')}>View All Patients</button>
      </div>

      <div>
        <h2>Staff</h2>
        <button onClick={() => navigate('/staff')}>View All Staff</button>
      </div>

      <div>
        <h2>Appointments</h2>
        <button onClick={() => navigate('/appointments')}>View All Appointments</button>
      </div>

      <div>
        <h2>Finance</h2>
        <button onClick={() => navigate('/finance')}>View Finance Summary</button>
      </div>

      <div>
        <h2>Supplies</h2>
        <button onClick={() => navigate('/supplies')}>View Supplies</button>
      </div>

      <div>
        <h2>Transactions</h2>
        <button onClick={() => navigate('/transactions')}>View Transactions</button>
      </div>
    </div>
  );
}
