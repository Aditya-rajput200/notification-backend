const prisma = require('../utils/prisma');

async function updatePriceHistoryJob(productId, newPrice, newDiscountedPrice) {

  console.log("this is my new price",newPrice)
  console.log("this is my new price",newDiscountedPrice)

  try {
    // Step 1: Fetch the current product data
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Step 2: Add current price to price history
    await prisma.priceHistory.create({
      where:{
       id:  productId
      },
      data: {
       
        oldPrice: product.price,
        oldDiscountedPrice: product.discountedPrice,
        updatedAt: new Date(),
      },
    });

    // Step 3: Update product's price and discounted price
    // const updatedProduct = await prisma.product.update({
    //   where: { id: productId },
    //   data: {
    //     price: newPrice,
    //     discountedPrice: newDiscountedPrice,
    //   },
    // });

    console.log(`Successfully updated price history for product ID: ${productId}`);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating price history:', error.message);
    throw error; // Re-throw the error to handle it upstream if needed
  }
}

module.exports = updatePriceHistoryJob;
