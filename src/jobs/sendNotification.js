const nodemailer = require('nodemailer');
require('dotenv').config();
const e_password = process.env.EMAIL_APP_PASSWORD

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  Price_Drop: 'Price_Drop',
  
};

async function generateEmailBody(product, type) {

  // Shorten the product title
  const shortenedTitle =
    product.name.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.name;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
        <div>
          <h2>Welcome to PriceTrack 🚀</h2>
          <p>You are now tracking ${product.name}.</p>
          <p>Here's an example of how you'll receive updates:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.name} is now started tracking</h3>
            <p>We're excited to let you know that ${product.name} , we are now tracking this .</p>
            <p>We will Let You know when Price drops <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src=${product.image} alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on ${product.name} and other products you're tracking.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.Price_Drop:
      subject = `Price Drop Alert for ${shortenedTitle}! 🎉`;
      body = `
        <div>
          <h2>Great News from PriceTrack 🚀</h2>
          <p>The price for <strong>${product.name}</strong> has just dropped!</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.name} is now available at a lower price!</h3>
            <p>Don't miss this opportunity to grab it at the new price. Click below to check it out:</p>
            <a href="${product.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Buy Now</a>
            <p>Here’s the product at a glance:</p>
            <img src="${product.image}" alt="Product Image" style="max-width: 100%; margin-top: 10px;" />
          </div>
          <p>Stay updated with PriceTrack to ensure you never miss a deal on ${product.name} and other items you're tracking!</p>
        </div>
      `;
      break;

   
      
    

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adityaraj5260@gmail.com',    // Your Gmail
    pass:e_password, // Your Gmail App Password
  },
});


const sendEmail = async (emailContent, sendTo) => {
  const mailOptions = {
    from: 'adityaraj5260@gmail.com',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log("Email:",error);
    
    console.log('Email sent: ', info);
  });
};

module.exports = {
  generateEmailBody,
  sendEmail
};