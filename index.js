require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Email Schema
const EmailSchema = new mongoose.Schema({
  email: String,
});
const Email = mongoose.model('Email', EmailSchema);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// HTML Email Template
const getEmailTemplate = (email) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
      .container { max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px #ccc; }
      .header { background-color: #8734E8; color: #fff; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; }
      .content {  font-size: 16px; color: #333; }
      .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; }
      .p-font
      {
          font-size: 14px;
      }
      .yelllow
      {
          background-color: yellow;
      }
      .ul-space
      {
          margin: 2%;
      }
      .img-wala-div
      {
          display: flex;
          justify-content: space-around;
      }
      .img-h4
      {
          color: #8734E8;
      }
      .span-last
      {
          font-size: 12px;
          color: gray;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to Our Community! Congratulations </div>
      <div class="content">
        <p>Dear,</p>
        <p class="p-font">Hope this email finds you in good health and cheerful spirit! On behalf of the Zipto family, I am thrilled to extend our warmest congratulations as we offer you the exciting opportunity to join our esteemed team.</p>
          <p>Your internship details are as follows <span class="yelllow">(Read this Mail Properly & follow the instructions)</span>:</p>
       <ul >
          <li class="ul-space">
              <b>Start Date:</b>&nbsp;&nbsp;&nbsp;<span>15th-March-2025</span>
          </li>
          <li class="ul-space">
              <b>End Date:</b> &nbsp;&nbsp;&nbsp;<span>15th-May-2025</span>
          </li>
          <li class="ul-space">
              <b>Weekly Hours:</b> &nbsp;&nbsp;<span>Flexible working hours</span>
          </li >
          <li class="ul-space">
              <b>Compensation:</b> &nbsp;&nbsp;<span>12,000-22,000(INR) based on performance</span>
          </li>
          <li class="ul-space">
              <b>Location:</b> &nbsp;&nbsp;<span> Remote(Online)</span>
          </li >
          <li class="ul-space">
              <b>Project Details:</b> &nbsp;&nbsp;<span> will be shared after offer acceptance.</span>
          </li>
       </ul>
      </div>
      <div>
          <b>Accept Offer Letter Here:</b>
          <p class="p-font">Before you embark on this exciting journey with us, we kindly request your acceptance of this offer by 14-March-2025, Accepting early can streamline your onboarding, allowing us to integrate you into our exciting projects and team dynamics ahead of schedule. This also means we can immediately begin tailoring your orientation and training programs. Confirm your acceptance here: <a href="https://zipto-rho.vercel.app/">Click Here Link</a> </p>
      </div>
      <div>
          <b>Access Learning & Hirring Platform Here:</b>
          <p class="p-font">We’re excited to introduce Hirre.io, our exclusive job platform designed for our interns, offering global job opportunities through partnerships with top companies. Upon successful completion of your internship, you’ll be eligible for full-time positions available exclusively to our interns. Additionally, you’ll gain access to Zipto Learning, an interactive platform providing program-specific courses, materials, and live training sessions. Complete a course alongside your internship, and you’ll receive both internship and course completion certificates that are verified and shareable. </p>
      </div>
      <div>
          <b>Further Details After Internship:</b>
          <p class="p-font">Dear candidate As you have received this internship offer letter, you are also eligible for full-time opportunities. We have recently launched our dedicated job platform, Hire.io, where we invite and collaborate with companies to offer opportunities specifically for our interns who successfully complete their internship with active participation. You can expect a minimum starting salary of up to 6 LPA (INR), depending on your role and responsibilities. We are primarily focusing on remote opportunities around the globe. We will share the opportunites and further preparation details shortly.</p>
      </div>
      <p>
          Best regards,
      </p>
      <p>
          Team ZIPTO
      </p>
      <div class="img-wala-div">
          <img src="wallpaperflare.com_wallpaper.jpg" height="100px" alt=""> 
          <h3 class="img-h4">ZIPTO <br>DEVELOPMENT</h3>
          
      </div>
      <hr>
      <span class="span-last">
          The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</span>
      <div class="footer">&copy; 2025 Our Company Zipto Development.</div>
    </div>
  </body>
  </html>
  `;
};

// API Endpoint to Save Email & Send Email
app.post('/api/send-email', async (req, res) => {
  const { email } = req.body;

  try {
    const newEmail = new Email({ email });
    await newEmail.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Community!',
      html: getEmailTemplate(email),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: 'Email not sent', error });
      res.json({ message: 'Email sent successfully!' });
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));