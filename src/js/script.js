/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  /*Product object */
  class Product{
    /*product constructor */
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAcordeon();
    }
    /*render product*/
    renderInMenu(){
      const thisProduct = this;
      /* create product html*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*create dom using UTILS*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find item container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*inster DOM*/
      menuContainer.appendChild(thisProduct.element);
    }

    /* init acordeon */
    initAcordeon(){
      const thisProduct = this;
      
       /* find the clickable trigger (the element that should react to clicking) */
      const clickElements = thisProduct.element.querySelector(select.menuProduct.clickable);
      
      /* START: click event listener to trigger */
      clickElements.addEventListener('click', function(e){
        /* prevent default action for event */
        e.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        console.log(thisProduct);
        /* find all active products */
        const allActiveProducts = thisProduct.element.querySelectorAll(select.all.menuProductsActive);
         /* START LOOP: for each active product */
        for (let activeProduct of allActiveProducts){
          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct.classList === select.all.menuProductsActive){
            /* remove class active for the active product */
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
          } /* END: if the active product isn't the element of thisProduct */ 
        }/* END LOOP: for each active product */
      });/* END: click event listener to trigger */  
    }
  }

  const app = {
    /* creates new Product */
    initMenu: function(){
      const testProduct = new Product(); // eslint-disable-line no-unused-vars
      console.log(testProduct);
    },

    /* init data from source */
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    /* app init */
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  /*Product object */
  class Product{
    /*product constructor */
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
    }
    /*render product*/
    renderInMenu(){
      const thisProduct = this;
      /* create product html*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*create dom using UTILS*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find item container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*inster DOM*/
      menuContainer.appendChild(thisProduct.element);
    }

    /* init acordeon */
    initAcordeon(){
      const thisProduct = this;
      console.log(thisProduct);
       /* find the clickable trigger (the element that should react to clicking) */
      const clickElements = document.querySelector(select.menuProduct.clickable);
      /* START: click event listener to trigger */
      clickElements.addEventListener('click', function(e){
        /* prevent default action for event */
        e.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');
        /* find all active products */
        const allActiveProducts = document.querySelectorAll('.active');
         /* START LOOP: for each active product */
        for (let activeProduct of allActiveProducts){
          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct.classList === 'active'){
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          } /* END: if the active product isn't the element of thisProduct */ 
        }/* END LOOP: for each active product */
      });/* END: click event listener to trigger */  
    }
  }

  const app = {
    /* creates new Product */
    initMenu: function(){
      const testProduct = new Product();
    },

    /* init data from source */
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;

      for (let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    /* app init */
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
