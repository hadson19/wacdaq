import React, { Component } from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import apiLink from '../pagesRouter/environment';

const cookies = new Cookies();

class history extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: {
                deposits: [],
                withdrawals: []
            }
        };
        document.title = this.props.t[this.props.language].projectName + " – History";
    }

    componentDidMount() {
        let params = {};
        params['access-token'] = cookies.get('userAuthKey');
        axios({
            method: 'get',
            url: apiLink+'history',
            params
        })
        .then((response) => {
            this.setState({
                history: response.data
            });
        });
    }

    render() {
        return <main className="start history_wrapper">
            <div className="history_wrapper_inner">
                <h1 className="start-title">
                    {this.props.t[this.props.language].historyPage.title}
                </h1>
                <h3>
                    {this.props.t[this.props.language].historyPage.depositHistory}
                </h3>
                <table className="history_table">
                    <tr>
                        <th data-table-id="column_1">
                            {this.props.t[this.props.language].historyPage.status}
                        </th>
                        <th data-table-id="column_2">
                            {this.props.t[this.props.language].historyPage.coin}
                        </th>
                        <th data-table-id="column_3">
                            {this.props.t[this.props.language].historyPage.amount}
                        </th>
                    </tr>

                    {this.state.history.deposits.map(deposit => {
                        return <tr className={deposit.id_status === 1 ? 'active' : 'done' }>
                            <td data-table-id="column_1">
                                <div></div>
                                <div className="history_info">
                                    <div className="status active">{ deposit.id_status === 1 ? this.props.t[this.props.language].historyPage.active : this.props.t[this.props.language].historyPage.done }</div>
                                    <div className="time"><span>{ deposit.dt.split(' ')[0] }</span>     <span>{ deposit.dt.split(' ')[1].split('.')[0] }</span></div>
                                    <div><strong>{this.props.t[this.props.language].historyPage.adress}: </strong> <span className="code">{ deposit.address }</span></div>
                                    {/* <div className=""><strong>{this.props.t[this.props.language].historyPage.txid}: </strong> <span className="code">{ deposit.txid }</span></div> */}
                                </div>
                            </td>
                            <td data-table-id="column_2"><div></div> { deposit.short_name }</td>
                            <td data-table-id="column_3"><div></div> { deposit.amount }</td>
                        </tr>;
                        }
                    )}
                </table>
                <h3>{this.props.t[this.props.language].historyPage.withdrawalHistory}</h3>
                <table className="history_table">
                    <tr>
                        <th data-table-id="column_1">
                            {this.props.t[this.props.language].historyPage.status}
                        </th>
                        <th data-table-id="column_2">
                            {this.props.t[this.props.language].historyPage.coin}
                        </th>
                        <th data-table-id="column_3">
                            {this.props.t[this.props.language].historyPage.amount}
                        </th>
                    </tr>
                    {this.state.history.withdrawals.map(deposit => {
                            return <tr className={deposit.id_status === 1 ? 'active' : 'done'}>
                                <td data-table-id="column_1">
                                    <div></div>
                                    <div className="history_info">
                                        <div className="status active">{ deposit.id_status === 1 ? this.props.t[this.props.language].historyPage.active : this.props.t[this.props.language].historyPage.done }</div>
                                        <div className="time"><span>{ deposit.dt.split(' ')[0] }</span>     <span>{ deposit.dt.split(' ')[1].split('.')[0] }</span></div>
                                        <div><strong>{this.props.t[this.props.language].historyPage.adress} </strong> <span className="code">{ deposit.address }</span></div>
                                        <div className=""><strong>{this.props.t[this.props.language].historyPage.txid} </strong> <span className="code">{ deposit.txid }</span></div>
                                    </div>
                                </td>
                                <td data-table-id="column_2"><div></div> { deposit.short_name }</td>
                                <td data-table-id="column_3"><div></div> { deposit.amount }</td>
                            </tr>;
                        }
                    )}
                </table>
            </div>
        </main>;
    }
}

export default history;