import React, { Component } from 'react';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

export default class Project extends Component {
    state = {
        coinInfo: null
    }

    componentDidMount() {
        this.getProject(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        const {params} = this.props.match;

        if(prevProps.match.params.id !== params.id) {
            this.getProject(params.id);
        }        
    }

    getProject(id) {
        axios
            .get(`${apiLink}api/project/coininfo?short_name=${id}`)
            .then(response => {
                this.setState({coinInfo: response.data})                    
            });
    }

    render() {
        const {coinInfo} = this.state;
        
        return coinInfo && (
            <div>
                <div className="info-header">
                    <div className="logo">
                        <img src={'/static/images/coins_logo/' + coinInfo.logo} alt="" />
                    </div>
                    <h2>{coinInfo.short_name} ({coinInfo.name_coin})</h2>                    
                </div>
                <div className="info-details">
                    {coinInfo.website && <p><span className="info-title">Site:</span> 
                        <span className="info-value"><a href={coinInfo.website}>{coinInfo.website}</a></span></p>}
                    {coinInfo.coinmarketcap && <p><span className="info-title">CoinmarketCap:</span> 
                        <span className="info-value"><a href={coinInfo.coinmarketcap}>{coinInfo.coinmarketcap}</a></span></p>}
                    {coinInfo.label && <p><span className="info-title">Asset label:</span> 
                        <span className="info-value">{coinInfo.label}</span></p>}
                    {coinInfo.network && <p><span className="info-title">Network:</span> 
                        <span className="info-value">{coinInfo.network}</span></p>}
                    {coinInfo.contract_address && <p><span className="info-title">Contract:</span> 
                        <span className="info-value">{coinInfo.contract_address}</span></p>}
                    {coinInfo.block_explorer && <p><span className="info-title">Explorer:</span> 
                        <span className="info-value"><a href={coinInfo.block_explorer}>{coinInfo.block_explorer}</a></span></p>}
                    <p><span className="info-title social">Social:</span>
                        <span className="info-value">
                            {coinInfo.facebook && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.facebook}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_fb" /></a>}
                            {coinInfo.twitter && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.twitter}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_twitter" /></a>}
                            {coinInfo.telegram_group && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.telegram_group}                                 
                            ><span className="footer-socials-list-item footer-socials-list-item_telegram" /></a>}
                            {coinInfo.github_source && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.github_source}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_github" /></a>}
                            {coinInfo.medium && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.medium}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_medium" /></a>}
                            {coinInfo.reddit && <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.reddit}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_reddit" /></a>}                      
                            {coinInfo.slcak &&<a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={coinInfo.slack}                                
                            ><span className="footer-socials-list-item footer-socials-list-item_slack" /></a>}
                        </span>
                    </p>
                </div>
                <div className="info-body">
                    <p>{coinInfo.description}</p>
                </div>
            </div>
        );
    }
}