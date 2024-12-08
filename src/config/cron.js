var cron = require('node-cron');

cron.schedule('*/2 * * * *', () => {

  //  get all added product 
  const getAllProducts = async (req,res) =>{
    const products = await prisma.product.findMany({
        where:{
            userId:req.user.id
        }}) }

        console.log(products)

  // for loop in all product

  //  scrap by product url

  // get new data and cmpare

  // if new data is less than pevios send emaail 

  // update database 


})
