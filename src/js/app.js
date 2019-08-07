
import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

  const app = {
    productRef: [],
    closeAllAccordions: function() {
      this.productRef.forEach(product => product.closeAccordion());
    },
    /* creates new Product */
    initMenu: function() {
      // const testProduct = new Product(); // eslint-disable-line no-unused-vars
      // console.log(testProduct);

      const thisApp = this;

      for (let productData in thisApp.data.products) {
        this.productRef.push(
          new Product(thisApp.data.products[productData].id, thisApp.data.products[productData])
      );}
    },

    /* init data from source */
    initData: function() {
      const thisApp = this;

      thisApp.data = {};
      /*save andpoitn url */
      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);

          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;
          /* execute initMenu method */
          thisApp.initMenu();
        });

        console.log('thisApp.data', JSON.stringify(thisApp.data));
    },
    /* cart init */
    initCart: function() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(e){
        app.cart.add(e.detail.product);
      });
    },

    /* app init */
    init: function() {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initCart();
    },
  };

  app.init();
