// --- Navigate category & subcategory ---
async function addingProductbyCategory(I, category, subCategory) {
    switch (category.toLowerCase()) {
        case 'sinks':
            await I.click('a[href*="shop/sinks.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/sinks.html');
            await I.wait(5);
            break;
        case 'taps':
            await I.click('a[href*="shop/taps.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/taps.html');
            await I.wait(5);
            break;
        case 'handles':
            await I.click('a[href*="shop/handles.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/handles.html');
            await I.wait(5);
            break;
        case 'surfaces':
            await I.click('a[href*="shop/surfaces.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/surfaces.html');
            await I.wait(5);
            break;
        case 'wovenpanel':
            await I.click('a[href*="shop/wovenpanel.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/wovenpanel.html');
            await I.wait(5);
            break;
        case 'accessories':
            await I.click('a[href*="shop/accessories.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/accessories.html');
            await I.wait(5);
            break;
        case 'lights':
            await I.click('a[href*="shop/lights.html"]');
            await I.wait(5);
            await I.seeInCurrentUrl('/shop/lights.html');
            await I.wait(5);
            break;
        case 'clearance':
            await I.click('a[href*="archant-outlet"]');
            await I.wait(5);
            await I.switchToNextTab();
            await I.wait(5);
            break;
        default:
            throw new Error(`❌ Category "${category}" not supported!`);
    }

    await I.say(`✅ Navigated to category: ${category}`);
    await I.wait(5);

    if (!subCategory || subCategory.trim() === '') {
        await I.say(`⚠️ Category "${category}" has no subcategory, skipping product selection`);
        return false;
    }

    const subCategoryLocator = `//div[@class="filter-options-content"]//a[contains(normalize-space(), "${subCategory}")]`;
    const exists = await I.grabNumberOfVisibleElements(subCategoryLocator);
    if (exists > 0) {
        await highlightElement(I, subCategoryLocator);
        await I.click(subCategoryLocator);
        await I.say(`✅ Selected subcategory: ${subCategory}`);
        await I.wait(5);
        return true;
    } else {
        await I.say(`⚠️ Subcategory "${subCategory}" not found, skipping product selection`);
        return false;
    }
}

// --- Product selection function (scroll to center first) ---
async function selectProduct(I, productName) {
    const productListLocator = '//ol[contains(@class,"container-products-switch")]//li[contains(@class,"product-item")]//a[@class="product-item-link"]';
    
    // Check how many products exist first
    const productListExists = await I.grabNumberOfVisibleElements(productListLocator);
    if (productListExists === 0) {
        await I.say('⚠️ No products found in this category, skipping product selection');
        return false;
    }

    let productLocator = null;

    // If product name provided
    if (productName && productName.trim() !== '') {
        productLocator = `//ol[contains(@class,"container-products-switch")]//li[contains(@class,"product-item")]//a[@class="product-item-link" and contains(normalize-space(.), "${productName}")]`;
        const exists = await I.grabNumberOfVisibleElements(productLocator);
        if (exists === 0) {
            await I.say(`⚠️ Product "${productName}" not found, skipping product selection`);
            return false;
        }
    }

    // Random selection if no product name
    if (!productLocator) {
        const randomIndex = Math.floor(Math.random() * productListExists) + 1;
        productLocator = `${productListLocator}[${randomIndex}]`; // safe XPath
        await I.say(`⚠️ Product name not provided, selecting random product`);
    }

    await I.waitForElement(productLocator, 10);
    await I.wait(2);

    // Scroll product to center
    await I.executeScript((sel) => {
        let el = null;
        if (sel.startsWith('//') || sel.startsWith('.//')) {
            el = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } else {
            el = document.querySelector(sel);
        }
        if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, productLocator);
    await I.wait(2);

    await highlightElement(I, productLocator);
    await I.click(productLocator);
    await I.say(`✅ Product selected${productName ? `: ${productName}` : ' (random)'}`);
    await I.wait(2);

    return true;
}

// --- Add to Cart + Handle Guest Modal + View Cart ---
async function addToCartAndView(I, isFirstProduct = false) {
    const continueAsGuestBtn = '#continue-as-guest-button';
    const addToCartBtn = '#product-addtocart-button';
    const viewCartBtn = '//button[contains(text(), "View Cart")]';

    const addToCartExists = await I.grabNumberOfVisibleElements(addToCartBtn);
    if (addToCartExists === 0) {
        await I.say('⚠️ "Add to cart" button not found, skipping this product (View Cart also skipped)');
        await I.wait(5);
        return false;
    }

    await highlightElement(I, addToCartBtn);
    await I.click(addToCartBtn);
    await I.say('✅ Clicked "Add to cart" button');
    await I.wait(5);

    if (isFirstProduct) {
        const guestExists = await I.grabNumberOfVisibleElements(continueAsGuestBtn);
        if (guestExists > 0) {
            await highlightElement(I, continueAsGuestBtn);
            await I.click(continueAsGuestBtn);
            await I.say('✅ Clicked "Continue as Guest"');
            await I.wait(5);
        } else {
            await I.say('⚠️ "Continue as Guest" modal not found, skipping');
            await I.wait(5);
        }
    }

    const viewCartExists = await I.grabNumberOfVisibleElements(viewCartBtn);
    if (viewCartExists > 0) {
        await highlightElement(I, viewCartBtn);
        await I.click(viewCartBtn);
        await I.say('✅ Clicked "View Cart" button');
        await I.wait(5);
    } else {
        await I.say('⚠️ "View Cart" button not found, skipping');
        await I.wait(5);
    }

    return true;
}

// --- Helper: highlight element (CSS or XPath) ---
async function highlightElement(I, locator) {
    await I.executeScript((sel) => {
        let el = null;
        if (sel.startsWith('//') || sel.startsWith('.//')) {
            el = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } else {
            el = document.querySelector(sel);
        }
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
    await I.wait(2);
}

module.exports = { addingProductbyCategory, selectProduct, addToCartAndView };
