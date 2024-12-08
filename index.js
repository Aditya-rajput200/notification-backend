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

 cron.schedule('*/1 * * * * ', async() => {

     console.log('Running scheduled task to check for price changes');
  //  get all added product 
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
  
 
   for(var i=0;i<products.length;i++){

     let previosPrice = products[i].price 
     let previosdiscount=products[i].discountedPrice
   

     scrapeMyntraProduct( products[i].url).then(async(res)=>{

       if(res.price !== previosPrice || res.discountPrice !==previosdiscount){

           updatePriceHistoryJob(products[i].id)

           // sending email
            const content = generateEmailBody(products[i],"Price_Drop")      
       sendEmail(content,products[i].user.email)

      
         console.log("Price Changed")
        }
       else{
        console.log("Price doest not change")
       
      }
     })
   }


  
 })



  
 
app.use(express.json());

app.use('/api/v1/job',scrape_router);
app.use('/api/v1/user',user_router);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

