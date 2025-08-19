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

    // Step 2: Handle subcategory selection
    const subCategorySelector = 'div.filter-options-content ol.items li.item a';

    // 🔹 Small helper to animate indicator before clicking
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
        await I.wait(1); // let animation be visible
    }

    if (subCategory) {
        // User gave a subcategory
        const locator = `//div[@class="filter-options-content"]//a[contains(normalize-space(), "${subCategory}")]`;
        await I.waitForElement(locator, 5);

        await highlightElement(locator);   // 👈 indicator before click
        await I.moveCursorTo(locator);
        await I.wait(2);
        await I.click(locator);

        await I.say(`✅ Selected subcategory: ${subCategory}`);
    } else {
        // No subcategory given → random pick
        const links = await I.grabAttributeFrom(subCategorySelector, 'href');
        const texts = await I.grabTextFrom(subCategorySelector);

        const randomIndex = Math.floor(Math.random() * links.length);
        const randomLink = links[randomIndex];
        const randomText = texts[randomIndex].trim();

        const randomLocator = `//a[@href="${randomLink}"]`;

        await highlightElement(randomLocator); // 👈 indicator before click
        await I.moveCursorTo(randomLocator);
        await I.wait(2);
        await I.click(randomLocator);

        await I.say(`🎲 Randomly selected subcategory: ${randomText}`);
    }
}

module.exports = { addingProductbyCategory };
