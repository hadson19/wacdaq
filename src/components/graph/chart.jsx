import * as React from 'react';
import { widget } from '../../charting_library/charting_library.min';
import apiLink from '../pagesRouter/environment';

function getLanguageFromURL() {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.Component {
    static defaultProps = {
        symbol: 'ETH/BTC',
        interval: '15',
        containerId: 'tv_chart_container',
        datafeedUrl: apiLink+'plot', //'https://demo_feed.tradingview.com',
        libraryPath: '/charting_library/',
        autosize: true
    };

    tvWidget = null;


    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.symbol !== nextProps.symbol) {
            this.createChart(nextProps.symbol);
        }
        return true;
    }

    componentDidMount() {
        this.createChart();
    }

    createChart(symbol) {
        symbol = symbol === undefined ? this.props.symbol : symbol;
        const widgetOptions = {
            symbol: symbol,
            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
            interval: this.props.interval,
            container_id: this.props.containerId,
            library_path: this.props.libraryPath,

            locale: getLanguageFromURL() || 'en',
            autosize: this.props.autosize
        };

        const tvWidget = new widget(widgetOptions);
        this.tvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            const button = tvWidget.createButton()
                .attr('title', 'Click to show a notification popup')
                .addClass('apply-common-tooltip')
                .on('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                    },
                }));

            button[0].innerHTML = 'Check API';
        });
    }

    componentWillUnmount() {
        if (this.tvWidget != null && this.tvWidget._ready) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
    }

    render() {
        return (
            <div
                id={ this.props.containerId }
                className={ ' b-excnange' }
                style = {{"height": "675px"}}
            />
        );
    }
}