// --- test scenario file ---
const { assertProductCategory } = require('../component/Product_Category');
const { addingProductbyCategory, selectProduct } = require('../component/add_to_cart');
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

    for (const category of Object.keys(categories)) {
        let { subCategory, productName } = userSelections[category] || {};
        const subCategories = categories[category];

        // Subcategory validation
        if (!subCategory || subCategory.trim() === '') {
            subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
            console.log(`⚡ [${category}] Randomly selected subcategory: ${subCategory}`);
        } else if (!subCategories.includes(subCategory) && subCategories.length > 0) {
            throw new Error(`❌ Subcategory "${subCategory}" is invalid for category "${category}". Valid: ${subCategories.join(', ')}`);
        }

        // Assert category page
        await assertProductCategory(I, category);

        // Navigate category & subcategory
        await addingProductbyCategory(I, category, subCategory);

        // Select product by name or randomly
        await selectProduct(I, productName);

        I.wait(5);
    }

    I.wait(10);
});
