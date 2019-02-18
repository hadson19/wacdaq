import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import DatePicker from 'react-datepicker';

class graph extends Component {
	constructor(props) {
		super(props);		
		this.state = {
            loaded: false,
            graphDataLength: false,
            currentPairId: false
		};
        
        this.chart = React.createRef();
        this.graph = React.createRef();
	}
	
	componentDidMount() {        
	}
    
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if (this.graph.current)
        if (nextProps.updatingPair || (nextProps.updatingGraph && !nextProps.silentUpdateGraph))
        {
            this.graph.current.className = "graph graph_loading";
        }
        
        let updateGraph = false;
        
        if (this.state.graphDataLength != nextProps.graphDataLength || this.state.currentPairId != nextProps.currentPair.pairId) 
        {
            updateGraph = true;
        }
        
        if (this.chart.current && updateGraph)
        {                
            let graphData = [];
            let volume = [];
            
            for (let i = 0; i < nextProps.graphDataLength; i++)
            {
                graphData.push([parseInt(nextProps.graphData[i].dt, 10), parseFloat(nextProps.graphData[i].open), parseFloat(nextProps.graphData[i].max), parseFloat(nextProps.graphData[i].min), parseFloat(nextProps.graphData[i].close)]);
                
                volume.push([parseInt(nextProps.graphData[i].dt, 10), parseFloat(nextProps.graphData[i].volume)]);
            }
            
            let candlesticks_series = this.chart.current.chart.series[0];
            let amount_series = this.chart.current.chart.series[1];                
                         
            candlesticks_series.update({
                data: graphData
            }, true);
               
            amount_series.update({
                data: volume
            }, true);
            
            this.setState({
                graphDataLength: nextProps.graphDataLength,
                currentPairId: nextProps.currentPair.pairId
            });
        }
            
        if (this.graph.current)
        if (!nextProps.updatingPair && (!nextProps.updatingGraph || nextProps.silentUpdateGraph))
        {
            this.graph.current.className = "graph";
        }
        
        if (!this.state.loaded) {            
            return true;
        }
        
        return false;    
    }
	
	render() {  
        if (this.props.updatingPair)
            return <div className="graph graph_loading">
        </div>;
       
        if (!this.props.graphData || !this.props.graphDataLength)
            return <div className="graph">
        </div>;
        
        this.setState({
            loaded: true,
            graphDataLength: this.props.graphDataLength,
            currentPairId: this.props.currentPair.pairId
        });
        
        let graphData = [];
        let volume = [];
        
        for (let i = 0; i < this.props.graphDataLength; i++)
        {
            graphData.push([parseInt(this.props.graphData[i].dt, 10), parseFloat(this.props.graphData[i].open), parseFloat(this.props.graphData[i].max), parseFloat(this.props.graphData[i].min), parseFloat(this.props.graphData[i].close)]);
            
            volume.push([parseInt(this.props.graphData[i].dt, 10), parseFloat(this.props.graphData[i].volume)]);
        }
       
        let options = {
            rangeSelector: {
    			buttons: [{
    				type: 'hour',
    				count: 6,
    				text: '6h'
    			}, {
    				type: 'hour',
    				count: 24,
    				text: '24h'
    			}, {
    				type: 'day',
    				count: 2,
    				text: '2d'
    			}, {
    				type: 'day',
    				count: 4,
    				text: '4d'
    			}, {
    				type: 'week',
    				count: 1,
    				text: '1w'
    			}, {
    				type: 'week',
    				count: 2,
    				text: '2w'
    			}, {
    				type: 'month',
    				count: 1,
    				text: '1m'
    			}, {
    				type: 'all',
    				text: 'All'
    			}]
            },     
            time: {
                useUTC: false
            },
            title: {
                text: null
            }, 
            credits: {
                enabled: false
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3,
                    formatter: function() {
                        return this.value.toFixed(8);
                    }
                },
                title: {
                    text: this.props.currentPair.listCurrency.short_name + '/' + this.props.currentPair.titleCurrency.short_name
                },
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'right',
                    x: -3,
                    formatter: function() {
                        return this.value.toFixed(8);
                    }
                },
                title: {
                    text: 'Volume'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],
            series: [{
                type: 'candlestick',
                color: '#ce2f54',
                lineColor: '#ce2f54',
                upColor: '#0fa66e',
                upLineColor: '#0fa66e',
                name: this.props.currentPair.listCurrency.short_name + '/' + this.props.currentPair.titleCurrency.short_name,
                data: graphData,
                dataGrouping: {
                    units: [
                        [
                            'minute',
                            [5, 15, 30]
                        ],
                        [
                            'hour',
                            [2, 4]
                        ],
                        [
                            'day',
                            [1]
                        ]
                    ]
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                color: '#777777',
                yAxis: 1,
                dataGrouping: {
                    units: [
                        [
                            'minute',
                            [5, 15, 30]
                        ],
                        [
                            'hour',
                            [2, 4]
                        ],
                        [
                            'day',
                            [1]
                        ]
                    ]
                }
            }]
        };
        
        const GraphHighcharts = () => <HighchartsReact
            ref={this.chart}
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
        />
       
	    return <div ref={this.graph} className="graph">
            <GraphHighcharts />
        </div>;
	}
}

export default graph;