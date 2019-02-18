import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import apiLink from '../pagesRouter/environment';

class marketDepthGraph extends Component {
  _mount = false;
  marketDepthInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      graphData: null,
    };

    this.chart = React.createRef();

    this.options = {};
  }

  componentDidMount() {
    this._mount = true;
    window.scrollTo(0, 0);

    this.updateGraphData();

    this.marketDepthInterval = setInterval(() => {
      this.updateGraphData();
    }, 30000);
    
  }

  shouldComponentUpdate(prevProps) {
    if (this.chart.current) {
      let marketDepthDataSell = this.state.graphData.filter(
        marketDepthElement => marketDepthElement.id_type === 2
      );
      let marketDepthDataBuy = this.state.graphData.filter(
        marketDepthElement => marketDepthElement.id_type === 1
      );

      let marketDepthDataSellKeys = Object.keys(marketDepthDataSell);
      let marketDepthDataBuyKeys = Object.keys(marketDepthDataBuy);

      let marketDepthDataSell_array = [];
      for (let i = 0; i < marketDepthDataSellKeys.length; i++) {
        marketDepthDataSell_array.push([
          parseFloat(marketDepthDataSell[i].price, 10),
          parseFloat(marketDepthDataSell[i].amount_1_sum_cumulative, 10),
        ]);
      }

      marketDepthDataSell_array = this.sortData(marketDepthDataSell_array);

      let marketDepthDataBuy_array = [];
      for (let i = 0; i < marketDepthDataBuyKeys.length; i++) {
        marketDepthDataBuy_array.push([
          parseFloat(marketDepthDataBuy[i].price, 10),
          parseFloat(marketDepthDataBuy[i].amount_1_sum_cumulative, 10),
        ]);
      }

      marketDepthDataBuy_array = this.sortData(marketDepthDataBuy_array);

      let sell_series = this.chart.current.chart.series[0];
      let buy_series = this.chart.current.chart.series[1];

      sell_series.update(
        {
          data: marketDepthDataSell_array,
          name:
            this.props.currentPair.listCurrency.short_name +
            '/' +
            this.props.currentPair.titleCurrency.short_name,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat:
              'Price: {point.x}<br/>Sum (' +
              this.props.currentPair.listCurrency.short_name +
              '): {point.y}',
          },
        },
        true
      );

      buy_series.update(
        {
          data: marketDepthDataBuy_array,
          name:
            this.props.currentPair.listCurrency.short_name +
            '/' +
            this.props.currentPair.titleCurrency.short_name,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat:
              'Price: {point.x}<br/>Sum (' +
              this.props.currentPair.listCurrency.short_name +
              '): {point.y}',
          },
        },
        true
      );
    }

    const { currentPair } = this.props;
    
    if (currentPair.pairId !== prevProps.currentPair.pairId) {
      this.setState({ loading: true }, () => {
        this.updateGraphData();
      });

      return true
    }

    if (this.state.loading) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    this._mount = false;
    clearInterval(this.marketDepthInterval);
  }

  updateGraphData() {
    const { currentPair } = this.props;

    axios({
      method: 'get',
      url: apiLink + 'api/market_depth',
      params: {
        curr1: currentPair.listCurrency.id,
        curr2: currentPair.titleCurrency.id,
      },
    })
      .then(response => {
        if (this._mount) {
          this.setState({ graphData: response.data, loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        if (this._mount) {
          this.setState({ loading: true });
        }
      });
  }

  sortData(data) {
    data.sort(function(a, b) {
      let comparison = 0;

      if (a[0] > b[0]) {
        comparison = 1;
      } else if (b[0] > a[0]) {
        comparison = -1;
      }

      return comparison;
    });

    return data;
  }

  render() {
    const { loading, graphData } = this.state;
    const { currentPair } = this.props;
    
    if (loading) {
      return (
        <div className="markets b-excnange">
          <div className="marketDepthGraph-title b-excnange__title">
            {this.props.t[this.props.language].exchangePage.titleMarketDepth}
          </div>
          <div className="website website_loading module-loader module-loader" />
        </div>
      );
    }
    
    let marketDepthDataSell = graphData.filter(
      marketDepthElement => marketDepthElement.id_type === 2
    );
    let marketDepthDataBuy = graphData.filter(
      marketDepthElement => marketDepthElement.id_type === 1
    );

    let marketDepthDataSellKeys = Object.keys(marketDepthDataSell);
    let marketDepthDataBuyKeys = Object.keys(marketDepthDataBuy);

    let marketDepthDataSell_array = [];
    for (let i = 0; i < marketDepthDataSellKeys.length; i++) {
      marketDepthDataSell_array.push([
        parseFloat(marketDepthDataSell[i].price, 10),
        parseFloat(marketDepthDataSell[i].amount_1_sum_cumulative, 10),
      ]);
    }

    marketDepthDataSell_array = this.sortData(marketDepthDataSell_array);

    let marketDepthDataBuy_array = [];
    for (let i = 0; i < marketDepthDataBuyKeys.length; i++) {
      marketDepthDataBuy_array.push([
        parseFloat(marketDepthDataBuy[i].price, 10),
        parseFloat(marketDepthDataBuy[i].amount_1_sum_cumulative, 10),
      ]);
    }

    marketDepthDataBuy_array = this.sortData(marketDepthDataBuy_array);

    this.options = {
      chart: {
        type: 'area',
        height: 261,
      },
      title: {
        text: null,
      },
      time: {
        useUTC: false,
      },
      xAxis: {
        title: {
          enabled: false,
        },
        labels: {
          format: '{value}',
        },
        maxPadding: 0.05,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          enabled: false,
        },
        labels: {
          format: '{value}',
        },
        lineWidth: 2,
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        spline: {
          marker: {
            enable: false,
          },
        },
      },
      series: [
        {
          color: '#ce2f54',
          name:
            currentPair.listCurrency.short_name +
            '/' +
            currentPair.titleCurrency.short_name,
          data: marketDepthDataSell_array,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat:
              '{this.props.t[this.props.language].exchangePage.price}: {point.x}<br/>Sum (' +
              currentPair.listCurrency.short_name +
              '): {point.y}',
          },
        },
        {
          color: '#0fa66e',
          name:
            currentPair.listCurrency.short_name +
            '/' +
            currentPair.titleCurrency.short_name,
          data: marketDepthDataBuy_array,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat:
              'Price: {point.x}<br/>Sum (' +
              currentPair.listCurrency.short_name +
              '): {point.y}',
          },
        },
      ],
    };

    return (
      <div className="marketDepthGraph">
        <div className="marketDepthGraph-title b-excnange__title">
          {this.props.t[this.props.language].exchangePage.titleMarketDepth}
        </div>
        <div className="marketDepthGraph-content">
          <HighchartsReact
            ref={this.chart}
            highcharts={Highcharts}
            options={this.options}
            update={false}
          />
        </div>
      </div>
    );
  }
}

export default marketDepthGraph;
