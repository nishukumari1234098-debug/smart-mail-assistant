
function ComposeEmail({ form, setForm, onSend }) {
  return (
    <form className="compose" onSubmit={onSend}>
      <h2>✉️ Compose a New Email</h2>

      <input
        type="email"
        placeholder="Recipient email address"
        required
        value={form.to}
        onChange={(e) =>
          setForm({ ...form, to: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Email subject"
        required
        value={form.subject}
        onChange={(e) =>
          setForm({ ...form, subject: e.target.value })
        }
      />

      <textarea
        placeholder="Write your message here..."
        required
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
      />

      <button className="primary-btn" type="submit">
        ✈️ Send Email
      </button>
    </form>
  );
}

export default ComposeEmail;
