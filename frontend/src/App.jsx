import { useEffect, useState } from "react";
import "./App.css";

import api, { setAuthToken } from "./services/api";
import connectSocket from "./services/socket";
import { speakText, stopVoice } from "./services/voice";

import AuthForm from "./components/AuthForm";
import Sidebar from "./components/Sidebar";
import ComposeEmail from "./components/ComposeEmail";
import EmailList from "./components/EmailList";
import EmailView from "./components/EmailView";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [mode, setMode] = useState("login");
  const [view, setView] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [mailForm, setMailForm] = useState({
    to: "",
    subject: "",
    message: ""
  });

  // Set token for API requests
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Login and Register
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = mode === "login" ? "login" : "register";

      const response = await api.post(
        `/auth/${endpoint}`,
        authForm
      );

      if (mode === "register") {
        alert("Registration successful! Please login.");
        setMode("login");
        setAuthForm({
          name: "",
          email: authForm.email,
          password: ""
        });
        return;
      }

      const newToken = response.data.token;
      const newUser = response.data.user;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login/Register failed"
      );
    }
  };

  // Logout and clear old token
  const logout = () => {
    stopVoice();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuthToken("");
    setToken("");
    setUser(null);
    setEmails([]);
    setSelectedEmail(null);
    setError("");
  };

  // Load Inbox or Sent emails
  const loadEmails = async () => {
    try {
      const endpoint = view === "inbox" ? "inbox" : "sent";

      const response = await api.get(`/emails/${endpoint}`);

      setEmails(response.data.emails || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message || "Unable to load emails"
        );
      }
    }
  };

  useEffect(() => {
    if (token && (view === "inbox" || view === "sent")) {
      loadEmails();
    }
  }, [token, view]);

  // Real-time Socket.IO notifications
  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("new-email", (email) => {
      setNotification(`New email from ${email.from}`);

      if (view === "inbox") {
        setEmails((previous) => [
          {
            ...email,
            _id: email.id,
            isRead: false,
            createdAt: new Date()
          },
          ...previous
        ]);
      }

      if (voiceOn) {
        speakText(
          `New email from ${email.from}. Subject: ${email.subject}`
        );
      }
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, view, voiceOn]);

  // Send email
  const sendMail = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/emails/send", mailForm);

      alert(response.data.message || "Email sent successfully!");

      setMailForm({
        to: "",
        subject: "",
        message: ""
      });

      setSelectedEmail(null);
      setView("sent");
    } catch (err) {
      console.error("Email sending error:", err.response?.data || err);

      setError(
        err.response?.data?.message || "Email sending failed"
      );
    }
  };

  // Open email and mark it as read
  const openEmail = async (email) => {
    setSelectedEmail(email);

    if (!email.isRead && view === "inbox") {
      try {
        await api.patch(`/emails/${email._id}/read`);

        setEmails((previous) =>
          previous.map((item) =>
            item._id === email._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setSelectedEmail({ ...email, isRead: true });
      } catch (err) {
        console.log("Read status update failed:", err.message);
      }
    }
  };

  const unreadCount = emails.filter(
    (email) => !email.isRead
  ).length;

  // Login screen
  if (!token) {
    return (
      <AuthForm
        mode={mode}
        setMode={setMode}
        form={authForm}
        setForm={setAuthForm}
        onSubmit={handleAuth}
        error={error}
      />
    );
  }

  // Main dashboard
  return (
    <div className="app">
      <header className="topbar">
        <h2>Smart Mail Assistant</h2>

        <div>
          <span>Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard">
        <Sidebar
          view={view}
          setView={setView}
          unreadCount={unreadCount}
          voiceOn={voiceOn}
          setVoiceOn={setVoiceOn}
          setSelectedEmail={setSelectedEmail}
        />

        <section className="content">
          {notification && (
            <div className="notification">
              {notification}
              <button onClick={() => setNotification("")}>
                ×
              </button>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {view === "compose" && (
            <ComposeEmail
              form={mailForm}
              setForm={setMailForm}
              onSend={sendMail}
            />
          )}

          {(view === "inbox" || view === "sent") && (
            <>
              <h2>
                {view === "inbox" ? "Inbox" : "Sent Emails"}
              </h2>

              <div className="email-layout">
                <EmailList
                  emails={emails}
                  view={view}
                  onOpen={openEmail}
                  selectedEmail={selectedEmail}
                />

                <EmailView email={selectedEmail} />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;