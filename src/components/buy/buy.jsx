import React, { Component } from 'react'
import classNames from 'classnames';

class buy extends Component {
	constructor(props) {
        super(props);
        
		this.state = {
		};		
        
        this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
        this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
        this.handleBuyTotalChange = this.handleBuyTotalChange.bind(this);   
        this.handleBuyFormSubmit = this.handleBuyFormSubmit.bind(this);
	}
	
	componentDidMount() {		
	}
    
    handleBuyPriceChange(event) {
        this.props.handleBuyPriceChange(event.target.value);
    }
    
    handleBuyAmountChange(event) {
        this.props.handleBuyAmountChange(event.target.value);
    }
    
    handleBuyTotalChange(event) {
        this.props.handleBuyTotalChange(event.target.value);
    }
    
    handleBuyFormSubmit(e) {
        e.preventDefault();
        
        this.props.handleBuyFormSubmit();
    }
    
    filterFloat(value) {
        if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    }

    showError() {
        if (this.props.buyError) {
            if (this.props.buyError.status === 401) {
                return "You must be authorized";
            } else {
                switch (this.props.buyError.msg) {
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

        const orderBookDataLowest = this.props.orderBookDataBuy.reduce((prev, current) => {
            return parseFloat(prev.price) < current.price ? prev : current;
        }, []);

        let orderBookPrice = 0;

        if (orderBookDataLowest.price)
            orderBookPrice = parseFloat(orderBookDataLowest.price).toFixed(8);
            
        let classes = ['buyAndSell b-excnange'];

        if (this.props.updating && !this.props.silentUpdate)
            classes.push('buyAndSell_loading');

		classes = classNames(classes);
        
        let submitClasses = ['buyAndSell-submit'];
        
        return <div className={classes}>
            <div className="buyAndSell-title b-excnange__title">
                {this.props.t[this.props.language].exchangePage.buy} {this.props.currentPair.listCurrency.short_name}
            </div>
            {(!this.props.updating || this.props.silentUpdate) &&
                (
                <React.Fragment>
                    <form onSubmit={this.handleBuyFormSubmit}>
                        <div className="buyAndSell-information">
                            <div className="buyAndSell-information-item">
                                <div className="buyAndSell-information-item-label">
                                    {this.props.t[this.props.language].exchangePage.youHave}
                                </div>
                                <div className="buyAndSell-information-item-value">
                                    <span onClick={() => this.props.handleBuyPriceAndTotalChange(parseFloat(orderBookPrice).toFixed(8), parseFloat(balance).toFixed(8))}>{parseFloat(balance).toFixed(6)}</span> {this.props.currentPair.titleCurrency.short_name}
                                </div>
                            </div>
                            <div className="buyAndSell-information-item">
                                <div className="buyAndSell-information-item-label">
                                    {this.props.t[this.props.language].exchangePage.lowestAsk}
                                </div>
                                <div className="buyAndSell-information-item-value">
                                    <span onClick={() => this.props.handleBuyPriceChange(parseFloat(orderBookPrice).toFixed(8))}>{parseFloat(orderBookPrice).toFixed(8)}</span> {this.props.currentPair.titleCurrency.short_name}
                                </div>
                            </div>
                        </div>
                        <div className="buyAndSell-form">
                            <div className="buyAndSell-form-field">
                                <div className="buyAndSell-form-field-label">
                                    {this.props.t[this.props.language].exchangePage.price}:
                                </div>
                                <div className="buyAndSell-form-field-input">
                                    <input type="text" value={this.props.buyPrice} onChange={this.handleBuyPriceChange} />
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
                                    <input type="text" value={this.props.buyAmount} onChange={this.handleBuyAmountChange} />
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
                                    <input type="text" value={this.props.buyTotal} onChange={this.handleBuyTotalChange} />
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
                        <div onClick={this.handleBuyFormSubmit} className={submitClasses}>
                            {this.props.t[this.props.language].exchangePage.buy}
                        </div>
                    </form>
                </React.Fragment>
                )
            }
        </div>;
	}
}

export default buy;