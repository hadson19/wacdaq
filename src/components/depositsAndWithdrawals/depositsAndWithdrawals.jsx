import React, { Component, Fragment } from 'react'
import classNames from 'classnames';
import { Redirect } from 'react-router';
import axios from 'axios';
import qs from 'qs';
import apiLink from '../pagesRouter/environment';
import ConfirmWithdrawal from './confirmWithdrawal';

class DepositsAndWithdrawalsRow extends Component {
    constructor(props) {
        super(props);

		this.state = {
            depositSelected: false,
            withdrawalSelected: false,
            address: '',
            amount: '',
            total: 0.00000000,
            formActive: false,
            key:props.indx,
            twofactor: props.authUserData['2fa'] || false
        };
        
        this.handleSelectDeposit = this.handleSelectDeposit.bind(this);
        this.handleSelectWithdrawal = this.handleSelectWithdrawal.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);        
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.inputOnFocus = this.inputOnFocus.bind(this);

        this.handleGetBalance = this.handleGetBalance.bind(this);
    }
    
    componentDidMount() {
        // this.props.getBalance(false);
    }

    componentDidUpdate(pp, ps){    
        const {popupKey, popupResult} = this.props;
        const {key} = this.state;
        if (popupKey === key && popupResult){
            this.sendWithdrawal();
        }
    }

    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    handleGetBalance() {
        this.props.getBalance();
    }
    
    handleSelectDeposit() {        
        this.setState({
            depositSelected: !this.state.depositSelected,
            withdrawalSelected: false
        });
    }
    
    handleSelectWithdrawal() {
        this.setState({
            depositSelected: false,
            withdrawalSelected: !this.state.withdrawalSelected
        });
    }

    validateWithdrawal = () => {
        const {amount, address} = this.state;
        const {data} = this.props;
        const freeVolume = parseFloat(data.freeVolume);
        const fee = parseFloat(data.currency.fee);
        let total = 0;
        let formActive = false;

        if (address && this.isNumeric(amount) && amount > 0 && amount < freeVolume) {
            total = amount - fee || 0;

            if (total > 0)
                formActive = true;
        }

        this.setState({
            total: total.toFixed(6),
            formActive
        });
    }
    
    handleAddressChange(event) {
        this.setState({address: event.target.value.trim()}, () => {
            this.validateWithdrawal();
        });
        
    }

    handleAmountChange(event) {
        this.setState({amount: event.target.value}, () => {
            this.validateWithdrawal();
        });
        
    }

    inputOnFocus(event) {
        // console.log('focus');
        if (event.target.value === '0') {
            this.setState({
                amount: ''
            });
        }
    }
    
    handleSubmitForm(e) {
        e.preventDefault();
        
        if(this.state.twofactor){
            this.props.popupOpen(this.state.key);
        }else{
            this.sendWithdrawal();         
        }
    }

    sendWithdrawal = ()=>{
        let params = {};

        params['access-token'] = this.props.authUserData.auth_key;
        params['current-pair-id'] = this.props.data.currency.id;

        let { amount, address, formActive } = this.state;

        if (formActive) {
            axios({
                method: 'post',
                url: apiLink + 'withdrawal',
                params,
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({
                    amount: amount,
                    address: address
                }),
            })
                .then(() => {
                    this.handleGetBalance();
                    this.setState({
                        address: '',
                        amount: '',
                        total: 0,
                        formActive: false
                    }, () => {
                        alert('Withdrawal of funds has been sent for processing.');
                    });
                })
                .catch(function (error) {
                    // console.log(error);
                });
        }
    }

    getFreeVolume = () => {
        let freeVolume = this.props.data.freeVolume;
        let result = '';

        freeVolume = freeVolume.toString().split('.');

        result = freeVolume[0];
        if (freeVolume[1]) {
            result += `.${(freeVolume[1] + '000000').substring(0,6)}`;
        } else {
            result += '.000000';
        }
        return result;
    }
	
	render() {
        let depositClasses = ['depositsAndWithdrawals-table-body-row-cell-action'];

        if (this.state.depositSelected)
            depositClasses.push('depositsAndWithdrawals-table-body-row-cell-action_active');

        depositClasses = classNames(depositClasses);
        
        let withdrawalClasses = ['depositsAndWithdrawals-table-body-row-cell-action'];

        if (this.state.withdrawalSelected)
            withdrawalClasses.push('depositsAndWithdrawals-table-body-row-cell-action_active');

        withdrawalClasses = classNames(withdrawalClasses);
        
        let submitClasses = ['depositsAndWithdrawals-form-submit'];
        
        if (!this.state.formActive){
            submitClasses.push('depositsAndWithdrawals-form-submit_disabled');
        }
        
        submitClasses = classNames(submitClasses);
       
        return <React.Fragment>
            <tr className="depositsAndWithdrawals-table-body-row">
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        financeCurrency:
                    </div>    
                    {this.props.data.currency.short_name}
                </td>
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        Name:
                    </div>
                    {this.props.data.currency.name}
                </td>
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        Total Balance:
                    </div>
                    {parseFloat(this.props.data.balance).toFixed(6)}
                </td>
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        On Orders:
                    </div>
                    {parseFloat(this.props.data.onOrders).toFixed(6)}
                </td>
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        Free Volume:
                    </div>
                    {this.getFreeVolume()}
                    {/* {(Math.floor(100*this.props.data.freeVolume)/100).toFixed(6)} */}
                </td>
                <td className="depositsAndWithdrawals-table-body-row-cell">
                    <div className="depositsAndWithdrawals-table-body-row-cell-label">
                        Action:
                    </div>
                    <div onClick={this.handleSelectDeposit} className={depositClasses}>
                        {this.props.t[this.props.language].financePage.deposit}
                    </div>
                    <div onClick={this.handleSelectWithdrawal} className={withdrawalClasses}>
                        {this.props.t[this.props.language].financePage.withdrawal}
                    </div>
                </td>
            </tr>
            {this.state.depositSelected &&
            <tr>
                <td colSpan="6" className="depositsAndWithdrawals-address">
                    <div className="depositsAndWithdrawals-address-title">
                        {this.props.t[this.props.language].financePage.yourFepistAdress}:
                    </div>
                    <div className="depositsAndWithdrawals-address-value">
                        {this.props.data.wallet.address ? this.props.data.wallet.address : <React.Fragment>&nbsp;</React.Fragment>}
                    </div>
                    <div className="depositsAndWithdrawals-address-warning">
                        <span>{this.props.t[this.props.language].financePage.important}</span> 
                        {this.props.t[this.props.language].financePage.importantMessage}
                    </div>
                </td>
            </tr>}
            {this.state.withdrawalSelected &&
            <tr>
                <td colSpan="6" className="depositsAndWithdrawals-form">
                    <form onSubmit={this.handleSubmitForm}>
                        <div className="depositsAndWithdrawals-form-field">
                            <div className="depositsAndWithdrawals-form-field-label">
                                {this.props.t[this.props.language].financePage.adress}:
                            </div>
                            <div className="depositsAndWithdrawals-form-field-input">
                                <input type="text" value={this.state.address} onChange={this.handleAddressChange} />
                            </div>
                        </div>
                        <div className="depositsAndWithdrawals-form-field">
                            <div className="depositsAndWithdrawals-form-field-label">
                                {this.props.t[this.props.language].financePage.amount}:
                            </div>
                            <div className="depositsAndWithdrawals-form-field-input">
                                <input
                                    type="number"
                                    value={this.state.amount}
                                    onFocus={this.inputOnFocus}
                                    onChange={this.handleAmountChange} />
                            </div>
                        </div>
                        <div className="depositsAndWithdrawals-form-field">
                            <div className="depositsAndWithdrawals-form-field-label">
                                {this.props.t[this.props.language].financePage.fee}:
                            </div>
                            <div className="depositsAndWithdrawals-form-field-value">
                                -{parseFloat(this.props.data.currency.fee).toFixed(6)}
                            </div>
                        </div>
                        <div className="depositsAndWithdrawals-form-total">
                            <div className="depositsAndWithdrawals-form-total-label">
                                {this.props.t[this.props.language].financePage.total}:
                            </div>
                            <div className="depositsAndWithdrawals-form-total-value">
                                {this.state.total} {this.props.data.currency.short_name}
                            </div>
                        </div>
                        <div className={submitClasses}>
                            <input
                                type="submit"
                                className={this.state.formActive ? null : 'disabled'}
                                value={this.props.t[this.props.language].financePage.withdrawal}
                                disabled={!this.state.formActive}
                            />                        
                      </div>
                    </form>
                </td>
            </tr>}
        </React.Fragment>;
	}
}

