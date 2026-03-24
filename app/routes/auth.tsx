import { usePuterStore } from 'lib/puter'

export const metadata = {
  title: 'Shortlist | Auth Page',
  description: 'This is the authentication page for Shortlist.'
}

const Auth = () => {
  const { isLoading, auth } = usePuterStore()

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log in and pick up where you left off</h2>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                Signing in ...
              </button>
            ) : auth?.isAuthenticated ? (
              <button className="auth-button" onClick={auth.signOut}>
                Log Out
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn}>
                Log In
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth
