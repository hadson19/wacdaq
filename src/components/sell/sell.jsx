import React, { Component } from 'react'
import classNames from 'classnames'

class sell extends Component {
	constructor(props) {
        super(props);
		this.state = {
		};		
                 
        this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
        this.handleSellAmountChange = this.handleSellAmountChange.bind(this);
        this.handleSellTotalChange = this.handleSellTotalChange.bind(this);
        this.handleSellFormSubmit = this.handleSellFormSubmit.bind(this);
	}
	
	componentDidMount() {		
	}
    
    handleSellPriceChange(event) {
        this.props.handleSellPriceChange(event.target.value);
    }
    
    handleSellAmountChange(event) {
        this.props.handleSellAmountChange(event.target.value);
    }
    
    handleSellTotalChange(event) {
        this.props.handleSellTotalChange(event.target.value);
    }
    
    handleSellFormSubmit(e) {
        e.preventDefault();
        
        this.props.handleSellFormSubmit();
    }
    
    filterFloat(value) {
        if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    }

    showError() {
        if (this.props.sellError) {
            if (this.props.sellError.status === 401) {
                return "You must be authorized";
            } else {
                switch (this.props.sellError.msg) {                        
                    case "min_limit":
                        return "Min value for order is 0.0001 BTC";                    
                    case "invalid_pair":
                        return "Invalid pair";
                    case "ins_funds":
                        return "Insufficient funds";
                    case "bad_input":
                    default:
                        return "Incorrect input data";
                }
            }
        }
    }
	
	render() {
        let balances = this.props.balances.filter(row => row.currency.id === this.props.currentPair.titleCurrency.id);
        
        let balance = 0;

        if (balances.length && typeof(balances[0].freeVolume))
            balance = balances[0].freeVolume;
        
        // if (typeof(balance[0].freeVolume))
        if (balance.length && typeof (balance[0].freeVolume))
            balance = balance[0].freeVolume;
        else
            balance = 0;
        
        const orderBookDataHighest = this.props.orderBookDataSell.reduce((prev, current) => {
            return parseFloat(prev.price) > current.price ? prev : current;
        }, {});

        let orderBookPrice = 0;

        if (orderBookDataHighest.price)
            orderBookPrice = parseFloat(orderBookDataHighest.price).toFixed(8);
            
        let classes = ['buyAndSell', 'buyAndSell_sell', 'b-excnange'];

        if (this.props.updating && !this.props.silentUpdate)
            classes.push('buyAndSell_loading');

		classes = classNames(classes);
        
        let submitClasses = ['buyAndSell-submit'];
               
	    return <div className={classes}>
            <div className="buyAndSell-title b-excnange__title">
                {this.props.t[this.props.language].exchangePage.sell} {this.props.currentPair.listCurrency.short_name}
            </div>
            {(!this.props.updating || this.props.silentUpdate) &&
                (
                <React.Fragment>
                    <form onSubmit={this.handleSellFormSubmit}>
                        <div className="buyAndSell-information">
                            <div className="buyAndSell-information-item">
                                <div className="buyAndSell-information-item-label">
                                    {this.props.t[this.props.language].exchangePage.youHave}
                                </div>
                                <div className="buyAndSell-information-item-value">
                                    <span onClick={() => this.props.handleSellPriceAndAmountChange(parseFloat(orderBookPrice).toFixed(8), parseFloat(balance).toFixed(8))}>{parseFloat(balance).toFixed(6)}</span> {this.props.currentPair.listCurrency.short_name}
                                </div>
                            </div>
                            <div className="buyAndSell-information-item">
                                <div className="buyAndSell-information-item-label">
                                    {this.props.t[this.props.language].exchangePage.highestBid}
                                </div>
                                <div className="buyAndSell-information-item-value">
                                    <span onClick={() => this.props.handleSellPriceChange(parseFloat(orderBookPrice).toFixed(8))}>{parseFloat(orderBookPrice).toFixed(8)}</span> {this.props.currentPair.titleCurrency.short_name}
                                </div>
                            </div>
                        </div>
                        <div className="buyAndSell-form">
                            <div className="buyAndSell-form-field">
                                <div className="buyAndSell-form-field-label">
                                    {this.props.t[this.props.language].exchangePage.price}:
                                </div>
                                <div className="buyAndSell-form-field-input">
                                    <input type="text" value={this.props.sellPrice} onChange={this.handleSellPriceChange} />
                                    <div className="buyAndSell-form-field-input-unit">
                                        {this.props.currentPair.titleCurrency.short_name}
                                    </div>
                                </div>
                            </div>
                            <div className="buyAndSell-form-field">
                                <div className="buyAndSell-form-field-label">
                                    {this.props.t[this.props.language].exchangePage.amount}:
                                </div>
                                <div className="buyAndSell-form-field-input">
                                    <input type="text" value={this.props.sellAmount} onChange={this.handleSellAmountChange} />
                                    <div className="buyAndSell-form-field-input-unit">
                                        {this.props.currentPair.listCurrency.short_name}
                                    </div>
                                </div>
                            </div>
                            <div className="buyAndSell-form-field">
                                <div className="buyAndSell-form-field-label">
                                    {this.props.t[this.props.language].exchangePage.total}:
                                </div>
                                <div className="buyAndSell-form-field-input">
                                    <input type="text" value={this.props.sellTotal} onChange={this.handleSellTotalChange} />
                                    <div className="buyAndSell-form-field-input-unit">
                                        {this.props.currentPair.titleCurrency.short_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="buyAndSell-fee">
                            {this.props.t[this.props.language].exchangePage.fee} {this.props.authUserData.comission.percentage}%
                        </div>
                        <div className="error-block">
                            {this.showError()}
                        </div>
                        <div onClick={this.handleSellFormSubmit} className={submitClasses}>
                            {this.props.t[this.props.language].exchangePage.sell}
                        </div>                        
                    </form>
                </React.Fragment>
                )
            }
        </div>;
	}
}

export default sell;