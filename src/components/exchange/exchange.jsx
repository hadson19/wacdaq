import React, { Component } from 'react';
import Markets from '../markets';
import Balance from '../balance';
import CurrentPair from '../currentPair';
import OrderBook from '../orderBook';
import Graph from '../graph';
import Buy from '../buy';
import Sell from '../sell';
import TradeHistory from '../tradeHistory';
import MarketDepthGraph from '../marketDepthGraph';
import MyOrders from '../myOrders';

export const ORDERBOOK_BUY = 1;
export const ORDERBOOK_SELL = 2;
export const OFFSET_COUNT = 100;

class exchange extends Component {
  _mount = false;
  currencyStatsInterval = null;
  orderBookInterval = null;
  
  constructor(props) {
    super(props);
    
    this.state = {
      currencyStats: {},
      currencyStatsLoading: true,
      orderBook: {},
      orderInterval: null,
      orderBookDataBuy: [],
      orderBookDataSell: [],
      orderBookLoading: true, // TODO: Нужно унифицировать название переменных которые отвечают за обновление данных. Предложение: использовать название loading и для компонентов <имяКомпонента>Loading
      sellDataOffset: 0,
      buyDataOffset: 0,
    };

    document.title = this.props.t[this.props.language].projectName + ' – Exchange';

    this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
    this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
    this.handleBuyTotalChange = this.handleBuyTotalChange.bind(this);
    this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
    this.handleSellAmountChange = this.handleSellAmountChange.bind(this);
    this.handleSellTotalChange = this.handleSellTotalChange.bind(this);
    this.handleSellFormSubmit = this.handleSellFormSubmit.bind(this);
    this.handleBuyFormSubmit = this.handleBuyFormSubmit.bind(this);

    /*
    this.getOrderBook(
      this.props.currentPair.titleCurrency.id,
      this.props.currentPair.listCurrency.id
    );
    */
  }

  componentDidMount() {
    this._mount = true;
    window.scrollTo(0, 0);
    
    this.updateCurrencyStats();
    this.updateOrderBook();   

    this.currencyStatsInterval = setInterval(() => {
      this.updateCurrencyStats()
    }, 5000);

    this.orderBookInterval = setInterval(() => {
      this.updateOrderBook(ORDERBOOK_BUY);
      this.updateOrderBook(ORDERBOOK_SELL);
    }, 5000);
  }

  componentWillUnmount() {
    this._mount = false; 
    clearInterval(this.currencyStatsInterval);
    clearInterval(this.orderBookInterval);
  }

  componentDidUpdate(prevProps) {
    const { currentPair } = this.props;

    if (currentPair.pairId !== prevProps.currentPair.pairId) {
      this.setState({
        currencyStatsLoading: true,
        orderBookLoading: true,
        sellDataOffset: 0,
        buyDataOffset: 0,
      }, () => {
        this.updateCurrencyStats();
        this.updateOrderBook();
      });
    }
  }

  updateCurrencyStats = async () => {
    const { currentPair, api } = this.props;

    try {
      const { data } = await api.getCurrencyStats({
        curr1: currentPair.listCurrency.id,
        curr2: currentPair.titleCurrency.id,
      })
  
      if (this._mount) {
        this.setState({ currencyStats: data, currencyStatsLoading: false });
      }
    } catch (ex) {
      console.warn(ex);
    }
  }

  updateOrderBook = async (type = null, lazy = false) => {
    const { currentPair, api } = this.props;

    let offset = 0;

    switch (type) {
      case ORDERBOOK_BUY:
        offset = this.state.buyDataOffset;
        break;
      case ORDERBOOK_SELL:
        offset = this.state.sellDataOffset
        break;
    }

    offset = lazy ? offset + OFFSET_COUNT : offset;

    try {
      const { data } = await api.getOrderBook({
        curr1: currentPair.listCurrency.id,
        curr2: currentPair.titleCurrency.id,
        type,
        offset: lazy ? offset : 0,
        limit: lazy ? OFFSET_COUNT : offset + OFFSET_COUNT,
      });

      const state = {
        orderBookLoading: false,
      };

      switch (type) {
        case ORDERBOOK_BUY:
          state.orderBookDataBuy = data;
          if (lazy) state.buyDataOffset = offset;
          break;
        case ORDERBOOK_SELL:
          state.orderBookDataSell = data;
          if (lazy) state.sellDataOffset = offset;
          break;
        default:
          state.orderBookDataBuy = data.filter(order => order.id_type === 1);
          state.orderBookDataSell = data.filter(order => order.id_type === 2);
          break;
      }

      if (lazy) {
        if (state.orderBookDataBuy)
          state.orderBookDataBuy = [...this.state.orderBookDataBuy, ...state.orderBookDataBuy];
        if (state.orderBookDataSell)
          state.orderBookDataSell = [...state.orderBookDataSell, ...this.state.orderBookDataSell];
      }

      if (this._mount) {
        this.setState(state);
      }
    } catch (ex) {
      console.warn(ex);
      this.setState({ orderBookLoading: true });
    }
  }

  handleBuyPriceChange(buyPrice) {
    this.props.handleBuyPriceChange(buyPrice);
  }

  handleBuyAmountChange(buyAmount) {
    this.props.handleBuyAmountChange(buyAmount);
  }

  handleBuyTotalChange(buyTotal) {
    this.props.handleBuyTotalChange(buyTotal);
  }

