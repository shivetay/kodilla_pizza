/* global rangeSlider */
import BaseWidget from './BaseWidgets.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class HourPicker extends BaseWidget {
    constructor(wrapper){
        super (wrapper, settings.hours.open);

        const thisWidget = this;
        thisWidget.dom.wrapper = wrapper;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
        console.log('input', thisWidget.dom.input);
        thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
        console.log('output', thisWidget.dom.output);

        thisWidget.initPlugin();
        thisWidget.value = thisWidget.dom.input;
        console.log('input val', thisWidget.value);
    }
    initPlugin(){
        const thisWidget = this;

        rangeSlider.create(thisWidget.dom.input);
        console.log('slider',rangeSlider);
        thisWidget.dom.input.addEventListener('input', function(){
            thisWidget.value = thisWidget.dom.input;
            console.log('widgte value', thisWidget.value);
        })
       
    }
    parseValue(value){
        utils.numberToHour(value);
        return value;
    }
    isValid(value){
        
      }

    renderValue(){
        const thisWidget = this;
        thisWidget.dom.output = thisWidget.value;
        console.log('outpu',thisWidget.dom.output);
    }

}

export default HourPicker;