const express = require('express');
const scrape_router = require('./src/routes/scrapRoutes');
const user_router = require('./src/routes/userRouter');
const app  = express();
const cron = require('node-cron');
const prisma = require('./src/utils/prisma');
const cors = require('cors');
const { scrapeMyntraProduct } = require('./src/services/scrapServices');
const updatePriceHistoryJob = require('./src/jobs/updatePriceHistory');
const { generateEmailBody, sendEmail } = require('./src/jobs/sendNotification');

app.use(cors());

cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('Running scheduled task to check for price changes');

    // Fetch all added products
    const products = await prisma.product.findMany({
      where: {
        userId: 1,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Ensure products are retrieved
    if (!products || products.length === 0) {
      console.log('No products found for the user.');
      return;
    }

    // Loop through products and process them
    for (const product of products) {
      const previosPrice = product.price;
      const previosDiscount = product.discountedPrice;

      console.log(`Processing Product ID: ${product.id}`);
      console.log('Previous Price:', previosPrice);
      console.log('Previous Discounted Price:', previosDiscount);

      try {
        // Scrape the product details
        const scrapedData = await scrapeMyntraProduct(product.url);

        if (!scrapedData) {
          console.log(`Scraping failed for Product ID: ${product.id}`);
          continue;
        }

        console.log('Scraped Data:', scrapedData);

        // Check for price changes
        if (scrapedData.price !== previosPrice || scrapedData.discountPrice !== previosDiscount) {
          console.log(`Price change detected for Product ID: ${product.id}`);

          // Update price history
          await updatePriceHistoryJob(product.id,scrapedData.price,scrapedData.discountPrice);

          // Send notification
          const content =  await generateEmailBody(product, 'Price_Drop');
          await sendEmail(content, product.user.email);

          console.log('Notification sent for Product ID:', product.id);
        } else {
          console.log(`No price changes for Product ID: ${product.id}`);
        }
      } catch (scrapingError) {
        console.error(`Error while scraping Product ID: ${product.id}:`, scrapingError.message);
      }
    }
  } catch (error) {
    console.error('Error in scheduled task:', error.message);
  }
});




  
 
app.use(express.json());

app.use('/api/v1/job',scrape_router);
app.use('/api/v1/user',user_router);



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
