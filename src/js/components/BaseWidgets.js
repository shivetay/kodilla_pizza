import {settings} from '../settings.js';

class BaseWidget{
    constructor(wrpapperElement, initialValue) {
        const thisWidget = this;

        /* contains all dom elements */
        thisWidget.dom = {};

        thisWidget.dom.wrpapper = wrpapperElement;

        /* strat widget value */
        thisWidget.correctValue = initialValue;
    }

    get value(){
        const thisWidget = this;

        /* zapisanie wartości value w thisCorect value */
        return thisWidget.correctValue;
    }

    set value(value) {
        const thisWidget = this;
  
        const newValue = thisWidget.parseValue(value);
  
        /*  add validation */
        // if(thisWidget.input.value === thisWidget.input.value && thisWidget.input.value >= settings.amountWidget.defaultMin && thisWidget.input.value <= settings.amountWidget.defaultMax){
        //   thisWidget.value = newValue;
        //   thisWidget.announce();
        // }
        if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
          thisWidget.correctValue = newValue;
          thisWidget.announce();
        } else {
          thisWidget.correctValue = settings.amountWidget.defaultValue;
        }
        // thisWidget.input.value = thisWidget.value;
        //thisWidget.dom.input.value = thisWidget.value;
        thisWidget.renderValue();
    }
    setValue(value){
        const thisWidget = this;
        thisWidget.value = value;
        //return thisWidget.value;
    }
    parseValue(value){
        //zmiana w module 10.3 pkt 3
        return parseInt(value);
        //return value;
    }
    
    isValid(value){
    return !isNaN(value);
    }

    renderValue(){
    const thisWidget = this;
    thisWidget.dom.wrpapper.innerHTML = thisWidget.value;
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
        thisWidget.dom.wrpapper.dispatchEvent(event);
    }
}

//wraperElement jest to element dom w który znajduje sie widged
export default BaseWidget;