const { 
    backendLogin, 
    loginArchant, 
    setupBackend, 
    getProductStocks,
    assertingProductsStockAvailability
} = require('../component/login');

Feature('Backend login & Stock Validation');

Scenario('Validate stock for all inventory classes', async ({ I }) => {

    // 🔑 Backend login credentials
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';
    const adminLink = 'https://archant246.1902dev1.com/admin_q6TCx2'; // change link if needed

    // 🌐 Archant frontend credentials
    const webEmail = 'mes@1902.software'; 
    const webPass = 'ilovecassy@2019';   
    const webLink = 'https://archant246.1902dev1.com'; // change link if needed
    
    // 📦 Inventory classes to validate
    const inventoryClasses = ['A', 'B', 'C', 'D', 'I', 'M', 'S', 'F'];
    const pageSetup = false; // set to true if you want 999 products per page etc.

    

    // 2️⃣ Loop through each inventory class
    for (const invClass of inventoryClasses) {
        I.say(`\n🔎 Validating Inventory Class: ${invClass}`);

        // 1️⃣ Login to backend
        await backendLogin(I, username, password, adminLink);

        // setup grid filter for this class
        await setupBackend(I, invClass, pageSetup);

        // grab stock data for this class
        const productStocks = await getProductStocks(I);

        if (productStocks.length === 0) {
            I.say(`⚠️ No products found for Class ${invClass}, skipping...`);
            continue;
        }
        // Optional: login to Archant frontend if needed
        await loginArchant(I, webEmail, webPass, webLink);

        // 3️⃣ Assert stocks on frontend
        await assertingProductsStockAvailability(I, productStocks);
    }


    
    I.say("🎉 Completed stock validation for all inventory classes!");
});
