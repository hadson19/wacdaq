import React, { Component } from 'react';
class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClick = () => {
        const { order, clickAction } = this.props;
        clickAction(
            parseFloat(order.price).toFixed(8),
            parseFloat(order.accum_amount).toFixed(8)
        );
    };

    render() {
        const { order } = this.props;

        let classes = ['orderBook-content-tableBody-row-cell'];

        classes.push(
            order.id_type === 1
                ? 'orderBook-content-tableBody-row-cell_green'
                : 'orderBook-content-tableBody-row-cell_red'
        );

        classes = classes.join(' ');

        return (
            <div onClick={this.onClick} className="orderBook-content-tableBody-row">
                <div className={classes}>
                    {this.props.order.id_type === 1
                        ? this.props.t[this.props.language].exchangePage.buy
                        : this.props.t[this.props.language].exchangePage.sell}
                </div>
                <div className="orderBook-content-tableBody-row-cell">
                    {(Math.round(parseFloat(order.price) * 100000000) / 100000000).toFixed(8)}
                </div>
                <div className="orderBook-content-tableBody-row-cell">
                    {parseFloat(order.amount_1_sum).toFixed(6)}
                </div>
                <div className="orderBook-content-tableBody-row-cell">
                    {parseFloat(order.amount_2_sum).toFixed(6)}
                </div>
            </div>
        );
    }
}

export default Order;