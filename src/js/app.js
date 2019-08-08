
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

  const app = {
    initPages: function() {

      const thisApp = this;
      /* get container of all children of pages container .children */
      this.pages = document.querySelector(select.containerOf.pages).children;
      
      /*get all links */
      this.navLinks = document.querySelectorAll(select.nav.links);
      
      /* page activation method  this.pages[0].id will get first id of first subpage*/
      const idFromHash = window.location.hash.replace('#/', '');

      let pageMatchingHash = this.pages[0].id; 

      for(let page of this.pages){
        if(page.id === idFromHash){
          pageMatchingHash = page.id;
          brake;
        }
      }

      this.activatePage(pageMatchingHash);

      /* add eventlistneres to links */
      for (let link of this.navLinks){
        link.addEventListener('click', function(e){
          e.preventDefault();

          /* get id from href  .replace('#', '') will remove #*/
          const id = this.getAttribute('href').replace('#', '');
          /* run activatePage with href attribute */
          thisApp.activatePage(id);
          
          /* change urls hash */
          window.location.hash = '#' + id;
        });
      }
    },

    activatePage: function(pageId){
      /* add class active to matching pages and remove active */
      for(let page of this.pages){
        page.classList.toggle(classNames.pages.active, page.id === pageId);
      }
      /* add class active to matching links and remove active */
      for(let link of this.navLinks){
        link.classList.toggle(
          classNames.nav.active, 
          link.getAttribute('href') === '#' + pageId
        );
      }
    },
    
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
          //console.log('parsedResponse', parsedResponse);

          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;
          /* execute initMenu method */
          thisApp.initMenu();
        });

        //console.log('thisApp.data', JSON.stringify(thisApp.data));
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

    /* boking init */
    initBookig: function() {
      const bookingContainer = document.querySelector(select.containerOf.bookingContainer);
      this.booking = new Booking(bookingContainer);
    },

    /* app init */
    init: function() {
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      this.initPages();

      this.initData();
      this.initCart();
      this.initBookig();
    },
  };

  app.init();
