/* eslint-disable no-unused-vars */

import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.initActions();
    thisBooking.getData();
  }
  getData(){
    const  thisBooking = this;
    
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    /*parmas object */
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };
    // console.log('parametry', params);
    
    /* url object */
    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event 
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event 
                                     + '?' + params.eventsRepeat.join('&'),
    };
    // console.log('urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse){
        const bookingsResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    // usunąć jednego for dla events current i booking
    thisBooking.booked = {};
    /* zawiera wszystkie elementy i wpycha je do nowej ablicy 'events' */
    const events = [...bookings, ...eventsCurrent, ...eventsRepeat];
    /* loop for all events */
    // for(let item of eventsCurrent){
    //   thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    // }
    /* loop for all bookings */
    // for(let item of bookings){
    //   thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    // }
    console.log('events', events);
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    /*sparwdzenie dziennego lub tygodniowego eventu */
    for(let item of events){
      if(['daily', 'weekly'].includes(item.repeat)){
        let daysToAdd;
        switch(item.repeat){
          case 'daily':
            daysToAdd = 1;
          break;
          case 'weekly':
            daysToAdd = 7;
            break;
          default: 
          daysToAdd = 999;
        }
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, daysToAdd)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      } else {
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }
    }
    // console.log('this booking', thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    /* check if we have anythig for specific date */
    if(typeof thisBooking.booked[date] === 'undefined'){
      thisBooking.booked[date] = {};
    }
    /* convert dates do number */
    const startHour =  utils.hourToNumber(hour);

   /*loop for all enteties of specific table for all hours */
    for(let i = startHour; i< startHour + duration; i+= 0.5){
       /*check dates if we have any booking for specific date */
      if(typeof thisBooking.booked[date][i] === 'undefined'){
        thisBooking.booked[date][i] = [];
      }

      /*key = date */
      thisBooking.booked[date][i].push(table);
      }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailbe = false;
    if(
      typeof thisBooking.booked[thisBooking.date] === 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] === 'undefined'
    ){
      allAvailbe = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        //convert to number
        tableId = parseInt(tableId);
        // console.log(tableId);
      }
      if(!allAvailbe && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        table.addEventListener('click', function(e){
          e.preventDefault();
          table.classList.toggle(classNames.booking.reserved);
        });
      }
    }
  }

  initActions(){
    const thisBooking = this;

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.form.addEventListener('submit', function(e){
      e.preventDefault();
      thisBooking.sendOrder();
    });
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
   thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

   /* create hour picker dom */
   thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

   /*create table html */
   thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  thisBooking.dom.reserved = thisBooking.dom.wrapper.querySelector(select.containerOf.reserved);

   /* starter */
   thisBooking.dom.starters = document.getElementsByName('starter');
  }

  sendOrder(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    // console.log('url', url);

    const payload = {
      // table: thisBooking.table,
      table: [],
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      duration: thisBooking.hoursAmount.value,
      people: thisBooking.peopleAmount.value,
      starters: [],
    };

    for(let starter of thisBooking.dom.starters){
      if(starter.checked === true){
        payload.starters.push(starter.value);
      }
    }
    for(let table of thisBooking.dom.tables){
      if(table.classList.contains('reserved')){
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        /* for multi tables */
        payload.table.push(tableId);
        table.classList.remove('reserved');
        // thisBooking.table = tableId;
      }
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
  
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    //console.log('people amount', thisBooking.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
   // console.log('hours amount', thisBooking.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updateed', function(){
      thisBooking.updateDOM();
    });
  }
}
export default Booking;