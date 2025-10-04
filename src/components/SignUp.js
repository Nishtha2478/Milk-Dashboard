import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SignUp() {
  const [userAct, setUserAct] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // Create user in Supabase auth
      const email = `${username}@milk.local`;
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      const userId = authData.user.id

      // Create profile in your profiles table
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: userId,      // use auth user ID
          user_act: userAct,
          email: email,
          role: 'staff'    // default role
        }
      ])

      if (profileError) {
        setError(profileError.message)
        return
      }

      setSuccess(true)
      setUserAct('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Sign up successful! Check your email to confirm.</p>}

      <form onSubmit={handleSignUp}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={userAct}
            onChange={(e) => setUserAct(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
