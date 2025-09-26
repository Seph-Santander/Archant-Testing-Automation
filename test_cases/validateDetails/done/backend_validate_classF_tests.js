const { backendLogin,
        setupBackend,
        getProductNames,
        assertingProducts,
        getProductStocks,
        assertingPreOrderProducts } = require('../../component/login');

Feature('Backend Validate Tests, Class F');

Scenario('Backend Validate Tests for Class F', async ({ I }) => {
    // backend login credentials
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';
    const adminLink = 'https://archant246.1902dev1.com/admin_q6TCx2'; // change link if needed

    // list of inventory classes to test
    const inventoryClass = 'F';
    const pageSetup = false; // Set to true to include page setup steps eg. 999 per page

    // 1️⃣ Login once
    await backendLogin(I, username, password, adminLink);
    I.waitForElement('.modal-header', 20);

    I.say(`======================`);
    I.say(`Testing inventory class: ${inventoryClass}`);
    I.say(`======================`);

    // Setup backend for this class
    await setupBackend(I, inventoryClass, pageSetup);

    I.wait(10);
    // ✅ First step: get product stocks (with decimals preserved)
    const productStocks = await getProductStocks(I);

    // ✅ Second step: run the asserting logic with that data
    await assertingPreOrderProducts(I, productStocks);

});
