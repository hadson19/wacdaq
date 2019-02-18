import React, { Component } from 'react';
import Order from './order';

class OrdersList extends Component {
    componentDidMount() {
        const {
            handleSellDefaultSet,
            sellPriceDefaultSet,
            typeBuy,
            buyPriceDefaultSet,
            typeSell,
            handleBuyDefaultSet,
        } = this.props;

        if(this.props.data.length!==0){
            if (!sellPriceDefaultSet && typeBuy) {
                handleSellDefaultSet(parseFloat(this.props.data[0].price).toFixed(8));
            }

            if (!buyPriceDefaultSet && typeSell) {
                handleBuyDefaultSet(parseFloat(this.props.data[0].price).toFixed(8));
            }
        }

        
    }

    render() {
        const orderBookDataBuy = this.props.data;
        const list = orderBookDataBuy.map((order, indx) => (
            <Order
                order={order}
                language={this.props.language}
                t={this.props.t}
                key={indx}
                clickAction={this.props.clickAction}
            />
        ));
        return <React.Fragment>{list}</React.Fragment>;
    }
}

export default OrdersList;
