// Supported categories: sinks, taps, handles, surfaces, wovenpanel, accessories, lights, clearance
async function addingProductbyCategory(I, category, subCategory) {
    // Step 1: Go to main category
    switch (category.toLowerCase()) {
        case 'sinks':
            await I.click('a[href*="shop/sinks.html"]');
            await I.seeInCurrentUrl('/shop/sinks.html');
            break;
        case 'taps':
            await I.click('a[href*="shop/taps.html"]');
            await I.seeInCurrentUrl('/shop/taps.html');
            break;
        case 'handles':
            await I.click('a[href*="shop/handles.html"]');
            await I.seeInCurrentUrl('/shop/handles.html');
            break;
        case 'surfaces':
            await I.click('a[href*="shop/surfaces.html"]');
            await I.seeInCurrentUrl('/shop/surfaces.html');
            break;
        case 'wovenpanel':
            await I.click('a[href*="shop/wovenpanel.html"]');
            await I.seeInCurrentUrl('/shop/wovenpanel.html');
            break;
        case 'accessories':
            await I.click('a[href*="shop/accessories.html"]');
            await I.seeInCurrentUrl('/shop/accessories.html');
            break;
        case 'lights':
            await I.click('a[href*="shop/lights.html"]');
            await I.seeInCurrentUrl('/shop/lights.html');
            break;
        case 'clearance':
            await I.click('a[href*="archant-outlet"]');
            await I.switchToNextTab();
            break;
        default:
            throw new Error(`❌ Category "${category}" not supported!`);
    }

    await I.say(`✅ Navigated to main category: ${category}`);

    // Skip subcategory selection if no subcategories exist
    const subCategoriesExist = Array.isArray(subCategory) || (typeof subCategory === 'string' && subCategory.trim() !== '');
    if (!subCategoriesExist) {
        await I.say(`⚠️ No subcategories for category: ${category}, skipping subcategory selection`);
        return;
    }

    // Helper: animate highlight
    async function highlightElement(locator) {
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

    // Step 2: Handle subcategory selection if subCategory is provided
    if (subCategory) {
        const locator = `//div[@class="filter-options-content"]//a[contains(normalize-space(), "${subCategory}")]`;
        const exists = await I.grabNumberOfVisibleElements(locator);
        if (exists > 0) {
            await highlightElement(locator);
            await I.click(locator);
            await I.say(`✅ Selected subcategory: ${subCategory}`);
        } else {
            await I.say(`⚠️ Subcategory "${subCategory}" not found, skipping`);
        }
    }
}

module.exports = { addingProductbyCategory };
