const { backendLogin,
        setupBackend,
        getProductStocks,
        assertingClassHProducts } = require('../component/login');

Feature('Backend Validate Tests, Class H');

Scenario('Backend Validate Tests for Class H', async ({ I }) => {
    // backend login credentials
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';

    // list of inventory classes to test
    const inventoryClass = 'H';
    const pageSetup = false; // Set to true to include page setup steps eg. 999 per page

    // 1️⃣ Login once
    await backendLogin(I, username, password);
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
    await assertingClassHProducts(I, productStocks);

});