  handleSellPriceChange(sellPrice) {
    this.props.handleSellPriceChange(sellPrice);
  }

  handleSellAmountChange(sellAmount) {
    this.props.handleSellAmountChange(sellAmount);
  }

  handleSellTotalChange(sellTotal) {
    this.props.handleSellTotalChange(sellTotal);
  }

  handleSellFormSubmit() {
    this.props.handleSellFormSubmit();
  }

  handleBuyFormSubmit() {
    this.props.handleBuyFormSubmit();
  }

  render() {
    return (
      <div className="mainContent">
        <div className="container page-exchange">
          <div className="panels dashboard">
            <div className="panels-left">
              <Markets
                authUserData={this.props.authUserData}
                currentPair={this.props.currentPair}
                selectPair={this.props.selectPair}
                language={this.props.language}
                t={this.props.t}
              />
              <Balance
                getBalance={this.props.updateBalances}
                authUserData={this.props.authUserData}
                balances={this.props.balances} 
                language={this.props.language}
                t={this.props.t}
              />
            </div>
            <div className="panels-right leftPadding">
              <CurrentPair
                data={this.state.currencyStats}
                currentPair={this.props.currentPair}
                loading={this.state.currencyStatsLoading}
                language={this.props.language}
                t={this.props.t}
              />
              <Graph
                symbol={
                  this.props.currentPair.listCurrency.short_name +
                  '/' +
                  this.props.currentPair.titleCurrency.short_name
                }
              />
            </div>
          </div>
          <div className="panels">
            <div className="panels-left">
              <OrderBook
                sellPriceDefaultSet={this.props.sellPriceDefaultSet}
                buyPriceDefaultSet={this.props.buyPriceDefaultSet}
                handleSellDefaultSet={this.props.handleSellDefaultSet}
                handleBuyDefaultSet={this.props.handleBuyDefaultSet}
                handleBuyPriceAndAmountChange={this.props.handleBuyPriceAndAmountChange}
                handleSellPriceAndAmountChange={this.props.handleSellPriceAndAmountChange}
                currentPair={this.props.currentPair}
                currencyStats={this.state.currencyStats}
                updateOrderBook={this.updateOrderBook}
                orderBookDataBuy={this.state.orderBookDataBuy}
                orderBookDataSell={this.state.orderBookDataSell}
                loading={this.state.orderBookLoading}
                language={this.props.language}
                t={this.props.t}
              />
            </div>
            <div className="panels-right">
              <div className="panels-right-percents30 leftPadding">
                <Buy
                  updating={this.props.updating}
                  silentUpdate={this.props.silentUpdate}
                  handleBuyFormSubmit={this.handleBuyFormSubmit}
                  buyPrice={this.props.buyPrice}
                  handleBuyPriceChange={this.handleBuyPriceChange}
                  buyAmount={this.props.buyAmount}
                  handleBuyAmountChange={this.handleBuyAmountChange}
                  buyTotal={this.props.buyTotal}
                  buyError={this.props.buyError}
                  handleBuyTotalChange={this.handleBuyTotalChange}
                  handleBuyPriceAndAmountChange={this.props.handleBuyPriceAndAmountChange}
                  handleBuyPriceAndTotalChange={this.props.handleBuyPriceAndTotalChange}
                  // orderBook={this.props.orderBook}
                  orderBookDataBuy={this.state.orderBookDataBuy}
                  currentPair={this.props.currentPair}
                  authUserData={this.props.authUserData}
                  balances={this.props.balances}
                  language={this.props.language}
                  t={this.props.t}
                />
              </div>
              <div className="panels-right-percents30 leftPadding">
                <Sell
                  updating={this.props.updating}
                  silentUpdate={this.props.silentUpdate}
                  handleSellFormSubmit={this.handleSellFormSubmit}
                  handleSellPriceChange={this.handleSellPriceChange}
                  sellPrice={this.props.sellPrice}
                  handleSellAmountChange={this.handleSellAmountChange}
                  sellAmount={this.props.sellAmount}
                  handleSellTotalChange={this.handleSellTotalChange}
                  sellTotal={this.props.sellTotal}
                  sellError={this.props.sellError}
                  handleSellPriceAndAmountChange={this.props.handleSellPriceAndAmountChange}
                  handleSellPriceAndTotalChange={this.props.handleSellPriceAndTotalChange}
                  // orderBook={this.props.orderBook}
                  orderBookDataSell={this.state.orderBookDataSell}
                  currentPair={this.props.currentPair}
                  authUserData={this.props.authUserData}
                  balances={this.props.balances}
                  language={this.props.language}
                  t={this.props.t}
                />
              </div>
              <div className="panels-right-percents40 leftPadding">
                <TradeHistory
                  updating={this.props.updating}
                  silentUpdate={this.props.silentUpdate}
                  currentPair={this.props.currentPair}
                  authUserData={this.props.authUserData}
                  language={this.props.language}
                  t={this.props.t}
                />
              </div>
            </div>
          </div>
          <div className="panels panels_half">
            <div className="panels-left">
              <MarketDepthGraph
                currentPair={this.props.currentPair}
                language={this.props.language}
                t={this.props.t}
              />
            </div>
            <div className="panels-right leftPadding">
              <MyOrders
                silentUpdate={this.props.silentUpdate}
                updating={this.props.updating}
                currentPair={this.props.currentPair}
                authUserData={this.props.authUserData}
                language={this.props.language}
                t={this.props.t}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default exchange;
