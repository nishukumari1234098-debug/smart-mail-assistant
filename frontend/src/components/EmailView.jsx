
import {
  speakText,
  pauseVoice,
  resumeVoice,
  stopVoice
} from "../services/voice";

function EmailView({ email }) {
  if (!email) {
    return (
      <div className="empty-state">
        <h3>📨 Select an Email</h3>
        <p>Select an email from the list to read its complete message.</p>
      </div>
    );
  }

  const readEmail = () => {
    speakText(
      `From ${email.from}. Subject ${email.subject}. Message ${email.message}`
    );
  };

  return (
    <div className="email-detail">
      <h3>{email.subject}</h3>

      <p><strong>From:</strong> {email.from}</p>
      <p><strong>To:</strong> {email.to}</p>

      <hr />

      <p>{email.message}</p>

      <div className="voice-controls">
        <button onClick={readEmail}>▶ Play</button>
        <button onClick={pauseVoice}>⏸ Pause</button>
        <button onClick={resumeVoice}>▶ Resume</button>
        <button onClick={stopVoice}>■ Stop</button>
      </div>
    </div>
  );
}

export default EmailView;
