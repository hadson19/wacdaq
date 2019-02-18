import React, { Component } from 'react';
import classNames from 'classnames';
import OrdersList from './orderList';
import { ORDERBOOK_BUY, ORDERBOOK_SELL, OFFSET_COUNT } from "../exchange";

class orderBook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.contentWithSliderSell = React.createRef();
    this.contentWithSliderBuy = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.orderBookDataSell.length !== this.props.orderBookDataSell.length) {
      if (!prevProps.orderBookDataSell.length && this.props.orderBookDataSell.length) {
        this.scrollToBottom(this.contentWithSliderSell.current);
      } else {
        const sellDataEl = this.contentWithSliderSell.current.querySelector(
          '.orderBook-content-tableBody-row'
        );

        if (sellDataEl) {
          this.contentWithSliderSell.current.scrollTop =
          this.contentWithSliderSell.current.scrollTop + sellDataEl.offsetHeight * OFFSET_COUNT;
        }
      }
    }
  }

  setSortBy(field) {
    if (this.state.sortBy === field) {
      if (this.state.sortByDirection === 'asc') {
        this.setState({ sortByDirection: 'desc' });
      } else if (this.state.sortByDirection === 'desc') {
        this.setState({ sortBy: false, sortByDirection: false });
      }
    } else {
      this.setState({ sortBy: field, sortByDirection: 'asc' });
    }
  }

  sortData(data) {
    data = Object.values(data);

    data.sort(
      function(a, b) {
        let comparison = 0;

        switch (this.state.sortBy) {
          case 'price':
            if (parseFloat(a.price) > parseFloat(b.price)) {
              comparison = 1;
            } else if (parseFloat(b.price) > parseFloat(a.price)) {
              comparison = -1;
            }

            return comparison;

          case 'amount_1':
            if (parseFloat(a.amount_1_sum) > parseFloat(b.amount_1_sum)) {
              comparison = 1;
            } else if (parseFloat(b.amount_1_sum) > parseFloat(a.amount_1_sum)) {
              comparison = -1;
            }

            return comparison;

          case 'amount_2':
            if (parseFloat(a.amount_2_sum) > parseFloat(b.amount_2_sum)) {
              comparison = 1;
            } else if (parseFloat(b.amount_2_sum) > parseFloat(a.amount_2_sum)) {
              comparison = -1;
            }

            return comparison;

          default:
            if (parseFloat(a.price) < parseFloat(b.price)) {
              comparison = 1;
            } else if (parseFloat(b.price) < parseFloat(a.price)) {
              comparison = -1;
            }

            return comparison;
        }
      }.bind(this)
    );

    if (this.state.sortByDirection === 'desc') data.reverse();

    return data;
  }

  scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
  }

  handleSellScroll = e => {
    if (e.target.scrollTop === 0) {
      this.props.updateOrderBook(ORDERBOOK_SELL, true);
    }
  };

  handleBuyScroll = e => {
    if (e.target.scrollTop === e.target.scrollHeight - e.target.offsetHeight) {
      this.props.updateOrderBook(ORDERBOOK_BUY, true);
    }
  };

  render() {
    let classes = classNames(['orderBook b-excnange']);
    let { orderBookDataSell, orderBookDataBuy, loading } = this.props;
    orderBookDataSell = this.sortData(orderBookDataSell);
    orderBookDataBuy = this.sortData(orderBookDataBuy);

    if (loading) {
      return (
        <div className={classes}>
          <div className="orderBook-title b-excnange__title">
            {this.props.t[this.props.language].exchangePage.titleOrderBook}
          </div>
          <div className="website website_loading module-loader" />
        </div>
      );
    }

    return (
      <div className={classes}>
        <div className="orderBook-title b-excnange__title">
          {this.props.t[this.props.language].exchangePage.titleOrderBook}
        </div>        
        <div className="orderBook-content">
          <div className="orderBook-content-tableHead">
            <div className="orderBook-content-tableHead-cell">Type</div>
            <div
              onClick={() => this.setSortBy('price')}
              className="orderBook-content-tableHead-cell text-center"
            >
              {this.props.t[this.props.language].exchangePage.price}
              {this.state.sortBy === 'price' && this.state.sortByDirection === 'asc' && (
                <div className="orderBook-content-tableHead-cell-sort" />
              )}
              {this.state.sortBy === 'price' && this.state.sortByDirection === 'desc' && (
                <div className="orderBook-content-tableHead-cell-sort orderBook-content-tableHead-cell-sort_desc" />
              )}
            </div>
            <div
              onClick={() => this.setSortBy('amount_1')}
              className="orderBook-content-tableHead-cell"
            >
              {this.props.t[this.props.language].exchangePage.amount} (
              {this.props.currentPair.listCurrency.short_name})
              {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'asc' && (
                <div className="orderBook-content-tableHead-cell-sort" />
              )}
              {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'desc' && (
                <div className="orderBook-content-tableHead-cell-sort orderBook-content-tableHead-cell-sort_desc" />
              )}
            </div>
            <div
              onClick={() => this.setSortBy('amount_2')}
              className="orderBook-content-tableHead-cell"
            >
              {this.props.t[this.props.language].exchangePage.amount} (
              {this.props.currentPair.titleCurrency.short_name})
              {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'asc' && (
                <div className="orderBook-content-tableHead-cell-sort" />
              )}
              {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'desc' && (
                <div className="orderBook-content-tableHead-cell-sort orderBook-content-tableHead-cell-sort_desc" />
              )}
            </div>
          </div>
          <div
            className="b-orderbook__content"
            ref={this.contentWithSliderSell}
            onScroll={this.handleSellScroll}
          >
            <OrdersList {...this.props} data={orderBookDataSell} typeSell={true}
              clickAction={this.props.handleBuyPriceAndAmountChange}/>

          </div>
          <div className="orderBook-content-lastPrice">
            <div className="orderBook-content-lastPrice-label">
              {this.props.t[this.props.language].exchangePage.lastPrice}:
            </div>
            <div className="orderBook-content-lastPrice-value">
              <span>{parseFloat(this.props.currencyStats.last_price).toFixed(8)}</span>{' '}
              {this.props.currentPair.titleCurrency.short_name}
            </div>
          </div>
          <div
            className="b-orderbook__content"
            ref={this.contentWithSliderBuy}
            onScroll={this.handleBuyScroll}
          >
            <OrdersList {...this.props} data={orderBookDataBuy} typeBuy={true} 
            clickAction={this.props.handleSellPriceAndAmountChange}/>
          </div>
        </div>
      </div>
    );
  }
}



export default orderBook;
