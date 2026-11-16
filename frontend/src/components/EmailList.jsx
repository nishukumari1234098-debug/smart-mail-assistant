
function EmailList({ emails, view, onOpen, selectedEmail }) {
  if (emails.length === 0) {
    return (
      <div className="empty-state">
        <h3>
          {view === "inbox"
            ? "📭 Your App Inbox is empty"
            : "📤 No sent emails yet"}
        </h3>

        <p>
          {view === "inbox"
            ? "Emails sent to your registered account through Smart Mail Assistant will appear here. External Gmail inbox syncing is not connected yet."
            : "Emails you send from Smart Mail Assistant will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="email-list">
      {emails.map((email) => (
        <button
          key={email._id}
          className={`email-item ${
            !email.isRead && view === "inbox" ? "unread" : ""
          } ${
            selectedEmail?._id === email._id ? "selected" : ""
          }`}
          onClick={() => onOpen(email)}
        >
          <strong>
            {view === "inbox" ? email.from : email.to}
          </strong>

          <span>{email.subject}</span>

          <small>
            {new Date(email.createdAt).toLocaleString()}
          </small>
        </button>
      ))}
    </div>
  );
}

export default EmailList;
