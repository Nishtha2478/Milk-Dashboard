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
import styles from './styles';

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

  // Apply body styles globally
  useEffect(() => {
    Object.assign(document.body.style, styles.body);
      supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('session', session);
    setUser(session?.user ?? null);
  });
  }, []);
  
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
      <header className="appHeader">
        <h1 className="appHeaderTitle">Milk Dashboard</h1>
        <button
          sclassName="logoutButton"
          onMouseOver={e => (e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor)}
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Logout
        </button>
      </header>

      <main className= "appMain">
        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowPatients(prev => !prev)}>
              Patients {showPatients ? '▲' : '▼'}
            </h2>
            {showPatients && <Patients profile={profile} />}
          </div>
        )}

        {canSeeAllDepartments && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowStaff(prev => !prev)}>
              Staff {showStaff ? '▲' : '▼'}
            </h2>
            {showStaff && <Staff profile={profile} />}
          </div>
        )}

        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 className="sectionTitle"onClick={() => setShowFinance(prev => !prev)}>
              Finance Summary {showFinance ? '▲' : '▼'}
            </h2>
            {showFinance && <FinanceSummary profile={profile} />}
          </div>
        )}

        {canSeeAllDepartments && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowSupplies(prev => !prev)}>
              Supplies {showSupplies ? '▲' : '▼'}
            </h2>
            {showSupplies && <Supplies profile={profile} />}
          </div>
        )}

        {(canSeeAllDepartments || profile.role === 'Department Head') && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowAppointments(prev => !prev)}>
              Appointments {showAppointments ? '▲' : '▼'}
            </h2>
            {showAppointments && <PatientAppointments profile={profile} />}
          </div>
        )}

        {canSeeAllDepartments && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowTransactions(prev => !prev)}>
              Transactions {showTransactions ? '▲' : '▼'}
            </h2>
            {showTransactions && <Transactions profile={profile} />}
          </div>
        )}

        {canSeeSignUp && (
          <div className="section">
            <h2 className="sectionTitle" onClick={() => setShowSignUp(prev => !prev)}>
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
