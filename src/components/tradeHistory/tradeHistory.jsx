import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

const OFFSET_COUNT = 100;

class TradeHistoryRow extends Component {
  _mount = false;

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let classes = ['tradeHistory-content-tableBody-row-cell'];

    if (this.props.data.id_type === 1)
      classes.push('tradeHistory-content-tableBody-row-cell_green');
    else classes.push('tradeHistory-content-tableBody-row-cell_red');

    classes = classNames(classes);

    return (
      <div className="tradeHistory-content-tableBody-row">
        <div className="tradeHistory-content-tableBody-row-cell">
          {this.props.data.dt.split(' ')[1].split('.')[0]}
        </div>
        <div className={classes}>
          {this.props.data.id_type === 1
            ? this.props.t[this.props.language].exchangePage.buy
            : this.props.t[this.props.language].exchangePage.sell}
        </div>
        <div className="tradeHistory-content-tableBody-row-cell">
          {parseFloat(this.props.data.price).toFixed(8)}
        </div>
        <div className="tradeHistory-content-tableBody-row-cell">
          {parseFloat(this.props.data.amount_1).toFixed(6)}
        </div>
        <div className="tradeHistory-content-tableBody-row-cell">
          {parseFloat(this.props.data.amount_2).toFixed(6)}
        </div>
      </div>
    );
  }
}

class tradeHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carries: [],
      loading: true,
      tradeHistory: {},
      offset: 0,
      historyInterval: null,
    };

    this.contentWithSlider = React.createRef();
  }

  handleScroll = e => {
    if (e.target.scrollTop === e.target.scrollHeight - e.target.offsetHeight) {
      this.getTransactionHistory(true);
    }
  };

  getTransactionHistory(lazy = false) {

    const { currentPair } = this.props;

    let offset = this.state.offset;
    offset = lazy ? offset + OFFSET_COUNT : offset;

    axios({
      method: 'get',
      url: apiLink + 'api/trade_history',
      params: {
        curr1: currentPair.listCurrency.id,
        curr2: currentPair.titleCurrency.id,
        offset: lazy ? offset : 0,
        limit: lazy ? OFFSET_COUNT : offset + OFFSET_COUNT,
      },
    })
      .then(response => {
        let tradeHistory = response.data;

        if (lazy) {
          tradeHistory = [...tradeHistory, ...this.state.tradeHistory];
        }

        if(this._mount){
          this.setState({ tradeHistory, offset, loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        if(this._mount){
          this.setState({ loading: true });
        }
      });
  }

  componentDidMount() {
    this._mount = true;

    this.getTransactionHistory();
    
    this.setState({
      historyInterval: setInterval(() => {
        this.getTransactionHistory();
      }, 3000),
    });
  }

  componentDidUpdate(prevProps) {
    const { currentPair } = this.props;

    if (currentPair.pairId !== prevProps.currentPair.pairId) {
      this.setState({ offset: 0, loading: true }, () => {
        this.getTransactionHistory();
      });
    }
  }

  componentWillUnmount() {
    this._mount = false;
    clearInterval(this.state.historyInterval);
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
          case 'date':
            if (a.dt > b.dt) {
              comparison = 1;
            } else if (b.dt > a.dt) {
              comparison = -1;
            }

            if (a.id > b.id) {
              comparison = 1;
            } else if (b.id > a.id) {
              comparison = -1;
            }

            return comparison;

          case 'price':
            if (parseFloat(a.price) > parseFloat(b.price)) {
              comparison = 1;
            } else if (parseFloat(b.price) > parseFloat(a.price)) {
              comparison = -1;
            }

            return comparison;

          case 'type':
            if (a.id_type > b.id_type) {
              comparison = 1;
            } else if (b.id_type > a.id_type) {
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
            if (a.dt < b.dt) {
              comparison = 1;
            } else if (b.dt < a.dt) {
              comparison = -1;
            }

            if (a.id < b.id) {
              comparison = 1;
            } else if (b.id < a.id) {
              comparison = -1;
            }

            return comparison;
        }
      }.bind(this)
    );

    if (this.state.sortByDirection === 'desc') data.reverse();

    return data;
  }

  render() {
    // let tradeHistoryData = this.props.tradeHistory;
    const { loading } = this.state;

    let tradeHistoryData = this.state.tradeHistory;

    tradeHistoryData = this.sortData(tradeHistoryData);

    let classes = ['tradeHistory', 'b-excnange'];

    classes = classNames(classes);

    if (loading) {
      return (
        <div className={classes}>
          <div className="tradeHistory-title b-excnange__title">
            {this.props.t[this.props.language].exchangePage.titleTradeHistory}
          </div>
          <div className="website website_loading module-loader module-loader" />
        </div>
      );
    } 
    
    return (
      <div className={classes}>
        <div className="tradeHistory-title b-excnange__title">
          {this.props.t[this.props.language].exchangePage.titleTradeHistory}
        </div>
        <React.Fragment>
          <div className="tradeHistory-content" onScroll={this.handleScroll}>
            <div className="tradeHistory-content-tableHead">
              <div
                onClick={() => this.setSortBy('date')}
                className="tradeHistory-content-tableHead-cell"
              >
                {this.props.t[this.props.language].exchangePage.date}
                {this.state.sortBy === 'date' && this.state.sortByDirection === 'asc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort" />
                )}
                {this.state.sortBy === 'date' && this.state.sortByDirection === 'desc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort tradeHistory-content-tableHead-cell-sort_desc" />
                )}
              </div>
              <div
                onClick={() => this.setSortBy('type')}
                className="tradeHistory-content-tableHead-cell"
              >
                {this.props.t[this.props.language].exchangePage.type}
                {this.state.sortBy === 'type' && this.state.sortByDirection === 'asc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort" />
                )}
                {this.state.sortBy === 'type' && this.state.sortByDirection === 'desc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort tradeHistory-content-tableHead-cell-sort_desc" />
                )}
              </div>
              <div
                onClick={() => this.setSortBy('price')}
                className="tradeHistory-content-tableHead-cell"
              >
                {this.props.t[this.props.language].exchangePage.price}
                {this.state.sortBy === 'price' && this.state.sortByDirection === 'asc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort" />
                )}
                {this.state.sortBy === 'price' && this.state.sortByDirection === 'desc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort tradeHistory-content-tableHead-cell-sort_desc" />
                )}
              </div>
              <div
                onClick={() => this.setSortBy('amount_1')}
                className="tradeHistory-content-tableHead-cell"
              >
                {this.props.t[this.props.language].exchangePage.amount} (
                {this.props.currentPair.listCurrency.short_name})
                {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'asc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort" />
                )}
                {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'desc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort tradeHistory-content-tableHead-cell-sort_desc" />
                )}
              </div>
              <div
                onClick={() => this.setSortBy('amount_2')}
                className="tradeHistory-content-tableHead-cell"
              >
                {this.props.t[this.props.language].exchangePage.amount} (
                {this.props.currentPair.titleCurrency.short_name})
                {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'asc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort" />
                )}
                {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'desc' && (
                  <div className="tradeHistory-content-tableHead-cell-sort tradeHistory-content-tableHead-cell-sort_desc" />
                )}
              </div>
            </div>
            <div className="b-tradehistory__content">
              {tradeHistoryData.map((tradeHistoryRow, index) => (
                <TradeHistoryRow
                  key={index}
                  data={tradeHistoryRow}
                  language={this.props.language}
                  t={this.props.t}
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default tradeHistory;
