function extractPrice(...elements) {
    for (const element of elements) {
        const priceText = element.text().trim();
        if (priceText) return priceText.replace(/\D/g, '');
    }
    return '';
}

 function extractCurrencySymbol(...elements) {
    for (const element of elements) {
        const currencySymbol = element.text().trim();
        if (currencySymbol) return currencySymbol.replace(/[a-zA-Z0-9]/g, '');
    }
    return '';
}

 function extractDescription($) {
    const selectors = ['.pdp-description ul li']; // Adjust selectors for Myntra
    for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
            return elements
                .map((_, el) => $(el).text().trim())
                .get()
                .join('\n');
        }
    }
    return '';
}

 function getHighestPrice(priceList) {
    return Math.max(...priceList.map((p) => p.price));
}

function getLowestPrice(priceList) {
    return Math.min(...priceList.map((p) => p.price));
}

function getAveragePrice(priceList) {
    const total = priceList.reduce((acc, p) => acc + p.price, 0);
    return priceList.length ? total / priceList.length : 0;
}

const formatNumber = (num = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

module.exports = {
    extractPrice,
    extractCurrencySymbol,
    extractDescription,
    getHighestPrice,
    getLowestPrice,
    getAveragePrice,
    formatNumber,
};