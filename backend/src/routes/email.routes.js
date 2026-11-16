import express from "express";
import Email from "../models/Email.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import { sendEmail } from "../services/mail.service.js";

const createEmailRouter = (io) => {
  const router = express.Router();

  router.use(authMiddleware);

  // SEND EMAIL
  router.post("/send", async (req, res) => {
    try {
      const { to, subject, message } = req.body;

      if (!to || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "To, subject and message are required"
        });
      }

      const sender = await User.findById(req.user.id);

      if (!sender) {
        return res.status(404).json({
          success: false,
          message: "Sender not found"
        });
      }

      // Check whether recipient is registered in our app
      const recipient = await User.findOne({
        email: to.toLowerCase()
      });

      // Send external email through Nodemailer
      const result = await sendEmail({
        to,
        subject,
        message
      });

      // Save email in MongoDB
      const savedEmail = await Email.create({
        sender: sender._id,
        recipient: recipient?._id || null,
        from: sender.email,
        to,
        subject,
        message,
        smtpMessageId: result.messageId
      });

      // Notify registered recipient in real time
      if (recipient) {
        io.to(recipient._id.toString()).emit("new-email", {
          id: savedEmail._id,
          from: sender.email,
          subject,
          message
        });
      }

      res.status(201).json({
        success: true,
        message: "Email submitted successfully",
        email: savedEmail
      });

    } catch (error) {
      console.error("Send email error:", error.message);

      res.status(500).json({
        success: false,
        message: "Email sending failed"
      });
    }
  });

  // INBOX
  router.get("/inbox", async (req, res) => {
    try {
      const emails = await Email.find({
        recipient: req.user.id
      })
        .populate("sender", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        emails
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to load inbox"
      });
    }
  });

  // SENT EMAILS
  router.get("/sent", async (req, res) => {
    try {
      const emails = await Email.find({
        sender: req.user.id
      })
        .populate("recipient", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        emails
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to load sent emails"
      });
    }
  });

  // MARK EMAIL AS READ
  router.patch("/:id/read", async (req, res) => {
    try {
      const email = await Email.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient: req.user.id
        },
        {
          isRead: true
        },
        {
          new: true
        }
      );

      if (!email) {
        return res.status(404).json({
          success: false,
          message: "Email not found"
        });
      }

      res.json({
        success: true,
        message: "Email marked as read",
        email
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to update email"
      });
    }
  });

  return router;
};

export default createEmailRouter;