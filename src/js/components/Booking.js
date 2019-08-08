import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;
    /* genareate html */
    const generatedHtml = templates.bookingWidget();
    // console.log('generated html', generatedHtml);

    /*cerate empty this.dom element */
    thisBooking.dom = {};
    // console.log('dom obj', thisBooking.dom);
    /* wskazaniae na obiekt, który= element */
    thisBooking.dom.wrapper = element;

    /* change warper to html code */
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHtml);
    // console.log('html', thisBooking.dom.wrapper);
   
    /* find single element for people amount */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    // console.log('pople', thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    // console.log('hours', thisBooking.dom.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    console.log('people amount', thisBooking.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    console.log('hours amount', thisBooking.hoursAmount);
  }
}

export default Booking;
