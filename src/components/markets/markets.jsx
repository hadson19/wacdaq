import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

class TitleCurrency extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let classes = ['markets-currencies-item'];

    if (this.props.active) classes.push('markets-currencies-item_active');

    classes = classNames(classes);

    return (
      <div onClick={this.props.onClick} className={classes}>
        {this.props.shortName}
      </div>
    );
  }
}

class ListCurrencies extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
  }

  componentDidMount() {
    this.setState({ data: { ...this.props.data } });
  }

  sortData(data) {
    data = Object.values(data);
    data = data.filter(
      row =>
        row.name.toUpperCase().indexOf(this.props.search.toUpperCase()) !== -1 ||
        row.short_name.indexOf(this.props.search.toUpperCase()) !== -1
    );

    data.sort(
      function(a, b) {
        let comparison = 0;

        switch (this.props.sortBy) {
          case 'currency':
            if (a.short_name > b.short_name) {
              comparison = 1;
            } else if (b.short_name > a.short_name) {
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

          case 'volume':
            if (parseFloat(a.volume) > parseFloat(b.volume)) {
              comparison = 1;
            } else if (parseFloat(b.volume) > parseFloat(a.volume)) {
              comparison = -1;
            }

            return comparison;

          case 'change':
            if (parseFloat(a.change) > parseFloat(b.change)) {
              comparison = 1;
            } else if (parseFloat(b.change) > parseFloat(a.change)) {
              comparison = -1;
            }

            return comparison;

          case 'name':
            if (a.name > b.name) {
              comparison = 1;
            } else if (b.name > a.name) {
              comparison = -1;
            }

            return comparison;

          default:
            if (a.id > b.id) {
              comparison = 1;
            } else if (b.id > a.id) {
              comparison = -1;
            }

            return comparison;
        }
      }.bind(this)
    );

    if (this.props.sortByDirection === 'desc') data.reverse();

    return data;
  }

  selectPair(pairId) {
    this.props.selectPair(pairId);
  }


  sendFavoriteStateChange = (pair_id, fav, pid) => {

    const { auth_key, id } = this.props.authUserData;
    axios({
      method: 'get',
      url: apiLink + 'api/triggerfavoritepair',
      params: {
        authkey: auth_key,
        id_user: id,
        id_pair: pair_id,
        fav: fav,
      },
    })
      .then(res => {
        if (res.status === 200) {
          this.setFav(pid, fav);
        }
      })
      .catch(err => {
        if (this._mount) {
          // this.setState({ isFavorite: false }, this.props.getMarkets);
          //console.log('error', err);
        }
      });
  };

  setFav = (pid, fav) => {  

    const temp = this.state.data[pid];
    const _data = { ...this.state.data };
    temp.is_fav = fav;
    _data[pid] = temp;

    this.setState({ data: {} }, ()=>{
      this.setState({data:_data});
    });
  };

  showFavOnly=(data)=>{
    return data.filter(pair =>pair.is_fav===true);
  }

  showAll=(data)=>{
    return data;
  }

  render() {
    let data = this.state.data;
    if (Object.keys(data).length > 0) {
      data = this.sortData(data);
      data = this.props.isShowFav ? this.showFavOnly(data) : this.showAll(data);
    }
    return (
      <React.Fragment>
        {Object.keys(data).map((listCurrencyKey, listCurrencyIndex) => (
          <ListCurrency
            getMarkets={this.props.getMarkets}
            authUserData={this.props.authUserData}
            onClick={() => this.selectPair(data[listCurrencyKey].pair_id)}
            active={data[listCurrencyKey].pair_id === this.props.currentPair.pairId}
            pair={data[listCurrencyKey]}
            key={listCurrencyIndex}
            setFav={this.sendFavoriteStateChange}
            listCurrencyKey={listCurrencyKey}
          />
        ))}
      </React.Fragment>
    );
  }
}

