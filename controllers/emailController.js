// External imports
const nodemailer = require("nodemailer");

/**
 * @route   POST /api/send-email
 * @desc    Send an email
 * @access  Public
 */
exports.handleSendEmail = async (req, res) => {
  try {
    const { name, email, message, pageTitle, country, address, phone } =
      req.body;

    // Configure SMTP (use your Webuzo email settings)
    const transporter = nodemailer.createTransport({
      host: "mail.sufizaproperty.com", // SMTP host
      port: 465, // Secure SSL port
      secure: true, // Use SSL
      auth: {
        user: "info@sufizaproperty.com", // Webuzo email account
        pass: "https1sufizaproperty1com", // Make sure to use the correct password
      },
    });

    // Email to the admin with formatted message content
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender's name and email
      to: "info@sufizaproperty.com", // Your Webuzo email
      subject: `[Contact Form Submission] - ${name} from ${pageTitle}`,
      html: message
        ? `
            <p>
              <strong>Dear Team,</strong>
            </p>
            <p>
              You have received a new message through the contact form on your 
              <strong>${pageTitle}</strong> page.
            </p>
            <p>
              <strong>Details:</strong>
            </p>
            <ul>
              <li>
                <strong>Name:</strong> ${name}
              </li>
              <li>
                <strong>Email:</strong> ${email}
              </li>
            </ul>
            <p>
              <strong>Message:</strong>
            </p>
            <p>${message}</p>
            <p>
              Best regards,
              <br />
              <strong>${name}</strong>
            </p>
          `
        : `
            <p>
              <strong>Dear Team,</strong>
            </p>
            <p>
              You have received a new message through the contact form on your 
              <strong>${pageTitle}</strong> page.
            </p>
            <p>
              <strong>Details:</strong>
            </p>
            <ul>
              <li>
                <strong>Name:</strong> ${name}
              </li>
              <li>
                <strong>Email:</strong> ${email}
              </li>
              <li>
                <strong>Phone:</strong> ${phone}
              </li>
              <li>
                <strong>Local area name:</strong> ${country}
              </li>
              <li>
                <strong>Address:</strong> ${address}
              </li>
            </ul>
            <p>
              Best regards,
              <br />
              <strong>${name}</strong>
            </p>
          `,
    };

    // Confirmation email to the user with a professional tone
    const replyMail = {
      from: "info@sufizaproperty.com", // Your email address
      to: email, // The user's email
      subject: "Thank You for Contacting Us",
      html: message
        ? `<p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for getting in touch with us. We have successfully received your submission, and our team will review it shortly. Here are the details you provided:</p>
          <p><strong>Your Information:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
         <p>We will get back to you as soon as possible. In the meantime, feel free to reply to this email if you have any further questions.</p>
          <p>Best regards,<br><strong>Sufiza Property Team</strong><br>
          <a href="mailto:info@sufizaproperty.com">info@sufizaproperty.com</a></p>`
        : `<p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for getting in touch with us. We have successfully received your submission, and our team will review it shortly. Here are the details you provided:</p>
          <p><strong>Your Information:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Local area name:</strong> ${country}</li>
            <li><strong>Address:</strong> ${address}</li>
          </ul>
          <p>We will get back to you as soon as possible. In the meantime, feel free to reply to this email if you have any further questions.</p>
          <p>Best regards,<br><strong>Sufiza Property Team</strong><br>
          <a href="mailto:info@sufizaproperty.com">info@sufizaproperty.com</a></p>`,
    };

    // Send the contact form message to the admin email
    await transporter.sendMail(mailOptions);

    // Send the confirmation email to the user
    await transporter.sendMail(replyMail);

    res.status(200).send({
      message: "Message sent successfully!",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send Message." });
  }
};
