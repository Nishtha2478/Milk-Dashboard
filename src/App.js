import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Patients from './components/Patients';
import Staff from './components/Staff';
import PatientAppointments from './components/PatientAppointments';
import FinanceSummary from './components/FinanceSummary';
import Supplies from './components/Supplies';
import Transactions from './components/Transactions';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
  let isMounted = true;

  // Get the current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (isMounted) setUser(session?.user ?? null);
  });

  // Listen for auth changes
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
    setLoading(false); // <-- this uses setLoading
    return; // skip if no user
  }
const fetchProfile = async () => {
    setLoading(true); // start loading
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();

    console.log('Profile fetch result:', data, error);
    setProfile(data);
    setLoading(false); // done loading
  };

  fetchProfile();
}, [user]);


  if (!user) return <Login onLogin={setUser} />;
  if (!profile) return <p>No profile found for this user</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Title">Milk Dashboard</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Logout
        </button>
         {profile && <Patients profile={profile} />}
         {profile && <Staff profile={profile}/>}
         {profile && <FinanceSummary profile ={profile}/>}
         {profile && <Supplies profile ={profile}/>}
         {profile && <PatientAppointments profile ={profile}/>}
         {profile && <Transactions profile ={profile}/>}
      </header>
    </div>
  );
}

export default App;