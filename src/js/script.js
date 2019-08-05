{
  /* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

  ('use strict');

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
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
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    /* add local db */
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  /*Product object */
  class Product {
    /*product constructor */
    constructor(id, data, appContext) {
      const thisProduct = this;
      thisProduct.appContext = appContext;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAcordeon();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();  
    }
   
    /* close acordion */
    closeAccordion() {
      const thisProduct = this;

      thisProduct.element.classList.remove(
        classNames.menuProduct.wrapperActive
      );
    }

    /*render product*/
    renderInMenu() {
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
    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );
      thisProduct.form = thisProduct.element.querySelector(
        select.menuProduct.form
      );
      thisProduct.formInputs = thisProduct.form.querySelectorAll(
        select.all.formInputs
      );
      thisProduct.cartButton = thisProduct.element.querySelector(
        select.menuProduct.cartButton
      );
      thisProduct.priceElem = thisProduct.element.querySelector(
        select.menuProduct.priceElem
      );
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    /* init amount widget */
    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('update', function(){
        thisProduct.processOrder();
      });
  }

    /* init accordion */
    initAcordeon() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickElements = thisProduct.accordionTrigger;

      /* START: click event listener to trigger */
      clickElements.addEventListener('click', function(e) {
        // close all
        //thisProduct.appContext.closeAllAccordions();

        /* prevent default action for event */
        e.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(
          classNames.menuProduct.wrapperActive
        );
      }); /* END: click event listener to trigger */
    }

    /*init order form */
    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(e) {
        e.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    /*process order */
     /*process order */
    processOrder(){
    const thisProduct = this;
    
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      /* save the element in thisProduct.data.params with key paramId as const param */
      const PARAM = thisProduct.data.params[paramId];
      /* START LOOP: for each optionId in param.options */
      for(let optionId in PARAM.options){
        /* save the element in param.options with key optionId as const option */
        const OPTION = PARAM.options[optionId];
        /* start if block */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        /* START IF: if option is selected and option is not default */
        if(optionSelected && !OPTION.default){
          /* add price of option to variable price */
          price += OPTION.price;
        } else if(optionSelected && OPTION.default){
          /* deduct price of option from price */
          price += OPTION.price;
        }
        /* product options */
        if(!thisProduct.params[paramId]){
          thisProduct.params[paramId] = {
            label: PARAM.label,
            options: {},
          };
        }
        thisProduct.params[paramId].options[optionId] = OPTION.label;
        /* image if block */
        /* create a class name */
        const imgClass = paramId + '-' + optionId;
        /* get img dom elements */
        const imgs = thisProduct.imageWrapper.children;
        
        /*start if/else option defalut selectd and check class name */
        for(let img of imgs){
          /* check if imgae have specific class */
          if(img.classList.contains(imgClass)){
            /* check if option is selected */
            if(optionSelected){
              /* add active class */
              img.classList.add(classNames.menuProduct.imageVisible);
            } else {
            /* remove active class */
              img.classList.remove(classNames.menuProduct.imageVisible);
            }/* end if else */
          }/* end if */
        } /* end for loop */
      }/* END LOOP: for each optionId in param.options */
    }/* END LOOP: for each paramId in thisProduct.data.params */
    /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.price;

      console.log('this product params', thisProduct.params);
    }

    /*add to cart */
    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;

      app.cart.add(thisProduct);
    }
  }

  /* Amount widget class */
  class AmountWidget {
      constructor (element){
          const thisWidget = this;
          
          thisWidget.getElements(element);
          thisWidget.value = settings.amountWidget.defaultValue;
          thisWidget.setValue(thisWidget.input.value);
          thisWidget.initActions();

      }
      getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    /* set value */
    setValue(value) {
        const thisWidget = this;

        const newValue = parseInt(value);

        /*  add validation */
        if(thisWidget.input.value === thisWidget.input.value && thisWidget.input.value >= settings.amountWidget.defaultMin && thisWidget.input.value <= settings.amountWidget.defaultMax){
          thisWidget.value = newValue;
          thisWidget.announce();
        } else {
          thisWidget.value = settings.amountWidget.defaultValue;
        }
        thisWidget.input.value = thisWidget.value;
    }
    /* ad listeners */
    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(e){
        e.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(e){
        e.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
        //console.log(thisWidget.value, '*****value');
      });
    }

    /* annouce method */
    announce() {
      /*
      const thisWidget = this;

      const event = new Event('update');
      thisWidget.element.dispatchEvent(event);*/
      const thisWidget = this;

      const event = new CustomEvent('update', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      
      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }

    initActions(){
    const  thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(e){
        e.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('update', function(){
        thisCart.updateMethod();
      });
      thisCart.dom.productList.addEventListener('remove', function(){
        thisCart.remove(event.detail.cartProduct);
        console.log('***', thisCart.remove());
      });
    }
    /* add to cart */
    add(menuProduct){
      const thisCart = this;
      /* create html */
      const generatedHTML = templates.cartProduct(menuProduct);
      /* create dom element */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      /* get item container */
      const cartConatiner = thisCart.dom.productList;
      /* insert dom to cart */
      cartConatiner.appendChild(generatedDOM);

      /* test cart */
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.updateMethod();
    }
    /* announce method */
    updateMethod() {
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      const event = new CustomEvent('update', {
        bubbles: true
      });
      thisCart.dom.wrapper.dispatchEvent(event);

      for(let cartProduct of thisCart.products){
        thisCart.subtotalPrice += cartProduct.price;
        thisCart.totalNumber += cartProduct.amount;
        // console.log('cart product', cartProduct);
        // console.log('**price', cartProduct.price);
        // console.log('**number', cartProduct.amount);
        // console.log('**subtotal price', thisCart.subtotalPrice);
        // console.log('**subtotal number', thisCart.totalNumber);
      }

      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }
    /*TODO: FIXME: remove method for cart */
    remove(cartProduct){
      const thisCart = this;
      console.log('this Cart', thisCart);
      /* const idext with cartProduct as index of thisCart.products arr */
      const index = thisCart.products.indexOf(cartProduct);
      console.log('index', index);
      /*remove values from arr */
      thisCart.products.splice(index);
      console.log('this cart products', thisCart.products);
      /*remove from DOM */
      
      cartProduct.dom.wrapper.remove();

      thisCart.updateMethod();
      console.log('this Cart update', thisCart);
    }
  }

  class CartProduct {
    constructor (menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle =menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;

      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
      // thisCartProduct.initWidgetActions();
      console.log('this cart product', thisCartProduct);
    }
    /* init all actions */
    initActions(){
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function(e){
        e.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function(e){
        e.preventDefault();
        thisCartProduct.remove();
        console.log('remove');
      });
    }
   /* get elements method */
    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    /* ammount widget */
    initAmountWidget(){
      const thisCartProduct = this;
      
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener('update', function(){
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
    /* remove method */
    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    } 
  }
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
        
          new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
        
      }
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
}