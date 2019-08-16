import {classNames, select, templates, settings} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';


class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      
      thisCart.getElements(element);
      thisCart.initActions();

      //console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

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
       // console.log('***', thisCart.remove(event.detail.cartProduct));
      });
      thisCart.dom.form.addEventListener('submit', function(e){
        e.preventDefault();
        thisCart.sendOrder();
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
    /* remove method for cart */
    remove(cartProduct){
      const thisCart = this;
      // console.log('this Cart', thisCart);
      /* const idext with cartProduct as index of thisCart.products arr */
      const index = thisCart.products.indexOf(cartProduct);
      // console.log('index', index);
      /*remove values from arr */
      thisCart.products.splice(index);
      // console.log('this cart products', thisCart.products);
      /*remove from DOM */
      cartProduct.dom.wrapper.remove();
      //thisCart.remove(cartProduct);

      thisCart.updateMethod();
      // console.log('this Cart update', thisCart);
    }
    /* send order method */
    sendOrder(){
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;

      const payload = {
        products: [],
        address: 'test',
        totalPrice: thisCart.totalPrice,
      };

      for(let product of thisCart.products) {
        payload.products.push(product.getData());
        console.log('product',product);
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedresponse', parsedResponse);
        });
    }
  }

  export default Cart;