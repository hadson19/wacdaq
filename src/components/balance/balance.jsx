import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import apiLink from '../pagesRouter/environment';

class BalanceRow extends Component {
  timehash = Date.now();

  constructor(props) {
    super(props);

    this.state = {
      isFavorite: false,
    };
  }

  componentDidMount() {
    this.setState({ isFavorite: this.props.data.is_fav });
  }

  onOnlyFavoriteClick = () => {
    const { isFavorite } = this.state;
    this.setState({ isFavorite: !isFavorite }, this.sendFavoriteStateChange);
  };

  sendFavoriteStateChange = () => {
    const { isFavorite } = this.state;
    const { auth_key, id } = this.props.authUserData;
    const currency_id = this.props.data.currency.id;
    axios({
      method: 'get',
      url: apiLink + 'api/triggerfavorite',
      params: {
        authkey: auth_key,
        id_user: id,
        id_currency: currency_id,
        fav: isFavorite
      },
    })
      .then(res => {
        if (res.status === 200) {
          this.props.changeFav();
        }
      })
      .catch(err => {
        console.log('error', err);
        this.setState({ isFavorite: false });
      });
  };

  render() {
    const balance = this.props.data;
    const favoriteicon = this.props.data.is_fav ? (
      <i className="fas fa-star" />
    ) : (
        <i className="far fa-star" />
      );
    return (
      <div className="balance-content-tableBody-row">
        <div
          className="balance-content-tableBody-row-cell favorite"
          onClick={this.onOnlyFavoriteClick}
        >
          {favoriteicon}
        </div>
        <div className="balance-content-tableBody-row-cell">
          {/*<img
            src={
              '/static/images/coins_logo/16x16_' +
              balance.currency.short_name +
              '.png?' +
              this.timehash
            }
            alt=""
          />*/}
          {balance.currency.short_name}
          {/*<span class="tooltiptext">{balance.currency.name}</span>*/}
        </div>
        <div className="balance-content-tableBody-row-cell balance-content-tableBody-row-cell_green">
          {parseFloat(balance.balance).toFixed(6)}
        </div>
        <div className="balance-content-tableBody-row-cell">
          {parseFloat(balance.onOrders).toFixed(6)}
        </div>
        <div className="balance-content-tableBody-row-cell">{balance.currency.name}</div>
      </div>
    );
  }
}

class balance extends Component {
  _mount = false;

  constructor(props) {
    super(props);

    this.state = {
      onlyFavorite: true,
      // favs: []
    };

    this.contentWithSlider = React.createRef();
    this.sortData = this.sortData.bind(this);
  }

  componentDidMount() {

    this._mount = true;
    /*
    const { balance, balanceLoaded } = this.props;
    if (balanceLoaded) {
      const favs = balance.map(entity => entity.currency.id);
      this.setState({ favs: favs });
    }
    */
  }

  componentWillUnmount() {
    this._mount = false;
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
      function (a, b) {
        let comparison = 0;

        switch (this.state.sortBy) {
          case 'currency':
            if (a.currency.short_name > b.currency.short_name) {
              comparison = 1;
            } else if (b.currency.short_name > a.currency.short_name) {
              comparison = -1;
            }

            return comparison;

          case 'name':
            if (a.currency.name > b.currency.name) {
              comparison = 1;
            } else if (b.currency.name > a.currency.name) {
              comparison = -1;
            }

            return comparison;

          default:
            return comparison;
        }
      }.bind(this)
    );

    if (this.state.sortByDirection === 'desc') data.reverse();

    return data;
  }


  changeCurrencyFavoriteState = (currency_id) => {
    this.props.getBalance();
    /*
    const { favs } = this.state;
    favs.puch(currency_id);
    this.setState({ favs: favs });
    */
  };

  onOnlyFavoriteClick = () => {
    const { onlyFavorite } = this.state;
    this.setState({ onlyFavorite: !onlyFavorite });
  };

  refresh = () => {
    this.setState({ refresh: !this.state.refresh })
  }

  render() {
    const { onlyFavorite, favs } = this.state;
    const favoriteicon = onlyFavorite ? (
      <i className="fas fa-star" />
    ) : (
        <i className="far fa-star" />
      );
    let $silentUpdate = this.props.silentUpdate;
    let $updatingUser = this.props.updatingUser;
    let balances = this.props.balances||[];


    if(balances){
      balances = this.sortData(balances);
      balances = onlyFavorite ? balances.filter(entity => { return entity.is_fav === true; }) : balances;
    }
    
    let classes = ['balance b-excnange'];

    if ($updatingUser && !$silentUpdate) {
      classes.push('balance_loading');
    }

    classes = classNames(classes);

    return (
      <div className={classes}>
        <div className="balance-title b-excnange__title">
          {this.props.t[this.props.language].exchangePage.balance}
        </div>

        {!this.props.authUserData.authorized && (!this.props.updating || this.props.silentUpdate) && (
          <React.Fragment>
            <div className="text-center">
              <Link to="/login" className="btn btn-success">
                {this.props.t[this.props.language].exchangePage.loginRegistration}
              </Link>
            </div>
          </React.Fragment>
        )}

        {(!this.props.updatingUser || this.props.silentUpdate) &&
          this.props.authUserData &&
          this.props.authUserData.authorized &&
          (!this.props.updating || this.props.silentUpdate) &&
          !this.props.balances && (
            <div className="website website_loading module-loader module-loader" />
          )}

        {(!this.props.updatingUser || this.props.silentUpdate) &&
          this.props.authUserData &&
          this.props.authUserData.authorized &&
          (!this.props.updating || this.props.silentUpdate) && (
            <div className="balance-content">
              <div id="header-tbody">
                <div className="balance-content-tableHead">
                  <div
                    onClick={this.onOnlyFavoriteClick}
                    className="balance-content-tableHead-cell favorite"
                  >
                    {favoriteicon}
                  </div>
                  <div
                    onClick={() => this.setSortBy('currency')}
                    className="balance-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.currency}
                    {this.state.sortBy === 'currency' && this.state.sortByDirection === 'asc' && (
                      <div className="balance-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'currency' && this.state.sortByDirection === 'desc' && (
                      <div className="balance-content-tableHead-cell-sort balance-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('amount')}
                    className="balance-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.amount}
                    {this.state.sortBy === 'amount' && this.state.sortByDirection === 'asc' && (
                      <div className="balance-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'amount' && this.state.sortByDirection === 'desc' && (
                      <div className="balance-content-tableHead-cell-sort balance-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  {/*  */}
                  <div
                    onClick={() => this.setSortBy('name')}
                    className="balance-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.onOrders}
                    {this.state.sortBy === 'name' && this.state.sortByDirection === 'asc' && (
                      <div className="balance-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'name' && this.state.sortByDirection === 'desc' && (
                      <div className="balance-content-tableHead-cell-sort balance-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  {/*  */}
                  <div
                    onClick={() => this.setSortBy('name')}
                    className="balance-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.name}
                    {this.state.sortBy === 'name' && this.state.sortByDirection === 'asc' && (
                      <div className="balance-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'name' && this.state.sortByDirection === 'desc' && (
                      <div className="balance-content-tableHead-cell-sort balance-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                </div>
              </div>
              <div className="b-balance__content">
                {Object.keys(balances).map((key, index) => (
                  <BalanceRow
                    refresh={this.refresh}
                    authUserData={this.props.authUserData}
                    data={balances[key]}
                    key={index}
                    changeFav={this.changeCurrencyFavoriteState}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default balance;
