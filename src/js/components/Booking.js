import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

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

    /* insert to DOM */
    const bookingContainer = document.querySelector(select.containerOf.booking);
    bookingContainer.appendChild(thisBooking.dom.wrapper);
   
    /* find single element for people amount */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    // console.log('pople', thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    // console.log('hours', thisBooking.dom.hoursAmount);

    /* create date picker dom */
   thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    console.log('people amount', thisBooking.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    console.log('hours amount', thisBooking.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}

export default Booking;
