import React from 'react';
import Login from './Login';

function Home() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome to Milk Dashboard</h1>
      <p>Please login to continue</p>
      <Login />
    </div>
  );
}

export default Home;
