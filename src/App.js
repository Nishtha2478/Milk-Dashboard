import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Patients from './components/Patients';
import Staff from './components/Staff';
import PatientAppointments from './components/PatientAppointments';
import FinanceSummary from './components/FinanceSummary';
import Supplies from './components/Supplies';
import Transactions from './components/Transactions';
import SignUp from './components/SignUp';
import './index.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPatients, setShowPatients] = useState(true);
  const [showStaff, setShowStaff] = useState(true);
  const [showFinance, setShowFinance] = useState(true);
  const [showSupplies, setShowSupplies] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);
  const [showTransactions, setShowTransactions] = useState(true);
  const [showSignUp, setShowSignUp] = useState(true);

  // Auth listener
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

  // Fetch profile
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

  const canSeeSignUp = profile.role === 'Owner' || profile.role === 'Supervisor';
  const canSeeAllDepartments = profile.role === 'Owner' || profile.role === 'Supervisor';

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
        {/* Patients Section */}
        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 onClick={() => setShowPatients(prev => !prev)} style={{ cursor: 'pointer' }}>
              Patients {showPatients ? '▲' : '▼'}
            </h2>
            {showPatients && <Patients profile={profile} />}
          </div>
        )}

        {/* Staff Section */}
        {canSeeAllDepartments && (
          <div className="section">
            <h2 onClick={() => setShowStaff(prev => !prev)} style={{ cursor: 'pointer' }}>
              Staff {showStaff ? '▲' : '▼'}
            </h2>
            {showStaff && <Staff profile={profile} />}
          </div>
        )}

        {/* Finance Section */}
        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 onClick={() => setShowFinance(prev => !prev)} style={{ cursor: 'pointer' }}>
              Finance Summary {showFinance ? '▲' : '▼'}
            </h2>
            {showFinance && <FinanceSummary profile={profile} />}
          </div>
        )}

        {/* Supplies Section */}
        {canSeeAllDepartments && (
          <div className="section">
            <h2 onClick={() => setShowSupplies(prev => !prev)} style={{ cursor: 'pointer' }}>
              Supplies {showSupplies ? '▲' : '▼'}
            </h2>
            {showSupplies && <Supplies profile={profile} />}
          </div>
        )}

        {/* Appointments Section */}
        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 onClick={() => setShowAppointments(prev => !prev)} style={{ cursor: 'pointer' }}>
              Appointments {showAppointments ? '▲' : '▼'}
            </h2>
            {showAppointments && <PatientAppointments profile={profile} />}
          </div>
        )}

        {/* Transactions Section */}
        {canSeeAllDepartments && (
          <div className="section">
            <h2 onClick={() => setShowTransactions(prev => !prev)} style={{ cursor: 'pointer' }}>
              Transactions {showTransactions ? '▲' : '▼'}
            </h2>
            {showTransactions && <Transactions profile={profile} />}
          </div>
        )}

        {/* Sign Up Section */}
        {canSeeSignUp && (
          <div className="section">
            <h2 onClick={() => setShowSignUp(prev => !prev)} style={{ cursor: 'pointer' }}>
              Sign Up {showSignUp ? '▲' : '▼'}
            </h2>
            {showSignUp && <SignUp profile={profile} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
