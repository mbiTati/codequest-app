import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadOrLinkStudent(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadOrLinkStudent(session.user);
      else { setStudent(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadOrLinkStudent(authUser) {
    // Try to find by auth_id first
    let { data } = await supabase
      .from('cq_students')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (data) {
      setStudent(data);
      setLoading(false);
      return;
    }

    // If not found by auth_id, try by email (pre-created by teacher)
    const { data: byEmail } = await supabase
      .from('cq_students')
      .select('*')
      .eq('email', authUser.email.toLowerCase())
      .single();

    if (byEmail && !byEmail.auth_id) {
      // Link the auth_id to the pre-created profile
      const { data: updated } = await supabase
        .from('cq_students')
        .update({ auth_id: authUser.id })
        .eq('id', byEmail.id)
        .select()
        .single();
      setStudent(updated || byEmail);
    } else if (byEmail) {
      setStudent(byEmail);
    } else {
      setStudent(null);
    }
    setLoading(false);
  }

  async function signUp(email, password, firstName, lastName, cohort) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    if (data.user) {
      const { data: existing } = await supabase
        .from('cq_students')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existing) {
        await supabase
          .from('cq_students')
          .update({ auth_id: data.user.id })
          .eq('id', existing.id);
      } else {
        const { error: profileError } = await supabase
          .from('cq_students')
          .insert({
            auth_id: data.user.id,
            email: email.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
            cohort: cohort || '2025',
          });
        if (profileError) return { error: profileError };
      }
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