class ListCurrency extends Component {
  _mount = false;
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: false,
    };
    this.timehash = Date.now();
  }

  componentDidMount() {
    this._mount = true;
    // this.setState({ isFavorite: !!this.props.pair.is_fav });
  }

  componentWillUnmount() {
    this._mount = false;
  }

  onOnlyFavoriteClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setFav(this.props.pair.pair_id, !this.props.pair.is_fav, this.props.pair.id);
    // this.sendFavoriteStateChange();
  };

  

  render() {
    let favoriteicon = this.props.pair.is_fav ? (
      <i className="fas fa-star" />
    ) : (
      <i className="far fa-star" />
    );

    let changeClasses = ['markets-content-tableBody-row-cell'];

    if (this.props.pair.change > 0) changeClasses.push('markets-content-tableBody-row-cell_green');
    else if (this.props.pair.change < 0)
      changeClasses.push('markets-content-tableBody-row-cell_red');

    changeClasses = classNames(changeClasses);

    let classes = ['markets-content-tableBody-row', 'markets-row'];

    if (this.props.active) classes.push('markets-content-tableBody-row_active');

    classes = classNames(classes);

    return (
      <div onClick={this.props.onClick} className={classes}>
        <div
          className="markets-content-tableBody-row-cell favorite"
          onClick={this.onOnlyFavoriteClick}
        >
          {favoriteicon}
        </div>
        <div className=" markets-content-tableBody-row-cell tooltip">
          {/*<img
            src={
              '/static/images/coins_logo/16x16_' +
              this.props.pair.short_name +
              '.png?' +
              this.timehash
            }
            alt=""
          />*/}
          {this.props.pair.short_name}
          <span className="tooltiptext">{this.props.pair.name}</span>
        </div>
        <div className="markets-content-tableBody-row-cell">
          {parseFloat(this.props.pair.price).toFixed(8)}
        </div>
        <div className="markets-content-tableBody-row-cell">
          {parseFloat(this.props.pair.volume).toFixed(2)}
        </div>
        <div className={changeClasses}>
          {(this.props.pair.change > 0 ? '+' : '') + parseFloat(this.props.pair.change).toFixed(2)}%
        </div>
        {/*<div className="markets-content-tableBody-row-cell">{this.props.pair.name}</div>*/}
      </div>
    );
  }
}

