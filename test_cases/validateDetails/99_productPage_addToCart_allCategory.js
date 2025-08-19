const { assertProductCategory } = require('../component/Product_Category');
const { addingProductbyCategory } = require('../component/add_to_cart');
const categories = require('../component/categories');

Feature('User Login as Guest, then Add to Cart Product to each Category');

// ===== User-defined inputs =====
// Assign subCategory per category
const userSelections = {
    sinks:      { subCategory: 'Double bowl' /*, productName: 'Robiq 450/200-15 RV' */ },
    taps:       { subCategory: 'Classic' /*, productName: 'Okura, Chrome' */ },
    handles:    { subCategory: 'Continuous Profile Handles' /*, productName: 'Ezi-Venice 16, 2500mm, Anodised' */ },
    surfaces:   { subCategory: 'Florim Porcelain' /*, productName: 'Marble Breach A, Matte, 3200x1600x12mm' */ },
    wovenpanel: { subCategory: '', /*productName: '' */},
    accessories:{ subCategory: 'Sinks' /*, productName: 'Hot Mat, Stainless Steel' */ },
    lights:     { subCategory: '', /*productName: '' */},
    clearance:  { subCategory: '', /*productName: ''*/ }
};

Scenario('User Login as Guest, then Add to Cart Product from each Category', async ({ I }) => {
    I.amOnPage('/');

    for (const category of Object.keys(categories)) {
        // Safely destructure with defaults (ignore productName for now)
        let { subCategory /*, productName */ } = userSelections[category] || {};

        const subCategories = categories[category];

        // === SubCategory validation ===
        if (!subCategory || subCategory.trim() === '') {
            subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
            console.log(`⚡ [${category}] Randomly selected subcategory: ${subCategory}`);
        } else if (!subCategories.includes(subCategory)) {
            throw new Error(`❌ Subcategory "${subCategory}" is invalid for category "${category}". Valid: ${subCategories.join(', ')}`);
        }

        // === Step 1: Assert category page ===
        await assertProductCategory(I, category);

        // === Step 2: Navigate & select product ===
        await addingProductbyCategory(I, category, subCategory /*, productName */);
        I.wait(5);
    }

    I.wait(10);
});
