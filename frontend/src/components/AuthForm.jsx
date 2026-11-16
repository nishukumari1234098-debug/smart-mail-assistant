function AuthForm({
  mode,
  setMode,
  form,
  setForm,
  onSubmit,
  error
}) {
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Smart Mail Assistant</h1>
        <p>Manage your emails with voice assistance.</p>

        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

        {mode === "register" && (
          <input
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-btn" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p>
          {mode === "login"
            ? "Don't have an account?"
            : "Already registered?"}

          <button
            type="button"
            className="link-btn"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login" ? " Register" : " Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;