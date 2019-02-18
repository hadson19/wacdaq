import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Cookies from 'universal-cookie';
import axios from 'axios';
import qs from 'qs';
import apiLink from '../pagesRouter/environment';

const cookies = new Cookies();

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  deleteOrder(order_id) {
    this.props.deleteOrder(order_id);
  }

  render() {
    let classes = ['myOrders-content-tableBody-row-cell'];

    if (this.props.order.id_type === 1) classes.push('myOrders-content-tableBody-row-cell_green');
    else classes.push('myOrders-content-tableBody-row-cell_red');

    classes = classNames(classes);

    return (
      <div className="myOrders-content-tableBody-row">
        <div className="myOrders-content-tableBody-row-cell">
          {this.props.order.dt.split('.')[0]}
          {/* { this.props.order.dt.split(" ")[1].split(".")[0] } */}
        </div>
        <div className={classes}>
          {this.props.order.id_type === 1
            ? this.props.t[this.props.language].exchangePage.buy
            : this.props.t[this.props.language].exchangePage.sell}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {parseFloat(this.props.order.price).toFixed(8)}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {parseFloat(this.props.order.amount_1).toFixed(6)}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {parseFloat(this.props.order.amount_2).toFixed(6)}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {this.props.order.originalamount_1
            ? parseFloat(this.props.order.originalamount_1).toFixed(6)
            : '-'}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {this.props.order.originalamount_1
            ? parseFloat(this.props.order.originalamount_2).toFixed(6)
            : '-'}
        </div>
        <div className="myOrders-content-tableBody-row-cell">
          {this.props.switcherPosition === 'active' ? (
            <div
              className="myOrders-content-tableBody-row-cell-button"
              onClick={() => this.deleteOrder(this.props.order.id)}
            >
              {this.props.t[this.props.language].exchangePage.cancel}
            </div>
          ) : this.props.order.id_status === 1 ? (
            'Active'
          ) : this.props.order.id_status === 2 ? (
            'Done'
          ) : (
            'Cancelled'
          )}
        </div>
      </div>
    );
  }
}

class myOrders extends Component {
  _mount = false;
  constructor(props) {
    super(props);

    this.state = {
      switcherPosition: 'active',
      myOrders: {},
      myOrderInterval: null,
    };

    this.contentWithSlider = React.createRef();
    this.setSwitcherPosition = this.setSwitcherPosition.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);

