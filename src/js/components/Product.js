import {classNames, select, templates, } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';


/*Product object */
 class Product {
    /*product constructor */
    constructor(data, appContext) {
      const thisProduct = this;
      thisProduct.appContext = appContext;
      thisProduct.id = data.id;
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
        // close all FIXME:
        thisProduct.appContext.closeAllAccordions();

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

      //console.log('this product params', thisProduct.params);
    }

    /*add to cart */
    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;

      //app.cart.add(thisProduct);
      const EVENT = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct,
        },
      });
      thisProduct.element.dispatchEvent(EVENT);
    }
  }

  export default Product;