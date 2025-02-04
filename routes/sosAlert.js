const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Location data is missing' });
    }

    const message = `Emergency SOS Alert!\nLocation: Latitude: ${latitude}, Longitude: ${longitude}`;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'target-email@example.com', 
            subject: 'Emergency SOS Alert',
            text: message,
        });

        res.status(200).json({ message: 'SOS alert sent successfully' });
    } catch (error) {
        console.error('Error sending SOS alert:', error);
        res.status(500).json({ message: 'Error sending SOS alert' });
    }
});

module.exports = router;
