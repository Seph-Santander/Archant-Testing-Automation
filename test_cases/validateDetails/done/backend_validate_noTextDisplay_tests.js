const { backendLogin, setupBackend, getProductNames, assertingProducts } = require('../../component/login');

Feature('Backend Validate Tests');

Scenario('Backend Validate Tests for multiple classes', async ({ I }) => {
    // backend login credentials
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';
    const adminLink = 'https://archant246.1902dev1.com/admin_q6TCx2'; // change link if needed

    // list of inventory classes to test
    const inventoryClasses = ['A', 'B', 'C', 'D', 'I', 'M', 'S'];
    const pageSetup = false; // Set to true to include page setup steps eg. 999 per page

    // 2️⃣ Loop through each class
    for (const inventoryClass of inventoryClasses) {

        // 1️⃣ Login once
        await backendLogin(I, username, password, adminLink);
        I.waitForElement('.modal-header', 20);

        I.say(`======================`);
        I.say(`Testing inventory class: ${inventoryClass}`);
        I.say(`======================`);

        // Setup backend for this class
        await setupBackend(I, inventoryClass, pageSetup);

        // Get product names for this class
        const productNames = await getProductNames(I);

        if (productNames.length === 0) {
            I.say(`⚠️ No products found for class ${inventoryClass}, skipping...`);
            continue;
        }

        // Assert products on frontend
        await assertingProducts(I, productNames);
    }
});
