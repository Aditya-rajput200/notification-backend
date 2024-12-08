const express = require('express');
const scrape_router = express.Router();

const { scrapeProduct, deleteProducts, getProducts } = require('../controlers/scrapControlers');
const { VerifyToken } = require('../middleware/jwt');

scrape_router.post('/scrape',VerifyToken, scrapeProduct);

scrape_router.get('/getProduts',getProducts)

scrape_router.delete('/delete',VerifyToken,deleteProducts)
module.exports =scrape_router;
