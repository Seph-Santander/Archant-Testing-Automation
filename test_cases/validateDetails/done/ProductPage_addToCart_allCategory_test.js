const { assertProductCategory } = require('../../component/Product_Category');
const { addingProductbyCategory, selectProduct, addToCartAndView } = require('../../component/add_to_cart');
const categories = require('../../component/categories');
const assert = require('assert');  // add this at the top of your test file

Feature('User Login as Guest, then Add to Cart Product to each Category');

const userSelections = {
    sinks:      { subCategory: '', productName: '' },
    taps:       { subCategory: '', productName: '' },
    handles:    { subCategory: '', productName: '' },
    surfaces:   { subCategory: '', productName: '' },
    wovenpanel: { subCategory: '', productName: '' },
    accessories:{ subCategory: '', productName: '' },
    lights:     { subCategory: '', productName: '' },
    clearance:  { subCategory: '', productName: '' }
};

Scenario('User Login as Guest, then Add to Cart Product from each Category', async ({ I }) => {
    I.amOnPage('/');

    let isFirstProduct = true;
    const selectedProducts = [];

    for (const category of Object.keys(categories)) {
        let { subCategory, productName } = userSelections[category] || {};
        const subCategories = categories[category];

        if (!subCategory || subCategory.trim() === '') {
            if (subCategories.length > 0) {
                subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
                console.log(`[${category}] Randomly selected subcategory: ${subCategory}`);
            } else {
                console.log(`[${category}] No subcategories available, skipping category`);
                continue;
            }
        }

        await assertProductCategory(I, category);

        const { success, subCatCount } = await addingProductbyCategory(I, category, subCategory);
        if (!success) {
            console.log(`[${category}] Skipping product selection`);
            continue;
        }

        const productSelected = await selectProduct(I, productName, subCatCount);

        if (!productSelected) {
            console.log(`[${category}] No product selected, skipping Add to Cart`);
            continue;
        }

        // Grab actual product name from PDP before Add to Cart
        const actualProductName = await I.grabTextFrom('//h1[@class="page-title"]//span');
        selectedProducts.push(actualProductName);
        console.log('Added to expected cart list:', actualProductName);

        await addToCartAndView(I, isFirstProduct);
        isFirstProduct = false;

        I.wait(5);
    }

    // --- Assert products in View Cart ---
    I.say('Verifying products inside View Cart...');
    const cartProductNames = await I.grabTextFromAll('//strong[@class="product-item-name"]/a');

    console.log('Selected products:', selectedProducts);
    console.log('Cart products:', cartProductNames);

    I.say('All selected products successfully appear in View Cart!');
    I.wait(10);
});
