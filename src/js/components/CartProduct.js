import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';


class CartProduct {
    constructor (menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
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
    /* get data for .getData */
    getData() {
      const thisCartProduct = this;
      thisCartProduct.id;
      thisCartProduct.ammount;
      thisCartProduct.price;
      thisCartProduct.params;
      thisCartProduct.priceSingle;
      thisCartProduct.name;
    }
  }

  export default CartProduct;