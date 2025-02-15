import { useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check password strength
  useEffect(() => {
    if (isSignUp) {
      setPasswordStrength({
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password)
      })
    }
  }, [password, isSignUp])

  // Check if passwords match
  useEffect(() => {
    if (isSignUp) {
      setPasswordsMatch(password === passwordConfirm || passwordConfirm === '')
    }
  }, [password, passwordConfirm, isSignUp])

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      if (isSignUp) {
        if (!isPasswordValid()) {
          throw new Error('Password does not meet requirements')
        }
        if (password !== passwordConfirm) {
          throw new Error('Passwords do not match')
        }
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        })
        if (signUpError) throw signUpError
        setSuccessMessage(`Welcome to Scriptracula, ${firstName}!`)
        setShowSuccess(true)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        setSuccessMessage('Welcome back!')
        setShowSuccess(true)
      }
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {showSuccess ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50 animate-fadeOut">
          <div className="transform scale-150 animate-success mb-4">
            <svg 
              className="w-16 h-16 text-green-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="animate-success-message text-2xl font-semibold text-gray-800">
            {successMessage}
          </div>
        </div>
      ) : null}

      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Scriptracula
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Track your writing goals and progress
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <>
                <div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <input
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isSignUp ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {isSignUp && (
              <>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2 space-y-2 text-sm">
                  <p className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}>
                    ✓ At least 8 characters
                  </p>
                  <p className={passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one uppercase letter
                  </p>
                  <p className={passwordStrength.hasLowerCase ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one lowercase letter
                  </p>
                  <p className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one number
                  </p>
                  <p className={passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one special character (!@#$%^&*)
                  </p>
                </div>

                {/* Password Match Indicator */}
                {passwordConfirm && (
                  <p className={passwordsMatch ? "text-green-600" : "text-red-500"}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading || (isSignUp && (!isPasswordValid() || !passwordsMatch))}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setFirstName('')
                setLastName('')
                setPasswordConfirm('')
                setPassword('')
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 