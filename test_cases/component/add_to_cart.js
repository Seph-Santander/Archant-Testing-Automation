// --- Navigate category & subcategory ---
async function addingProductbyCategory(I, category, subCategory) {
    switch (category.toLowerCase()) {
        case 'sinks':
            await I.click('a[href*="shop/sinks.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/sinks.html');
            break;
        case 'taps':
            await I.click('a[href*="shop/taps.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/taps.html');
            break;
        case 'handles':
            await I.click('a[href*="shop/handles.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/handles.html');
            break;
        case 'surfaces':
            await I.click('a[href*="shop/surfaces.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/surfaces.html');
            break;
        case 'wovenpanel':
            await I.click('a[href*="shop/wovenpanel.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/wovenpanel.html');
            break;
        case 'accessories':
            await I.click('a[href*="shop/accessories.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/accessories.html');
            break;
        case 'lights':
            await I.click('a[href*="shop/lights.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/lights.html');
            break;
        case 'clearance':
            await I.click('a[href*="archant-outlet"]');
            await I.wait(5);
            await I.switchToNextTab();
            break;
        default:
            throw new Error(`❌ Category "${category}" not supported!`);
    }

    await I.say(`✅ Navigated to category: ${category}`);

    // Skip if no subCategory is provided
    if (!subCategory || subCategory.trim() === '') {
        await I.say(`⚠️ Category "${category}" has no subcategory, skipping product selection`);
        return false; // indicates nothing to select
    }

    // Handle subcategory if provided
    const subCategoryLocator = `//div[@class="filter-options-content"]//a[contains(normalize-space(), "${subCategory}")]`;
    const exists = await I.grabNumberOfVisibleElements(subCategoryLocator);
    if (exists > 0) {
        await highlightElement(I, subCategoryLocator);
        await I.click(subCategoryLocator);
        await I.say(`✅ Selected subcategory: ${subCategory}`);
        await I.wait(5); // wait for DOM refresh
        return true; // subcategory exists
    } else {
        await I.say(`⚠️ Subcategory "${subCategory}" not found, skipping product selection`);
        return false;
    }
}

// --- Product selection function (scroll to center first) ---
async function selectProduct(I, productName) {
    const productListLocator = '//ol[contains(@class,"container-products-switch")]//li[contains(@class,"product-item")]//a[@class="product-item-link"]';

    // Check if product list exists
    const productListExists = await I.grabNumberOfVisibleElements(productListLocator);
    if (productListExists === 0) {
        await I.say('⚠️ No products found in this category, skipping product selection');
        return false;
    }

    let productLocator = null;

    if (productName && productName.trim() !== '') {
        productLocator = `//ol[contains(@class,"container-products-switch")]//li[contains(@class,"product-item")]//a[@class="product-item-link" and contains(normalize-space(.), "${productName}")]`;
        const exists = await I.grabNumberOfVisibleElements(productLocator);
        if (exists === 0) {
            await I.say(`⚠️ Product "${productName}" not found, skipping product selection`);
            return false;
        }
    }

    // Random selection fallback
    if (!productLocator) {
        const count = await I.grabNumberOfVisibleElements(productListLocator);
        const randomIndex = Math.floor(Math.random() * count) + 1;
        productLocator = `(${productListLocator})[${randomIndex}]`;
        await I.say(`⚠️ Product name not provided, selecting random product`);
    }

    await I.waitForElement(productLocator, 10);

    // Scroll product to center
    await I.executeScript((sel) => {
        const el = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, productLocator);

    await highlightElement(I, productLocator);
    await I.click(productLocator);
    await I.say(`✅ Product selected${productName ? `: ${productName}` : ' (random)'}`);
    await I.wait(5);
    return true;
}

// --- Helper: highlight element ---
async function highlightElement(I, locator) {
    await I.executeScript((sel) => {
        const el = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) {
            el.style.transition = "all 0.4s ease-in-out";
            el.style.outline = "3px solid orange";
            el.style.backgroundColor = "#fff3cd";
            setTimeout(() => {
                el.style.outline = "";
                el.style.backgroundColor = "";
            }, 400);
        }
    }, locator);
    await I.wait(0.5);
}

module.exports = { addingProductbyCategory, selectProduct };
