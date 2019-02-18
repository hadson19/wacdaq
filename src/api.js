import axios from "axios";
import { API_URL } from "./config";
import qs from "qs";

export default class WacDaqAPI {
  instance = axios.create({
    baseURL: API_URL
  });

  constructor(identity) {
    this.identity = identity;
    this.instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  setIdentity = (identity) => {
    this.identity = identity;
  };

  getIdentity = () => this.identity;

  getAuthData = () =>
    this.instance.get("api/authdata", {
      params: { "access-token": this.identity.uauthkey }
    });

  getPairs = () => this.instance.get("getPairs");

  getCurrencyStats = (params) =>
    this.instance.get("api/currency_stats", { params });

  getBalances = () =>
    this.instance.get("api/balances", { params: this.identity });

  getOrderBook = params =>
    this.instance.get("api/order_book", { params });

  putOrder = data =>
    this.instance.post("my-order", qs.stringify(data), { 
      params: { "access-token": this.identity.uauthkey }
    });
}
