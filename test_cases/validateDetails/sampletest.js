const { backendLogin,
        setupBackend,
        getProductNames,
        assertingProducts,
        getProductStocks,
        assertingPreOrderProducts } = require('../component/login');

Feature('Backend login');

Scenario('Backend login', async ({ I }) => {

    // backend login credentials
    const username = 'aqo';
    const password = '22GaDmjh%iBDG-wZpC';

    await backendLogin(I, username, password);

    I.wait(10);

});
