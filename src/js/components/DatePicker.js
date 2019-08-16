/* global flatpickr */
import BaseWidget from './BaseWidgets.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class DatePicker extends BaseWidget {
    constructor (wrapper){
        super(wrapper, utils.dateToStr(new Date()));
        
        const thisWidget = this;

        thisWidget.dom.wrapper = wrapper;
        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
        // console.log('input',thisWidget.dom.input);
        
        thisWidget.initPlugin();
    }
    initPlugin(){
        const thisWidget = this;
        thisWidget.minDate = new Date(thisWidget.value);
        // console.log('min date', thisWidget.minDate);
        thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
        // console.log('max date', thisWidget.maxDate);
        // console.log(settings.datePicker.maxDaysInFuture);

        flatpickr(thisWidget.dom.input,{
            defaultDate: thisWidget.minDate,
            minDate: thisWidget.minDate,
            maxDate: new Date().fp_incr(14),
            'locale': {
                'firstDayOfWeek': 1 // start week on Monday
            },
            'disable': [
                function(date) {
                    return (date.getDay() === 1);
                }
            ], 
            onChange: function(dateStr){
                thisWidget.value = dateStr;
            } 
        });  
    }

    parseValue(value){
        //zmiana w module 10.3 pkt 3
        //return parseInt(value);
        // console.log('value',value);
        return value;
    }
    // isValid(){
    //     return true;
    // }
    renderValue(){

    }
}

export default DatePicker;