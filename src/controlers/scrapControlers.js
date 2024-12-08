const { generateEmailBody, sendEmail } = require("../jobs/sendNotification");
const { scrapeMyntraProduct } = require("../services/scrapServices");
const prisma = require("../utils/prisma");

exports.scrapeProduct = async (req, res) => {
  const { url } = req.body;


  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const UniqueProduct = await prisma.product.findFirst({
    where: {
      url,
    },
  });

  if (UniqueProduct) {
    return res.status(400).json("Product already exist");
  }

  try {
    const productData = await scrapeMyntraProduct(url);
    console.log("aditya", req.user.id);
    const newProduct = await prisma.product.create({
      data: {
        name: productData.title,
        price: productData.price,
        image: productData.image,
        url: url,
        discountedPrice: productData.discountPrice,

        coupon: {
          create: [
            {
              name: productData.coupanCode,
              description: productData.copanDescription,
            },
          ],
        },
        user: {

          connect: {
            id: req.user.id,
          },


          
        },

      },
      include:{ 
        user:{
          select:{
            email:true
          }
        }
      }
    });
       

      const emailContent= await  generateEmailBody(newProduct,"WELCOME")
      await sendEmail(emailContent,newProduct.user.email)

    return res.status(200).json(newProduct);

  } catch (error) {
    return res.status(500).json({ "aditya erorr": error.message });
  }
};


exports.deleteProducts = async (req, res) => {
  const productId = req.body.id ;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    
    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);

   
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }

   
    res.status(500).json({ error: "Failed to delete the product" });
  }
};
 
exports.getProducts = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Fetch the user and their products
    const userWithProducts = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        products: true, 
      },
    });

    if (!userWithProducts) {
      return res.status(404).json({ message: "User not found or has no products" });
    }

    res.status(200).json({ products: userWithProducts.products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// calling the function and send url to it and get the scraped data to it
