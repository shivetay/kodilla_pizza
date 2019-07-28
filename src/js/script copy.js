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
  constructor(id, data, appContext){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.appContext = appContext;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAcordeon();
    thisProduct.initOrderForm();
    thisProduct.processOrder();
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
  /*get elements */
  getElements(){
    const thisProduct = this;
  
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
  }

  /* init accordion */
  initAcordeon(){
    const thisProduct = this;
    
     /* find the clickable trigger (the element that should react to clicking) */
    const clickElements = thisProduct.accordionTrigger;
    
    /* START: click event listener to trigger */
    clickElements.addEventListener('click', function(e) {
        // close all
        thisProduct.appContext.closeAllAccordions();

        /* prevent default action for event */
        e.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(
          classNames.menuProduct.wrapperActive
        );
    }); /* END: click event listener to trigger */
  }
   /* close accordion */
  closeAccordion() {
    const thisProduct = this;

    thisProduct.element.classList.remove(
      classNames.menuProduct.wrapperActive
    );
  }

  /*init order form */
  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(e){
      e.preventDefault();
      thisProduct.processOrder();
    });
    
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    
    thisProduct.cartButton.addEventListener('click', function(e){
      e.preventDefault();
      thisProduct.processOrder();
    });
  }

  /*process order */
  processOrder(){
    const thisProduct = this;
    console.log(this);
    
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('**form data** ', formData);

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    console.log('price ***', price);
    
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      /* save the element in thisProduct.data.params with key paramId as const param */
      const PARAM = thisProduct.data.params[paramId];
      /* START LOOP: for each optionId in param.options */
      for(let optionId in PARAM.options){
        /* save the element in param.options with key optionId as const option */
        const OPTION = PARAM.options[optionId];

        /* split if block */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        /* START IF: if option is selected and option is not default */
        if(optionSelected && !OPTION.default){
          /* add price of option to variable price */
          price += OPTION.price;
        }else if(optionSelected && OPTION.default){
          /* deduct price of option from price */
          price += OPTION.price;
        }
      }/* END LOOP: for each optionId in param.options */
    }/* END LOOP: for each paramId in thisProduct.data.params */
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = price;
  }
}

const app = {
  /* creates new Product */
  initMenu: function(){
    /*const testProduct = new Product(); // eslint-disable-line no-unused-vars
    console.log(testProduct);*/
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