class markets extends Component {
  _mount = false;
  constructor(props) {
    super(props);
    this.state = {
      marketsLoaded: false,
      search: '',
      currentTitleCurrencyShortName: this.props.currentPair.titleCurrency.short_name,
      sortBy: false,
      sortByDirection: false,
      markets: {},
      marketsTimeout: null,
      onlyFavorite: true,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.selectPair = this.selectPair.bind(this);
    this.contentWithSlider = React.createRef();

    this.getMarkets();
  }

  componentDidMount() {
    this._mount = true;
/*
    this.setState({
      marketsTimeout: setTimeout(() => {
        this.getMarkets();
      }, 10000),
    });
  */
  }

  setTimer=()=>{
    this.setState({
      marketsTimeout: setTimeout(() => {
        this.getMarkets();
      }, 10000),
    });
  }

  componentWillUnmount() {
    this._mount = false;
    clearTimeout(this.state.marketsInterval);
  }

  getMarkets = (all = true, force=false) => {
    if(this.state.marketsTimeout){
      clearTimeout(this.state.marketsTimeout);
    }
    
    const params = {};
    if (this.props.authUserData.authorized) {
      const { auth_key, id } = this.props.authUserData;
      params.uauthkey = auth_key;
      params.uid = id;
      if (!all) {
        params.favonly = this.state.onlyFavorite;
      }
    }

    axios({
      method: 'get',
      url: apiLink + 'api/markets',
      params: params,
    })
      .then(response => {
        if (this._mount) {
          const data = response.data;
          this.setState({markets:{}}, ()=>{this.updateMarket({ markets: data, marketsLoaded: true })});
        }
      })
      .catch(error => {
        // console.log(error);
        if (this._mount) {
          this.setState({ marketsLoaded: false });
        }
      });
  };

  updateMarket = _state => {
    this.setState({ ..._state }, this.setTimer);
  };

  selectPair(pairId) {
    this.props.selectPair(pairId);
  }

  updateMarketsData(currentTitleCurrencyShortName) {
    this.setState({ currentTitleCurrencyShortName }, () => {
      if (this.contentWithSlider.current) this.contentWithSlider.current.reset();
    });
  }

  handleSearchChange(event) {
    this.setState({ search: event.target.value });
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

  onOnlyFavoriteClick = () => {
    this.setState({ onlyFavorite: !this.state.onlyFavorite });
   
  };

 

  render() {
    const { marketsLoaded, onlyFavorite } = this.state;
    const { currentPair } = this.props;
    let markets = this.state.markets;
    /*
    if (onlyFavorite){
      markets = this.filterMarket(markets);
    }
*/

    const favoriteicon = onlyFavorite ? (
      <i className="fas fa-star" />
    ) : (
      <i className="far fa-star" />
    );

    if (!marketsLoaded) {
      return (
        <div className="markets b-excnange">
          <div className="markets-title b-excnange__title">
            {this.props.t[this.props.language].exchangePage.titleMarkets}
          </div>
          <div className="website website_loading module-loader module-loader" />
        </div>
      );
    } else {
      return (
        <div className="markets b-excnange">
          <div className="markets-title b-excnange__title">
            {this.props.t[this.props.language].exchangePage.titleMarkets}
          </div>
          <React.Fragment>
            <div className="markets-currencies">
              {Object.keys(markets).map((key, index) => (
                <TitleCurrency
                  onClick={() => this.updateMarketsData(key)}
                  active={key === this.state.currentTitleCurrencyShortName}
                  shortName={key}
                  key={index}
                />
              ))}
            </div>
            <div className="markets-search">
              <input
                type="text"
                value={this.state.search}
                onChange={this.handleSearchChange}
                placeholder={this.props.t[this.props.language].exchangePage.search}
              />
            </div>
            <div className="markets-content">
            <div id="header-tbody">
              <div className="markets-content-tableHead">
                <div
                  onClick={this.onOnlyFavoriteClick}
                  className="markets-content-tableHead-cell favorite"
                >
                  {favoriteicon}
                </div>
                <div
                  onClick={() => this.setSortBy('currency')}
                  className="markets-content-tableHead-cell"
                >
                  {this.props.t[this.props.language].exchangePage.currency}
                  {this.state.sortBy === 'currency' && this.state.sortByDirection === 'asc' && (
                    <div className="markets-content-tableHead-cell-sort" />
                  )}
                  {this.state.sortBy === 'currency' && this.state.sortByDirection === 'desc' && (
                    <div className="markets-content-tableHead-cell-sort markets-content-tableHead-cell-sort_desc" />
                  )}
                </div>
                <div
                  onClick={() => this.setSortBy('price')}
                  className="markets-content-tableHead-cell"
                >
                  {this.props.t[this.props.language].exchangePage.price}
                  {this.state.sortBy === 'price' && this.state.sortByDirection === 'asc' && (
                    <div className="markets-content-tableHead-cell-sort" />
                  )}
                  {this.state.sortBy === 'price' && this.state.sortByDirection === 'desc' && (
                    <div className="markets-content-tableHead-cell-sort markets-content-tableHead-cell-sort_desc" />
                  )}
                </div>
                <div
                  onClick={() => this.setSortBy('volume')}
                  className="markets-content-tableHead-cell"
                >
                  {this.props.t[this.props.language].exchangePage.volume}
                  {this.state.sortBy === 'volume' && this.state.sortByDirection === 'asc' && (
                    <div className="markets-content-tableHead-cell-sort" />
                  )}
                  {this.state.sortBy === 'volume' && this.state.sortByDirection === 'desc' && (
                    <div className="markets-content-tableHead-cell-sort markets-content-tableHead-cell-sort_desc" />
                  )}
                </div>
                <div
                  onClick={() => this.setSortBy('change')}
                  className="markets-content-tableHead-cell"
                >
                  {this.props.t[this.props.language].exchangePage.change}
                  {this.state.sortBy === 'change' && this.state.sortByDirection === 'asc' && (
                    <div className="markets-content-tableHead-cell-sort" />
                  )}
                  {this.state.sortBy === 'change' && this.state.sortByDirection === 'desc' && (
                    <div className="markets-content-tableHead-cell-sort markets-content-tableHead-cell-sort_desc" />
                  )}
                </div>
                {/*<div
                  onClick={() => this.setSortBy('name')}
                  className="markets-content-tableHead-cell"
                >
                  {this.props.t[this.props.language].exchangePage.name}
                  {this.state.sortBy === 'name' && this.state.sortByDirection === 'asc' && (
                    <div className="markets-content-tableHead-cell-sort" />
                  )}
                  {this.state.sortBy === 'name' && this.state.sortByDirection === 'desc' && (
                    <div className="markets-content-tableHead-cell-sort markets-content-tableHead-cell-sort_desc" />
                  )}
                </div>*/}
              </div>
              </div>
              <div className="b-markets__content">
                <div id="table-scroll">
                  <div id="content-tbody">
                {Object.keys(markets).map((key, index) => (
                  <React.Fragment key={index}>
                    {key === this.state.currentTitleCurrencyShortName && (
                      <ListCurrencies
                        isShowFav={this.state.onlyFavorite}
                        getMarkets={this.getMarkets}
                        authUserData={this.props.authUserData}
                        search={this.state.search}
                        selectPair={this.selectPair}
                        currentPair={currentPair}
                        sortBy={this.state.sortBy}
                        sortByDirection={this.state.sortByDirection}
                        data={markets[key]}
                      />
                    )}
                  </React.Fragment>
                ))}
                </div>
              </div>
              </div>
            </div>
          </React.Fragment>
        </div>
      );
    }
  }
}

export default markets;
