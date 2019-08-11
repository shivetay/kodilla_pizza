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
        thisWidget.dom.outpot = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
        console.log('output', thisWidget.dom.output);

        thisWidget.initPlugin();
        thisWidget.dom.input = thisWidget.value;
        console.log('input val', thisWidget.dom.input);
    }
    initPlugin(){
        const thisWidget = this;

        rangeSlider.create(thisWidget.dom.input);
        console.log('slider',rangeSlider);
        thisWidget.dom.input.addEventListener('input', function(){
            rangeSlider = thisWidget.value;
            console.log('slider value',rangeSlider);
        });
    }
    parseValue(value){
        utils.numberToHour(value);
        console.log('par val', parVal);
        console.log('val', value);
        return value;
    }
    isValid(value){
        return value;
      }
    renderValue(){
        const thisWidget = this;
        thisWidget.dom.output = thisWidget.value;
        console.log('output render', thisWidget.dom.output);
    }

}


export default HourPicker;