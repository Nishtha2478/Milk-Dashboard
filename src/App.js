import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Dashboard from './components/Dashboard';
import PatientsPage from './components/PatientsPage';
//import StaffPage from './components/StaffPage';
//import AppointmentsPage from './components/PatientAppointmentsPage';
//import FinancePage from './components/FinancePage';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login onLogin={setUser} />;
  if (!profile) return <p>No profile found for this user</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard profile={profile} />} />
        <Route path="/patients" element={<PatientsPage profile={profile} />} />
       {/* <Route path="/staff" element={<StaffPage profile={profile} />} />
        <Route path="/appointments" element={<AppointmentsPage profile={profile} />} />
        <Route path="/finance" element={<FinancePage profile={profile} />} /> */}
        <Route
          path="/signup"
          element={
            profile.role === 'Owner' || profile.role === 'Supervisor' ? (
              <SignUp profile={profile} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
