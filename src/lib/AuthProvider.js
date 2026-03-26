import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadStudent(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadStudent(session.user.id);
      else { setStudent(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadStudent(authId) {
    const { data } = await supabase
      .from('cq_students')
      .select('*')
      .eq('auth_id', authId)
      .single();
    setStudent(data);
    setLoading(false);
  }

  async function signUp(email, password, firstName, lastName, cohort) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    // Create student profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('cq_students')
        .insert({
          auth_id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          cohort: cohort || '2025',
        });
      if (profileError) return { error: profileError };
    }
    return { data };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setStudent(null);
  }

  return (
    <AuthContext.Provider value={{ user, student, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