class depositsAndWithdrawals extends Component {
	constructor(props) {
        super(props);

		this.state = {
            popup: false,
            popupKey: -1,
            popupResult: false,
        };

        this.handleGetBalance = this.handleGetBalance.bind(this);

		document.title = this.props.t[this.props.language].projectName + " – Finance";
	}
	
	componentDidMount() {		
    }

    popupOpen = (key,) => {
        this.setState({ popup: true, popupKey: key, popupResult: false});
    }

    popupClose = (status) => {
        console.log(status);
        this.setState({ popup: false, popupResult: status });
    }


    handleGetBalance() {
        this.props.getBalance();
    }
	
    sortData(data) {        
        data = Object.values(data); 
                
        data.sort((a, b) => {                
            let comparison = 0;

            if (parseFloat(a.currency.id) > parseFloat(b.currency.id)) {
                comparison = 1;
            } else if (parseFloat(b.currency.id) > parseFloat(a.currency.id)) {
                comparison = -1;
            }

            return comparison; 
        });
                
        return data;
    }

	render() {	   
        if (!this.props.authUserData || !this.props.authUserData.authorized)
            return <Redirect to="/" />;
            
        let data = this.props.data;
        
        data = this.sortData(data);        
       
        return (
        <Fragment>
        {this.state.popup? <ConfirmWithdrawal closePopup={this.popupClose} cb={this.state.cb} />: null}
        <div className="container page-finance">
            <div className="depositsAndWithdrawals">
                <h1 className="depositsAndWithdrawals-title">
                    {this.props.t[this.props.language].financePage.title}
                </h1>
                <table className="depositsAndWithdrawals-table">
                    <thead className="depositsAndWithdrawals-table-head">
                        <tr className="depositsAndWithdrawals-table-head-row">
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.currency}
                            </th>
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.name}
                            </th>
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.totalBalance}
                            </th>
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.onOrders}
                            </th>
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.freeVolume}
                            </th>
                            <th className="depositsAndWithdrawals-table-head-row-cell">
                                {this.props.t[this.props.language].financePage.action}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="depositsAndWithdrawals-table-body">
                        {Object.keys(data).map((key, index) =>
                            <DepositsAndWithdrawalsRow 
                                key={key}
                                currentPair={this.props.currentPair} 
                                authUserData={this.props.authUserData} 
                                data={data[key]}
                                language={this.props.language}
                                getBalance={this.handleGetBalance}
                                t={this.props.t}
                                popupOpen={this.popupOpen}
                                popupResult={this.state.popupResult}
                                popupKey={this.state.popupKey}
                                indx={key}
                            />
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </Fragment>);
	}
}

export default depositsAndWithdrawals;