import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Patients from './components/Patients';
import Staff from './components/Staff';
import PatientAppointments from './components/PatientAppointments';
import FinanceSummary from './components/FinanceSummary';
import Supplies from './components/Supplies';
import Transactions from './components/Transactions';
import './index.css'; // your plain CSS

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
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

  console.log('Logged-in user ID:', user?.id);

  // Fetch profile for logged-in user
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', user.id)
        .maybeSingle();

      console.log('Profile fetch result:', data, error);
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login onLogin={setUser} />;
  if (!profile) return <p>No profile found for this user</p>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Milk Dashboard</h1>
        <button
          className="logout-button"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Logout
        </button>
      </header>

      <main className="app-main">
        <Patients profile={profile} />
        <Staff profile={profile} />
        <FinanceSummary profile={profile} />
        <Supplies profile={profile} />
        <PatientAppointments profile={profile} />
        <Transactions profile={profile} />
      </main>
    </div>
  );
}

export default App;
