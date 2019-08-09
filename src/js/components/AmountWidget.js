import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidgets.js';


/* Amount widget class */
class AmountWidget extends BaseWidget{
    constructor (element){
      /*refers to baseWidget */
      super(element, settings.amountWidget.defaultValue);

        const thisWidget = this;
        
        thisWidget.getElements(element);
        
        thisWidget.initActions();

    }
    getElements(/*element*/){
    const thisWidget = this;
  
    // thisWidget.element = element; this is done by bease widget
    // thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input); was this changed to thisWidget.dom.wrpapper
    thisWidget.dom.input = thisWidget.dom.wrpapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrpapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrpapper.querySelector(select.widgets.amount.linkIncrease);
  }
  /* set value */
  // setValue(value) {
  //     const thisWidget = this;

  //     const newValue = thisWidget.parseValue(value);

  //     /*  add validation */
  //     // if(thisWidget.input.value === thisWidget.input.value && thisWidget.input.value >= settings.amountWidget.defaultMin && thisWidget.input.value <= settings.amountWidget.defaultMax){
  //     //   thisWidget.value = newValue;
  //     //   thisWidget.announce();
  //     // }
  //     if(newValue != thisWidget.value && thisWidget.isValid(newValue)){
  //       thisWidget.value = newValue;
  //       thisWidget.announce();
  //     } else {
  //       thisWidget.value = settings.amountWidget.defaultValue;
  //     }
  //     // thisWidget.input.value = thisWidget.value;
  //     //thisWidget.dom.input.value = thisWidget.value;
  //     thisWidget.renderValue();
  // }

  isValid(value){
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;
    
    thisWidget.dom.input.value = thisWidget.value;
  }
  /* ad listeners */
  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.value(thisWidget.dom.input.value);
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(e){
      e.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(e){
      e.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
      //console.log(thisWidget.value, '*****value');
    });
  }
}

export default AmountWidget;