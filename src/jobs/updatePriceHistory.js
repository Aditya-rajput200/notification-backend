const { scrapeMyntraProduct } = require('../services/scrapServices');
const prisma  = require ('../utils/prisma');


async function updatePriceHistoryJob(productId) {
  try {

         
        // Update price history
    

        // Update product data
       const update = await prisma.product.update({
          where: { id: productId },
          data: {
            price,
            discountedPrice
          },
        });

        return update
      }
  
    

  
   catch (error) {
    console.error('Error updating price history:', error.message);
  }
}
module.exports =  updatePriceHistoryJob ;
