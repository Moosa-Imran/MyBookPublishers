const transporter = require('../utils/email');

// Render Pages
exports.renderContactPage = (req, res) => {
    res.render('contact/contact-us');
};

exports.sendMessage = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        const mailOptions = {
            from: `"${name}" <founder@mybookpublishers.org>`, 
            to: 'shafeequeahmad98@gmail.com', 
            subject: subject || 'Contact Form Submission',
            text: `You have received a new message from your website contact form.\n\n` +
                  `Here are the details:\n\n` +
                  `Name: ${name}\n` +
                  `Email: ${email}\n` +
                  `Phone: ${phone}\n` +
                  `Subject: ${subject}\n` +
                  `Message:\n${message}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ status: "success", message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({status: "error", error: 'Failed to send your message.' });
    }
};
