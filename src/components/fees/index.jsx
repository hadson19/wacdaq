import React, { Component } from 'react'
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

class FeesRow extends Component { 
    render() {
        return <tr className="start-fees-row">
            <td className="start-fees-row-cell" >{this.props.sname}</td>
            <td className="start-fees-row-cell" data-label="Standart">0,10 %</td>
            <td className="start-fees-row-cell">0,20 %</td>
            <td className="start-fees-row-cell" data-label="Special">0,08 %</td>
            <td className="start-fees-row-cell">0,16 %</td>
            <td className="start-fees-row-cell" data-label="Premium">0,05 %</td>
            <td className="start-fees-row-cell">0,10 %</td>
        </tr>
    }
}
class fees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyPair: []
        };

        document.title = this.props.t[this.props.language].projectName + " – Fees";
    }

    getPairs() {

        axios({
            method: 'get',
            url: apiLink + 'getPairs'
        })
        .then((response) => {
            this.pairsRender(response.data);
        })
        .catch((error) => {
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getPairs();
    }

    pairsRender(pairs) {
        let shortNames = [];

        Object.keys(pairs).forEach((key) => {
            const item = pairs[key];
            const dataShortName = item.data.short_name;
            
            Object.keys(item.pairs).forEach((pkey) => {
                const pair = item.pairs[pkey];
                shortNames.push(pair.short_name + '/' + dataShortName);
            });
        })

        this.setState({
            currencyPair: shortNames
        });
    }

    render() {
        const shortNames = this.state.currencyPair;

        return <main className="start start_fees">
            <div className="start-description">
                <p className="start-description-title">{this.props.t[this.props.language].fees.summary}</p>
                <p className="start-description-text start-description-text_important">{this.props.t[this.props.language].fees.text}</p>
                <p className="start-description-text">{this.props.t[this.props.language].fees.text_1}</p>
                <p className="start-description-text">{this.props.t[this.props.language].fees.text_2}</p>
            </div>
            <p className="start-title">{this.props.t[this.props.language].fees.pageTitle}</p>
            <table className="start-fees">
                <thead className="start-fees-header">
                    <tr className="start-fees-row">
                        <td className="start-fees-row-cell start-fees-row-cell_collapse" rowSpan="2">{this.props.t[this.props.language].fees.pairs}</td>
                        <th className="start-fees-row-cell" colSpan="2">{this.props.t[this.props.language].fees.standart}</th>
                        <th className="start-fees-row-cell" colSpan="2">{this.props.t[this.props.language].fees.special}</th>
                        <th className="start-fees-row-cell" colSpan="2">{this.props.t[this.props.language].fees.premium}</th>
                    </tr>
                    <tr className="start-fees-row">
                        <th className="start-fees-row-cell">Maker</th>
                        <th className="start-fees-row-cell">Taker</th>
                        <th className="start-fees-row-cell">Maker</th>
                        <th className="start-fees-row-cell">Taker</th>
                        <th className="start-fees-row-cell">Maker</th>
                        <th className="start-fees-row-cell">Taker</th>
                    </tr>
                </thead>
                <tbody>
                    {shortNames.map((shortName, index) =>
                        <FeesRow sname={ shortName } key={index} />
                    )}
                </tbody>
            </table>
        </main>;
    }
}

export default fees;