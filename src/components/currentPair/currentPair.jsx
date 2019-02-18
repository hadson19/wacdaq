import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import StarRating from '../starRating';

class currentPair extends Component {
  timehash = Date.now();

  render() {
    const { loading, data } = this.props;

    let currentPairClasses = ['currentPair', 'b-excnange-fill'];   

    if (loading)
      currentPairClasses.push('currentPair_loading');

    if (!data || loading) return <div className={classNames(currentPairClasses)} />;

    currentPairClasses.push('currentPair_' + data.curr_data.short_name);
    currentPairClasses = classNames(currentPairClasses);

    let changeClasses = ['currentPair-information-tableBody-row-cell'];

    if (data.change > 0)
      changeClasses.push('currentPair-information-tableBody-row-cell_green');
    else if (data.change < 0)
      changeClasses.push('currentPair-information-tableBody-row-cell_red');

    changeClasses = classNames(changeClasses);
    
    return (
      <div className={currentPairClasses}>
        <div className="currentPair-logo">
          <img
            src={`/static/images/coins_logo/${data.curr_data.short_name}.png?${this.timehash}`}
            alt=""
          />
          <div className="currentPair-coininfo">
            <p>
              {data.curr_data.name}
              <Link to={`/projects/${data.curr_data.short_name}`}>
                details
              </Link>
            </p>
            <div className="rating">
              <StarRating rating={data.curr_data.revain_rating} />
              <a target="_blank" rel="noopener noreferrer" href={data.curr_data.revain_link}>
                on Revain
              </a>
            </div>
          </div>
        </div>
        <div className="currentPair-information">
          <div className="currentPair-information-tableHead">
            <div className="currentPair-information-tableHead-row">
              <div className="currentPair-information-tableHead-row-cell">
                {this.props.t[this.props.language].exchangePage.lastPrice}
              </div>
              <div className="currentPair-information-tableHead-row-cell">
                {this.props.t[this.props.language].exchangePage.fullDayHoursShift}
              </div>
              <div className="currentPair-information-tableHead-row-cell">
                {this.props.t[this.props.language].exchangePage.fullDayHoursHigh}
              </div>
              <div className="currentPair-information-tableHead-row-cell">
                {this.props.t[this.props.language].exchangePage.fullDayHoursLow}
              </div>
            </div>
          </div>
          <div className="currentPair-information-tableBody">
            <div className="currentPair-information-tableBody-row">
              <div className="currentPair-information-tableBody-row-cell">
                {parseFloat(data.last_price).toFixed(8)}
              </div>
              <div className={changeClasses}>
                {(data.change > 0 ? '+' : '') +
                  parseFloat(data.change).toFixed(2)}
                %
              </div>
              <div className="currentPair-information-tableBody-row-cell">
                {parseFloat(data.max).toFixed(8)}
              </div>
              <div className="currentPair-information-tableBody-row-cell">
                {parseFloat(data.min).toFixed(8)}
              </div>
            </div>
            <div className="currentPair-information-tableBody-row currentPair-information-tableBody-row_total">
              <div className="currentPair-information-tableBody-row-cell">
                {this.props.t[this.props.language].exchangePage.dayHvolume}
              </div>
              <div className="currentPair-information-tableBody-row-cell currentPair-information-tableBody-row-cell_total">
                {parseFloat(data.volume[0]).toFixed(2)}{' '}
                {data.curr_data.short_name} /{' '}
                {parseFloat(data.volume[1]).toFixed(2)}{' '}
                {this.props.currentPair.titleCurrency.short_name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default currentPair;
