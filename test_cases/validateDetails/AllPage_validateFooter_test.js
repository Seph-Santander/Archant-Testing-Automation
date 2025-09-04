Feature('Footer Validation');

Scenario('Check footer across multiple pages', async ({ I }) => {
    const urls = [
        "https://archant246.1902dev1.com/",
        "https://archant246.1902dev1.com/blog/articles/toki-lights.html",
        "https://archant246.1902dev1.com/shop.html",
        "https://archant246.1902dev1.com/shop/sinks.html",
        "https://archant246.1902dev1.com/shop/taps.html",
        "https://archant246.1902dev1.com/shop/handles.html",
        "https://archant246.1902dev1.com/shop/surfaces.html",
        "https://archant246.1902dev1.com/shop/wovenpanel.html",
        "https://archant246.1902dev1.com/shop/accessories.html",
        "https://archant246.1902dev1.com/shop/lights.html",
        "https://archant246.1902dev1.com/blog/category/projects/",
        "https://archant246.1902dev1.com/blog/category/articles/",
        "https://archant246.1902dev1.com/about",
        "https://archant246.1902dev1.com/our-people",
        "https://archant246.1902dev1.com/showroom",
        "https://archant246.1902dev1.com/showroom/auckland-showroom",
        "https://archant246.1902dev1.com/showroom/wellington-showroom",
        "https://archant246.1902dev1.com/showroom/christchurch-showroom",
        "https://archant246.1902dev1.com/book-a-showroom-appointment",
        "https://archant246.1902dev1.com/book-a-lunch-learn",
        "https://archant246.1902dev1.com/form/contact/",
        "https://archant246.1902dev1.com/customer/account/login/referer/aHR0cHM6Ly9hcmNoYW50MjQ2LjE5MDJkZXYxLmNvbS9mb3JtL2NvbnRhY3Q=/"
    ];

    for (const url of urls) {
        await I.amOnPage(url);
        await I.wait(2);

        await handleModal(I);
        await checkFooter(I, url);
        await I.wait(2);
    }

    async function handleModal(I) {
        const hasModal = await I.grabNumberOfVisibleElements('button[data-testid="Button"] div.sc-gFqAkR');
        if (hasModal > 0) {
        I.say('Modal found → clicking Continue anyway');
        await I.click('button[data-testid="Button"]');
        await I.wait(1);
        }
    }

    async function checkFooter(I, url) {
    I.say(`Checking footer on ${url}`);
    const copyright = "div.copyright small.copyright";

    // assert visible
    I.seeElement(copyright);

    // grab text & verify year
    const text = await I.grabTextFrom(copyright);
    const currentYear = new Date().getFullYear().toString();
    if (!text.includes(`Copyright © ${currentYear} Archant Ltd`)) {
        throw new Error(`Footer mismatch on ${url}. Got: ${text}`);
    }

    // scroll into view + highlight
    await I.executeScript(() => {
        const el = document.querySelector("div.copyright small.copyright");
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        const original = el.style.backgroundColor;
        let step = 0;
        const interval = setInterval(() => {
            if (step === 0) {
                el.style.backgroundColor = "red"; // 1st blink
            } else if (step === 1) {
                el.style.backgroundColor = "orange"; // 2nd blink
            } else if (step === 2) {
                el.style.backgroundColor = "green"; // 3nd blink
            } else {
                el.style.backgroundColor = original; // reset
            }
            step++;
            if (step > 3) {
                clearInterval(interval);
                el.style.backgroundColor = original;
            }
        }, 750);
    });

    I.say(`Footer OK on ${url}`);
}

});
