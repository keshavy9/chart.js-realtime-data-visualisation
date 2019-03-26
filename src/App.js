import React, { Component } from 'react';
import './App.css';
import Chart from './chart.js'
import { withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends Component {



  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "BTC-USD",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "2",
          lineTension: 0.45,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 15
            }
          }
        ]
      }
    }
  };


  componentDidMount(){
    const subscribe = {
      type: "subscribe",
      channels: [
      {
        name: "ticker",
        product_ids: ["BTC-USD"]
      },
      ]
    };
    this.ws = new WebSocket("wss://ws-feed.gdax.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = e => {
      const value = JSON.parse(e.data);
      console.log(value);
      if (value.type !== "ticker") {
        return;
      }

    const oldBTCData = this.state.lineChartData.datasets[0];
    const newBTCData = {...oldBTCData};
    newBTCData.data.push(value.price);


    const newLineChartData = {
      ...this.state.lineChartData,
      datasets: [newBTCData],
      labels: this.state.lineChartData.labels.concat(
        new Date().toLocaleTimeString()
      )
    };
    console.log(newLineChartData);
    this.setState({
      lineChartData: newLineChartData
    });
    };


  }

  componentWillUnmount(){
    this.ws.close();
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes["chart-container"]}>
      <Chart
        data={this.state.lineChartData}
        options={this.state.lineChartOptions}
      />
    </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
