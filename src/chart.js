import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const timeArray = [{display :"1 Minute", val: "1m"}, 
                    {display:"15 Minutes", val:"15m"}, 
                    {display:"1 hour", val:"1h"}];
const options = {
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    animationEnabled: true,
    exportEnabled: true,
    title:{
        text: "Market Details"
    },
    axisX: {
        valueFormatString: "h"
    },
    axisY: {
        includeZero:false,
        prefix: "$",
        title: "Price (in USD)"
    },
    data: [{
        type: "candlestick",
        showInLegend: true,
        name: "coindcx",
        yValueFormatString: "$###0.00",
        // xValueFormatString: "MMMM YYYY",
        xValueType: "dateTime",
        dataPoints: []
    }
  ]
}

class Chart extends Component {
    constructor(props){
        super(props);
        this.state = {
            candleChartData : [],
            stateOptions : options,
            dropdownOpen : false,
            selectedItemVal : "1m",
            selectedItemDisplay : "1 Minute"
        }
    }
    
    componentDidMount(){
        this.getChartData();
    }

    getChartData = () => {
        let interval = this.state.selectedItemVal ;
        let chart = this.chart;
		fetch('/market_data/candles?pair=B-BTC_USDT&interval='+interval+'&limit=50')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            let dataPoints = [];
			data.forEach(val => {
                dataPoints.push({x: val.time,
                                    y: [val.open, val.high, val.low, val.close]})
                })
            chart.options.data[0].dataPoints = dataPoints;
			chart.render();
        });
    }

    toggle = () => {
        let dropdownOpen = this.state.dropdownOpen;
        this.setState({dropdownOpen : !dropdownOpen});
    }
    setSelectedItem = (item) => {
        this.setState({selectedItemDisplay : item.display, selectedItemVal : item.val},
            function(){this.getChartData();});
    }

    getDropdownItems = () => {
        let items = [];
        timeArray.forEach((item, index) => {
            items.push((<DropdownItem key={index} 
                                      active = {item.val === this.state.selectedItemVal}
                                      onClick = {() => this.setSelectedItem(item)}>
                            {item.display}
                        </DropdownItem>))
        })
        return items;
    }

	render() {
		return (
		<div>
            <div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        {this.state.selectedItemDisplay}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.getDropdownItems()}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div>
                <CanvasJSChart options = {this.state.stateOptions}
                    onRef={ref => this.chart = ref}
                />
            </div>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
export default Chart;                             