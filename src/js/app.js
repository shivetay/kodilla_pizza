
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

  const app = {
    initPages: function() {

      const thisApp = this;
      /* get container of all children of pages container .children */
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      
      /*get all links */
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      thisApp.homeLinks = document.querySelectorAll(select.home.options);
      thisApp.headerLinks = document.querySelectorAll(select.nav.logoLink);
      thisApp.cartContainer  = document.querySelector('.cart');
      
      /* page activation method  thisApp.pages[0].id will get first id of first subpage*/
      const idFromHash = window.location.hash.replace('#/', '');

      let pageMatchingHash = thisApp.pages[0].id; 

      for(let page of thisApp.pages){
        if(page.id === idFromHash){
          pageMatchingHash = page.id;
          break;
        }
      }

      thisApp.activatePage(pageMatchingHash);

      /* add eventlistneres to links */
      for (let link of thisApp.navLinks){
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
      for (let link of thisApp.homeLinks){
        link.addEventListener('click', function(e){
          e.preventDefault();

          /* get id from href  .replace('#', '') will remove #*/
          const id = this.getAttribute('href').replace('#', '');
          /* run activatePage with href attribute */
          thisApp.activatePage(id);
          
          /* change urls hash */
          window.location.hash = '#' + id;
        });
        for (let link of thisApp.headerLinks){
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
      } 
    },

    activatePage: function(pageId){
      const thisApp = this;
      /* add class active to matching pages and remove active */
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id === pageId);
      }
      /* add class active to matching links and remove active */
      for(let link of thisApp.navLinks){
        link.classList.toggle(
          classNames.nav.active, 
          link.getAttribute('href') === '#' + pageId
        );
        if(pageId === 'home'){
          link.classList.add(
            classNames.helper.hide
          );
        } else {
          link.classList.remove(
            classNames.helper.hide
          );
        }
      }
      for (let link of thisApp.homeLinks){
        link.getAttribute('href') === '#' + pageId;
      }
    },
    
    productRef: [],
    closeAllAccordions: function() {
      const thisApp = this;
      thisApp.productRef.forEach(product => product.closeAccordion());
    },
    /* creates new Product */
    initMenu: function() {
      // const testProduct = new Product(); // eslint-disable-line no-unused-vars
      // console.log(testProduct);

      const thisApp = this;

      for (let productKey in thisApp.data.products) {
        const productData = thisApp.data.products[productKey];
        this.productRef.push(
          new Product(productData, thisApp)
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
    initBooking: function() {
      const thisApp = this;
      const bookingContainer = document.querySelector(select.containerOf.booking);
      thisApp.booking = new Booking(bookingContainer);
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
      this.initBooking();
    },
  };

  app.init();

  /*heroku git*/
