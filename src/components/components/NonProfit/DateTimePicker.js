import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import * as timeUtil from '../../../config/timeUtil';
import '../../../assets/styles/DateTimePicker.css'

class DateTimePicker extends React.Component {
  constructor() {
    super();
    this.state = {
      scheduledDate: {},
      scheduledTime: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.reserveBasket = this.reserveBasket.bind(this);
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  reserveBasket() {
    const { scheduledDate, scheduledTime } = this.state;
    const {
      _basketID,
      _phoneNumber,
      _message,
      _toastMessage,
      _parentToggle
    } = this.props;
    const fakePhoneNumber = '13033496264';

    let time = timeUtil.toEpoch(scheduledDate, scheduledTime);

    let formattedTime = timeUtil.fromEpoch(time, 'ddd, MMM Do, h:mm a');

    let twilio_message = _message.concat(formattedTime);
    let toast_message = _toastMessage.concat(formattedTime);

    this.props._scheduleBasket(
      time,
      fakePhoneNumber,
      twilio_message,
      toast_message,
      _basketID
    );

    this.setState({
      scheduledDate: {},
      scheduledTime: {}
    });

    this.props._toggleReservationCard();
  }

  render() {
    const { scheduledDate, scheduledTime } = this.state;

    return (
      <div className='date-time-picker-contain'>
        <button onClick={() => this.reserveBasket()}>Submit</button>
        <DatePicker
        textFieldStyle={{width: '100%'}}
          value={scheduledDate}
          onChange={(x, date) => this.handleChange('scheduledDate', date)}
          hintText="Date"
        />
        <TimePicker
        textFieldStyle={{width: '100%'}}
          value={scheduledTime}
          onChange={(x, time) => this.handleChange('scheduledTime', time)}
          hintText="Time"
        />
      </div>
    );
  }
}
export default DateTimePicker;
