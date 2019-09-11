/* global rangeSlider */
import BaseWidget from './BaseWidgets.js';
import utils from '../utils.js';
import { select, settings } from '../settings.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;
    thisWidget.dom.wrapper = wrapper;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.hourPicker.input
    );
    // console.log('input', thisWidget.dom.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(
      select.widgets.hourPicker.output
    );
    // console.log('output', thisWidget.dom.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
    // thisWidget.dom.input.value = thisWidget.value;
    // console.log('input val', thisWidget.value);
    // console.log('hours', settings.hours.open);
  }
  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;

      // thisWidget.dom.input.value = thisWidget.value;
      // console.log('widgte value', thisWidget.value);
    });
  }
  parseValue(value) {
    // utils.numberToHour(value);
    // console.log('val**', utils.numberToHour(value));
    return utils.numberToHour(value);
  }
  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
    // console.log('outpu',thisWidget.dom.output.innerHTML);
  }
}

export default HourPicker;
