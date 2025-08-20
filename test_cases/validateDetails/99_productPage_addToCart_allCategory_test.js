const { assertProductCategory } = require('../component/Product_Category');
const { addingProductbyCategory, selectProduct, addToCartAndView } = require('../component/add_to_cart');
const categories = require('../component/categories');

Feature('User Login as Guest, then Add to Cart Product to each Category');

const userSelections = {
    sinks:      { subCategory: 'Double bowl', productName: 'Robiq 450/200-15 RV' },
    taps:       { subCategory: 'Classic', productName: 'Okura, Chrome' },
    handles:    { subCategory: 'Continuous Profile Handles', productName: 'Ezi-Venice 16, 2500mm, Anodised' },
    surfaces:   { subCategory: 'Florim Porcelain', productName: 'Marble Breach A, Matte, 3200x1600x12mm' },
    wovenpanel: { subCategory: '', productName: '' },
    accessories:{ subCategory: 'Sinks', productName: 'Hot Mat, Stainless Steel' },
    lights:     { subCategory: '', productName: '' },
    clearance:  { subCategory: '', productName: '' }
};

Scenario('User Login as Guest, then Add to Cart Product from each Category', async ({ I }) => {
    I.amOnPage('/');

    let isFirstProduct = true; // flag for handling guest modal on first product

    for (const category of Object.keys(categories)) {
        let { subCategory, productName } = userSelections[category] || {};
        const subCategories = categories[category];

        // Subcategory validation & random selection
        if (!subCategory || subCategory.trim() === '') {
            if (subCategories.length > 0) {
                subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
                console.log(`⚡ [${category}] Randomly selected subcategory: ${subCategory}`);
            } else {
                console.log(`⚠️ [${category}] No subcategories available, skipping category`);
                continue; // skip category entirely
            }
        } else if (!subCategories.includes(subCategory) && subCategories.length > 0) {
            throw new Error(`❌ Subcategory "${subCategory}" is invalid for category "${category}". Valid: ${subCategories.join(', ')}`);
        }

        // Assert category page
        await assertProductCategory(I, category);

        // Navigate category & subcategory
        const categoryNavigated = await addingProductbyCategory(I, category, subCategory);
        if (!categoryNavigated) {
            console.log(`⚠️ [${category}] Skipping product selection because subcategory not found or empty`);
            continue; // skip product selection if navigation failed
        }

        // Select product by name or randomly (safe randomizer)
        const productSelected = await selectProduct(I, productName);
        if (!productSelected) {
            console.log(`⚠️ [${category}] No product selected, skipping Add to Cart`);
            continue;
        }

        // Add to Cart + View Cart (handle guest modal only for first product)
        await addToCartAndView(I, isFirstProduct);
        isFirstProduct = false; // guest modal should only appear once

        I.wait(5);
    }

    I.wait(10);
});
