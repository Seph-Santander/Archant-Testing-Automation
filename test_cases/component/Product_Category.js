async function assertProductCategory(I) {
    // Hover Products
    I.wait(3);
    I.moveCursorTo('a.level-top[href*="shop.html"]');

    // Assert submenu links
    I.wait(5);
    I.see('Sinks', 'a[href*="shop/sinks.html"]');
    I.see('Taps', 'a[href*="shop/taps.html"]');
    I.see('Handles', 'a[href*="shop/handles.html"]');
    I.see('Surfaces', 'a[href*="shop/surfaces.html"]');
    I.see('Wovenpanel®', 'a[href*="shop/wovenpanel.html"]');
    I.see('Accessories', 'a[href*="shop/accessories.html"]');
    I.see('Lights', 'a[href*="shop/lights.html"]');
    I.see('Clearance Products', 'a[href*="archant-outlet"]');

    // Success message
    I.say('All submenu items under Products are visible');

}

module.exports = {assertProductCategory};