    this.getMyOrders(
      this.props.currentPair.titleCurrency.id,
      this.props.currentPair.listCurrency.id
    );
  }

  getMyOrders(cur2, cur1) {
    let $auth_key = cookies.get('userAuthKey');
    let $user_id = cookies.get('user_id');

    if ($auth_key && $user_id !== 'null') {
      axios({
        method: 'post',
        url: apiLink + 'api/my_orders',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          curr1: cur1,
          curr2: cur2,
          uid: $user_id,
          uauthkey: $auth_key,
        }),
      })
        .then(response => {
          if (this._mount) {
            this.setState({
              myOrders: response.data,
            });
          }
        })
        .catch(error => {
          // console.log(error);
        });
    }
  }

  componentDidMount() {
    this._mount = true;
    this.setState({
      myOrderInterval: setInterval(() => {
        this.getMyOrders(
          this.props.currentPair.titleCurrency.id,
          this.props.currentPair.listCurrency.id
        );
      }, 1000),
    });
  }

  componentWillUnmount() {
    this._mount = false;
    clearInterval(this.state.myOrderInterval);
  }

  deleteOrder(order_id) {
    let userAuthKey = cookies.get('userAuthKey');
    let params = {};

    if (typeof userAuthKey !== 'undefined' && userAuthKey) params['access-token'] = userAuthKey;

    axios({
      method: 'PUT',
      url: apiLink + 'my-order/' + order_id,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({ id_status: 3 }),
      params: params,
    })
      .then(response => {
        let updatedMyOrder = response.data;
        let myOrders = this.state.myOrders;

        for (let i = 0; i < Object.keys(myOrders).length; i++) {
          if (myOrders[Object.keys(myOrders)[i]].id === updatedMyOrder.id) {
            myOrders[Object.keys(myOrders)[i]].id_status = updatedMyOrder.id_status;
          }
        }

        this.setState({ myOrders });
      })
      .catch(function(error) {});
  }

  setSwitcherPosition(position) {
    this.setState({
      switcherPosition: position,
    });
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

            return comparison;

          case 'type':
            if (a.id_type > b.id_type) {
              comparison = 1;
            } else if (b.id_type > a.id_type) {
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

          case 'amount_1':
            if (parseFloat(a.amount_1) > parseFloat(b.amount_1)) {
              comparison = 1;
            } else if (parseFloat(b.amount_1) > parseFloat(a.amount_1)) {
              comparison = -1;
            }

            return comparison;

          case 'amount_2':
            if (parseFloat(a.amount_2) > parseFloat(b.amount_2)) {
              comparison = 1;
            } else if (parseFloat(b.amount_2) > parseFloat(a.amount_2)) {
              comparison = -1;
            }

            return comparison;

          case 'originalamount_1':
            if (parseFloat(a.originalamount_1) > parseFloat(b.originalamount_1)) {
              comparison = 1;
            } else if (parseFloat(b.originalamount_1) > parseFloat(a.originalamount_1)) {
              comparison = -1;
            }

            return comparison;

          case 'originalAamount_2':
            if (parseFloat(a.originalamount_2) > parseFloat(b.originalamount_2)) {
              comparison = 1;
            } else if (parseFloat(b.originalamount_2) > parseFloat(a.originalamount_2)) {
              comparison = -1;
            }

            return comparison;

          case 'status':
            if (a.id_status > b.id_status) {
              comparison = 1;
            } else if (b.id_status > a.id_status) {
              comparison = -1;
            }

            return comparison;

          default:
            if (a.dt < b.dt) {
              comparison = 1;
            } else if (b.dt < a.dt) {
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
    let classes = ['myOrders', 'b-excnange'];

    if (this.props.updating && !this.props.silentUpdate) classes.push('myOrders_loading');

    classes = classNames(classes);

    let myOrders = this.state.myOrders;

    myOrders = Object.values(myOrders);

    if (this.state.switcherPosition === 'active')
      myOrders = myOrders.filter(row => row.id_status === 1);

    myOrders = this.sortData(myOrders);

    return (
      <div className={classes}>
        <div className="myOrders-title b-excnange__title">
          {this.props.t[this.props.language].exchangePage.titleMyOrders}
          {this.props.authUserData &&
            this.props.authUserData.authorized &&
            (!this.props.updating || this.props.silentUpdate) && (
              <React.Fragment>
                <div className="myOrders-switcher">
                  {this.state.switcherPosition === 'active' ? (
                    <React.Fragment>
                      <div
                        onClick={() => this.setSwitcherPosition('active')}
                        className="myOrders-switcher-item myOrders-switcher-item_active"
                      >
                        {this.props.t[this.props.language].exchangePage.active}
                      </div>
                      <div
                        onClick={() => this.setSwitcherPosition('all')}
                        className="myOrders-switcher-item"
                      >
                        {this.props.t[this.props.language].exchangePage.all}
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div
                        onClick={() => this.setSwitcherPosition('active')}
                        className="myOrders-switcher-item"
                      >
                        {this.props.t[this.props.language].exchangePage.active}
                      </div>
                      <div
                        onClick={() => this.setSwitcherPosition('all')}
                        className="myOrders-switcher-item myOrders-switcher-item_active"
                      >
                        {this.props.t[this.props.language].exchangePage.all}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
        </div>
        {!this.props.authUserData.authorized && (
          <React.Fragment>
            <div className="myOrders-need-auth text-center">
              <Link to="/login" className="btn btn-success">
                {this.props.t[this.props.language].exchangePage.loginRegistration}
              </Link>
            </div>
          </React.Fragment>
        )}
        {this.props.authUserData &&
          this.props.authUserData.authorized &&
          (!this.props.updating || this.props.silentUpdate) && (
            <React.Fragment>
              <div className="myOrders-content">
                <div className="myOrders-content-tableHead">
                  <div
                    onClick={() => this.setSortBy('date')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.date}
                    {this.state.sortBy === 'date' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'date' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('type')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.type}
                    {this.state.sortBy === 'type' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'type' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('price')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.price}
                    {this.state.sortBy === 'price' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'price' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('amount_1')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.amount} (
                    {this.props.currentPair.listCurrency.short_name})
                    {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'amount_1' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('amount_2')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.amount} (
                    {this.props.currentPair.titleCurrency.short_name})
                    {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'amount_2' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('originalamount_1')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.originalAmount} (
                    {this.props.currentPair.listCurrency.short_name})
                    {this.state.sortBy === 'originalamount_1' &&
                      this.state.sortByDirection === 'asc' && (
                        <div className="myOrders-content-tableHead-cell-sort" />
                      )}
                    {this.state.sortBy === 'originalamount_1' &&
                      this.state.sortByDirection === 'desc' && (
                        <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                      )}
                  </div>
                  <div
                    onClick={() => this.setSortBy('originalAmount_2')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.originalAmount} (
                    {this.props.currentPair.titleCurrency.short_name})
                    {this.state.sortBy === 'originalamount_2' &&
                      this.state.sortByDirection === 'asc' && (
                        <div className="myOrders-content-tableHead-cell-sort" />
                      )}
                    {this.state.sortBy === 'originalamount_2' &&
                      this.state.sortByDirection === 'desc' && (
                        <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                      )}
                  </div>
                  {/* {this.state.switcherPosition != 'active' && */}
                  <div
                    onClick={() => this.setSortBy('status')}
                    className="myOrders-content-tableHead-cell"
                  >
                    {this.props.t[this.props.language].exchangePage.status}
                    {this.state.sortBy === 'status' && this.state.sortByDirection === 'asc' && (
                      <div className="myOrders-content-tableHead-cell-sort" />
                    )}
                    {this.state.sortBy === 'status' && this.state.sortByDirection === 'desc' && (
                      <div className="myOrders-content-tableHead-cell-sort myOrders-content-tableHead-cell-sort_desc" />
                    )}
                  </div>
                  {/* } */}
                </div>
                {this.state.switcherPosition === 'active' ? (
                  <div className="b-myOrders__content">
                    {myOrders.map((order, index) => {
                      if (order.id_status !== 1) return null;

                      return (
                        <Order
                          key={index}
                          deleteOrder={this.deleteOrder}
                          switcherPosition={this.state.switcherPosition}
                          order={order}
                          language={this.props.language}
                          t={this.props.t}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="b-myOrders__content">
                    {myOrders.map((order, index) => (
                      <Order
                        key={index}
                        deleteOrder={this.deleteOrder}
                        switcherPosition={this.state.switcherPosition}
                        order={order}
                        language={this.props.language}
                        t={this.props.t}
                      />
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
      </div>
    );
  }
}

export default myOrders;
