import React, { Component } from 'react';
import moment from 'moment';

class Counter extends Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      counterInterval: null
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.counterInterval);
  }

  componentDidMount() { 
    this.setState( { counterInterval: setInterval(this.getCounterData, 1000) } );
    this.getCounterData();
  }

  getCounterData = () => {
    const currentDate = moment();
    const finishDate = moment(this.props.data.dt_end);
    const leftTime = moment.duration(finishDate.diff(currentDate));
    if (leftTime.milliseconds() < 0) {
      clearInterval(this.state.counterInterval);      
    } else {
      this.setState({
        days: ('0' + leftTime.days()).slice(-2),
        hours: ('0' + leftTime.hours()).slice(-2),
        minutes: ('0' + leftTime.minutes()).slice(-2),
        seconds: ('0' + leftTime.seconds()).slice(-2)
      });
    }
  }

  render() {
    return (
      <div className="b-counter">
        <div className="b-counter__dates">
          <ul>
            <li>{this.props.t[this.props.language].votePage.start}<span>{this.props.data.dt_start}</span></li>
            <li>{this.props.t[this.props.language].votePage.finish}<span>{this.props.data.dt_end}</span></li>
          </ul>
        </div>
        <div className="b-counter__title">
          {this.props.t[this.props.language].votePage.voitEnd}
        </div>
        <ul>
          <li>
            {this.state.days}
            <span>{this.props.t[this.props.language].votePage.days}</span>
          </li>
          <li>
            {this.state.hours}
            <span>{this.props.t[this.props.language].votePage.hours}</span>
          </li>
          <li>
            {this.state.minutes}
            <span>{this.props.t[this.props.language].votePage.minutes}</span>
          </li>
          <li>
            {this.state.seconds}
            <span>{this.props.t[this.props.language].votePage.seconds}</span>
          </li>
        </ul>
      </div>
    )
  }
}

export default Counter