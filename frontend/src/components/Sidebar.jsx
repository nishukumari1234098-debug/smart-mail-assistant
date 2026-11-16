
function Sidebar({
  view,
  setView,
  unreadCount,
  voiceOn,
  setVoiceOn,
  setSelectedEmail
}) {
  const changeView = (newView) => {
    setView(newView);
    setSelectedEmail(null);
  };

  return (
    <aside className="sidebar">
      <button onClick={() => changeView("compose")}>
        ✏️ Compose Email
      </button>

      <button onClick={() => changeView("inbox")}>
        📥 App Inbox ({unreadCount})
      </button>

      <button onClick={() => changeView("sent")}>
        📤 Sent Emails
      </button>

      <label className="voice-setting">
        <input
          type="checkbox"
          checked={voiceOn}
          onChange={(e) => setVoiceOn(e.target.checked)}
        />
        🔊 Voice Notifications
      </label>
    </aside>
  );
}

export default Sidebar;
