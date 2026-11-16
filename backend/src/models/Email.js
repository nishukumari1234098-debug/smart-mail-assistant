import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        from: {
      type: String,
      required: true
    },

    to: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    smtpMessageId: {
      type: String
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;
