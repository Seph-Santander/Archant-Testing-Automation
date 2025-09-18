async function backendLogin(I, username, password) {

    I.amOnPage('https://archant246.1902dev1.com/admin_q6TCx2');
    I.wait(5);

    I.fillField('#username', username);
    I.fillField('#login', password);

    I.click('//button[span[text()="Sign in"]]');
    I.wait(5);
}

async function setupBackend(I, inventoryClass = 'A', pageSetup = true) {
    I.waitForElement('button[data-role="closeBtn"]', 10);
    I.click('button[data-role="closeBtn"]');

    I.waitForElement('li#menu-magento-catalog-catalog > a', 10);
    I.click('li#menu-magento-catalog-catalog > a');

    I.click('Products');
    I.wait(10); 

    I.click('Filters');
    I.wait(5); 

    let optionIndex;
    switch (inventoryClass.toUpperCase()) {
        case 'A': optionIndex = 1; break; 
        case 'B': optionIndex = 2; break;
        case 'C': optionIndex = 3; break;
        case 'D': optionIndex = 4; break;
        case 'E': optionIndex = 5; break;
        case 'F': optionIndex = 6; break;
        case 'I': optionIndex = 7; break;
        case 'M': optionIndex = 8; break;
        case 'S': optionIndex = 9; break;
        case 'H': optionIndex = 10; break;
        default: throw new Error(`Invalid inventory class: ${inventoryClass}`);
    }

    I.executeScript(() => {
        const select = document.querySelector('select[name="inventory_classification"]');
        if (select) {
            select.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    });

    I.say(`Selecting inventory class: ${inventoryClass.toUpperCase()}...`);
    I.executeScript((index) => {
        const select = document.querySelector('select[name="inventory_classification"]');
        if (select && select.options.length > index) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, optionIndex);

    I.wait(1);

    I.executeScript(() => {
        const button = document.querySelector('button[data-action="grid-filter-apply"]');
        if (button) {
            button.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    });


    I.click('Apply Filters');
    I.wait(5);

    
    if (pageSetup) {
        I.executeScript(() => {
            const btn = document.querySelector('button.selectmenu-toggle');
            if (btn) {
                btn.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        });
        I.waitForElement('button.selectmenu-toggle', 10);
        I.click('button.selectmenu-toggle');

        I.click('//button[contains(@class,"selectmenu-item-action") and normalize-space(text())="999"]');
    }
    else {
        I.say('Skipping page setup as per configuration.');
    }
}

async function getProductNames(I) {
    I.waitForElement('table.data-grid.data-grid-draggable tbody tr', 10);

    const productNames = await I.executeScript(() => {
        const rows = document.querySelectorAll("table.data-grid.data-grid-draggable tbody tr");
        return Array.from(rows)
            .map(r => r.querySelector("td:nth-child(6) .data-grid-cell-content")?.innerText.trim())
            .filter(Boolean);
    });

    // Display product names in a clean block
    if (productNames.length > 0) {
        const header = `✅ Found ${productNames.length} products:\n`;
        const list = productNames.map((name, i) => `${i + 1}. ${name}`).join("\n");
        const footer = `\n-----------------------------`;
        I.say(`${header}${list}${footer}`);
    } else {
        I.say("⚠️ No products found.");
    }

    return productNames;
}

async function getProductStocks(I) {
    I.waitForElement('table.data-grid.data-grid-draggable tbody tr', 10);

    const productStocks = await I.executeScript(() => {
        const rows = document.querySelectorAll("table.data-grid.data-grid-draggable tbody tr");
        return Array.from(rows)
            .map(r => {
                const name = r.querySelector("td:nth-child(6) .data-grid-cell-content")?.innerText.trim();
                const qtyText = r.querySelector("td:nth-child(7) .data-grid-cell-content")?.innerText.trim();

                let qty = 0;

                if (!qtyText || qtyText.toLowerCase().includes("coming") || qtyText.toLowerCase().includes("out")) {
                    qty = 0; // Treat as out of stock
                } else {
                    // Keep digits, minus, and decimal point
                    const clean = qtyText.replace(/[^0-9.-]/g, "");
                    qty = parseFloat(clean);
                    if (isNaN(qty)) qty = 0;
                }

                return name ? { name, qty } : null;
            })
            .filter(Boolean);
    });

    // 📝 Display product names and quantities in a clean block
    if (productStocks.length > 0) {
        const header = `✅ Found ${productStocks.length} products with stock data:\n`;
        const list = productStocks.map((p, i) => `${i + 1}. ${p.name} → Qty: ${p.qty}`).join("\n");
        const footer = `\n-----------------------------`;
        I.say(`${header}${list}${footer}`);
    } else {
        I.say("⚠️ No stock data found.");
    }

    return productStocks;
}




async function assertingProducts(I, productNames) {
    // 1️⃣ Go to the frontend site
    I.amOnPage('https://archant246.1902dev1.com/');

    // 2️⃣ Loop through product names
    for (const name of productNames) {
        I.say(`🔍 Searching for: ${name}`);

        // open search input by clicking magnifier
        I.click('i.icon-magnifier.icons');

        // type the product name
        I.fillField('#search-input-autocomplate', name);

        // press Enter to search
        I.pressKey('Enter');

        // wait for search results
        I.waitForElement('a.product-item-link', 20);

        // grab all product links
        const links = await I.grabAttributeFrom('a.product-item-link', 'href');

        if (links.length > 0) {

            // click the first product link
            I.click(locate('a.product-item-link').first());

            // wait for product page to load
            I.waitForElement('.page-title', 20);
            const productTitle = await I.grabTextFrom('.page-title');
            I.say(`Opened product page: ${productTitle}`);
        } else {
            I.say(`No product link found for "${name}"`);
        }

        // wait 5 seconds before next search
        I.wait(5);
    }
}

async function assertingPreOrderProducts(I, productStocks) {
    I.amOnPage('https://archant246.1902dev1.com/');

    const failedProducts = [];

    for (const { name, qty } of productStocks) {
        I.say(`\n🔍 Searching for: ${name} (Qty: ${qty})`);

        try {
            // open search input by clicking magnifier
            I.click('i.icon-magnifier.icons');
            I.fillField('#search-input-autocomplate', name);
            I.pressKey('Enter');
            I.waitForElement('a.product-item-link', 20);

            const links = await I.grabAttributeFrom('a.product-item-link', 'href');

            if (links.length > 0) {
                I.click(locate('a.product-item-link').first());
                I.waitForElement('.page-title', 20);

                const productTitle = await I.grabTextFrom('.page-title');
                I.say(`Opened product page: ${productTitle}`);

                const pageContent = await I.grabSource();
                const preorderText =
                    'Great news! This item is now available for pre order. By placing your order now, we will dispatch it immediately upon stock arrival.';

                // Convert qty to number (handles decimals properly)
                const qtyNum = parseFloat(qty);

                if (isNaN(qtyNum) || qtyNum <= 0) {
                    if (pageContent.includes(preorderText)) {
                        I.say(`✅ Rule OK → "${name}" is out of stock and preorder text is shown.`);
                    } else {
                        const fail = { name, qty, issue: "Expected preorder message not found." };
                        failedProducts.push(fail);
                        I.say(`❌ Rule FAILED → ${fail.name} (Qty: ${fail.qty}) → ${fail.issue}`);
                        showFailedList(I, failedProducts);
                    }
                } else {
                    if (pageContent.includes(preorderText)) {
                        const fail = { name, qty, issue: "Preorder message shown even though stock is available." };
                        failedProducts.push(fail);
                        I.say(`❌ Rule FAILED → ${fail.name} (Qty: ${fail.qty}) → ${fail.issue}`);
                        showFailedList(I, failedProducts);
                    } else {
                        I.say(`✅ Rule OK → "${name}" has stock and preorder text is hidden.`);
                    }
                }
            } else {
                const fail = { name, qty, issue: "No product link found." };
                failedProducts.push(fail);
                I.say(`⚠️ Rule FAILED → ${fail.name} (Qty: ${fail.qty}) → ${fail.issue}`);
                showFailedList(I, failedProducts);
            }
        } catch {
            const fail = { name, qty, issue: "Unexpected error during check." };
            failedProducts.push(fail);
            I.say(`⚠️ Rule FAILED → ${fail.name} (Qty: ${fail.qty}) → ${fail.issue}`);
            showFailedList(I, failedProducts);
        }

        I.wait(3);
    }

    if (failedProducts.length > 0) {
        I.say("\n❌ Final Failed Products List:");
        failedProducts.forEach((p, i) => {
            I.say(`${i + 1}. ${p.name} (Qty: ${p.qty}) → ${p.issue}`);
        });
    } else {
        I.say("\n✅ All products passed the rule checks!");
    }
}


// 🔹 helper to show current failed list
function showFailedList(I, failedProducts) {
    I.say("\n📌 Current Failed List:");
    failedProducts.forEach((p, i) => {
        I.say(`${i + 1}. ${p.name} (Qty: ${p.qty}) → ${p.issue}`);
    });
}












module.exports = { 
    backendLogin,
    setupBackend,
    getProductNames,
    assertingProducts,
    getProductStocks,
    assertingPreOrderProducts
};
