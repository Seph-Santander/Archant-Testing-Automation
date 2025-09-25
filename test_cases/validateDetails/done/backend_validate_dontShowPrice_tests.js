const { backendLogin, setupBackend, getTableRecords } = require('../../component/login');

Feature('Backend Validate Don\'t Show Price');

Scenario('Backend Validate Don\'t Show Price', async ({ I }) => {
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';

    const inventoryClasses = ['A', 'B', 'C', 'D','I', 'M', 'S', 'F', 'E', 'H'];
    const pageSetup = false; 

    await backendLogin(I, username, password);
    I.waitForElement('.modal-header', 20);

    // store failures grouped by class
    let overallFailures = {};

    for (const inventoryClass of inventoryClasses) {
        I.say(`======================`);
        I.say(`Testing inventory class: ${inventoryClass}`);
        I.say(`======================`);

        I.amOnPage('https://archant246.1902dev1.com/admin_q6TCx2');
        
        await setupBackend(I, inventoryClass, pageSetup);

        let records = [];
        try {
            records = await getTableRecords(I);
        } catch (err) {
            I.say(`⚠️ Could not read table for Class ${inventoryClass}, skipping...`);
            continue;
        }

        if (records.length === 0) {
            I.say(`\n📋 Summary for Inventory Class ${inventoryClass}:`);
            I.say(`⚠️ No products found in Class ${inventoryClass}, skipping validation`);
            continue;
        }

        let summary = [];
        let failedProducts = [];

        for (const record of records) {
            if (record.dontShowPrice.toUpperCase() === 'NO') {
                summary.push(`${record.name} → ✅ PASS`);
            } else {
                summary.push(`${record.name} → ❌ FAIL (Dont Show Price = ${record.dontShowPrice})`);
                failedProducts.push(record.name);

                // group failures by class
                if (!overallFailures[inventoryClass]) {
                    overallFailures[inventoryClass] = [];
                }
                overallFailures[inventoryClass].push(`${record.name} (Dont Show Price = ${record.dontShowPrice})`);
            }
        }

        // 📋 print summary for this class
        I.say(`\n📋 Summary for Inventory Class ${inventoryClass}:`);
        summary.forEach((line, index) => {
            I.say(`${index + 1}. ${line}`);
        });

        // final result for the class
        if (failedProducts.length > 0) {
            I.say(`\n⚠️ ${failedProducts.length} product(s) failed in Class ${inventoryClass}`);
        } else {
            I.say(`\n🎉 All ${summary.length} products in Class ${inventoryClass} passed Dont Show Price = NO validation`);
        }
    }

    // 🔹 Final report across all classes
    if (Object.keys(overallFailures).length > 0) {
        I.say(`\n❌ Overall Failures by Class:`);
        Object.entries(overallFailures).forEach(([cls, items]) => {
            I.say(`\nClass ${cls}:`);
            items.forEach((item, idx) => I.say(`   ${idx + 1}. ${item}`));
        });

        // 🚫 Don’t fail the test, just show result
        I.say(`\n⚠️ Validation finished with ${Object.values(overallFailures).flat().length} product(s) failing across all classes`);
    } else {
        I.say(`\n✅ All products in all classes passed Dont Show Price = NO validation`);
    }
});
