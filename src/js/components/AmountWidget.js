import {select, settings} from './settings.js';

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

export default AmountWidget;