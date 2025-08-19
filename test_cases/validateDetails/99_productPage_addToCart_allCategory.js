const { assertProductCategory } = require('../component/Product_Category');
const { addingProductbyCategory } = require('../component/add_to_cart');
const categories = require('../component/categories');

Feature('User Login as Guest, then Add to Cart Product to each of Category');

Scenario('User Login as Guest, then Add to Cart Product', async ({ I }) => {
    // ===== User input =====
    const category = 'handles'; // e.g. sinks, taps, handles, surfaces, wovenpanel, accessories, lights, clearance
    let subCategory = ''; // can be empty or wrong

    // ===== Validation =====
    if (!categories[category]) {
        throw new Error(`❌ Category "${category}" is not supported. Valid options are: ${Object.keys(categories).join(', ')}`);
    }

    const subCategories = categories[category];

    if (!subCategory || subCategory.trim() === '') {
        // Random selection if none provided
        subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
        console.log(`⚡ Randomly selected subcategory: ${subCategory}`);
    } else if (!subCategories.includes(subCategory)) {
        throw new Error(`❌ Subcategory "${subCategory}" does not belong to category "${category}". Valid subcategories: ${subCategories.join(', ')}`);
    }

    // ===== Test flow =====
    I.amOnPage('/');
    await assertProductCategory(I);
    await addingProductbyCategory(I, category, subCategory);

    I.say(`✅ Added product from ${category} → ${subCategory}`);
    I.wait(5);
});
