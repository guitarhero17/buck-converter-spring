import React, {Component} from 'react';
import {Scatter} from 'react-chartjs-2';
import _ from 'lodash';



//-----------------------------
//These values were predefined by an electrical engineer, whom I counseled while developing this app.

const coil_strength = 0.125;
const frequency = 50;
const time_cycle = 2;
const graph_x = 10;

//-----------------------------

/**
 * Sets the amount of calculated points with defining the precisionStep.
 * @type {number}
 * */
const precisionStep = 0.05;


class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      isSaved : false,
      scatterChartData: {},
      savestate:{},
    };


    this.plotGraphs = this.plotGraphs.bind(this);
  }

/**
 * Computes the (x,y) coordinates according to the precision step
 * @see {calculate}
 */
  getFunctionLineCoordinates = () => _.range(0 , graph_x, precisionStep).map(x =>  {

    //console.log(`x: ${_.floor(x,3)}, y: ${this.calculate(_.floor(x,3))}`);
      return {
        x: _.floor(x,3), //Rounding down
        y: this.calculate(_.floor(x,3)) //Rounding down
      }
    })

  
/**
 * A Chart.js standard function for plotting the graphs
 */
  plotGraphs() {

     const redDot = {
       label: 'Red Dot',
       fill: false,
       backgroundColor: 'rgb(255, 99, 132)', //red
       borderColor: 'rgb(255, 99, 132)',
       pointStyle: 'circle', //"square", "cross", "none"
       pointRadius: 5,


       data: [{
         x: this.state.time%graph_x,
         y: this.calculate(this.state.time%graph_x)
       }]}

       console.log(`!!!!!! X: ${this.state.time%10}, Y: ${this.calculate(this.state.time%10)}`)
      if(this.state.isSaved === false){
      //console.log("count = 0");
      this.setState({
        isSaved: true
      });
      console.log("Coordinates saved!!!");


    const chartFunction = {

      lineTension : 0,
      label: 'Function',
      fill: false,

      backgroundColor: 'rgb(54, 162, 235)', //blue
      borderColor: 'rgb(54, 162, 235)',
      data: this.getFunctionLineCoordinates()
    };

    this.setState({
      savestate: this.getFunctionLineCoordinates(),
      scatterChartData: {
        datasets: [
          redDot,
          chartFunction,

        ]
      }
    })
  }


  else{
    console.log("normalrender");

  const chartFunction = {
    lineTension : 0,
    label: 'Function',
    fill: false,
    backgroundColor: 'rgb(54, 162, 235)', //blue
    borderColor: 'rgb(54, 162, 235)',
    data: this.state.savestate
  };
  this.setState({
    scatterChartData: {
      datasets: [
        redDot,
        chartFunction,
      ]
    }
  })}

  }
  componentDidMount() {
    this.interval = setInterval(() => this.increment(),200)
}

componentWillUnmount() {
  clearInterval(this.interval);
  this.setState({
    isSaved: false
  });
}

/**
 * Plots the graphs and updates the @var {time}
 * variable
 */
increment() {
  
  this.plotGraphs();

  this.setState(prevState => ({
    time: prevState.time + 0.2
  }));


}

/**
 * Calculates the value of the y-coordinate in the two-dimensional graph
 * according to predefined physical laws that apply to current
 * and voltage in such a system.
 * @param {valueOfX}
 */
calculate = (valueOfX) => {
    var rateTime = time_cycle*this.props.dutyCycle;

    /**
     * The calculations are based on predefined formulas
     */
    var Il_delta = (this.props.dutyCycle*(1-this.props.dutyCycle)*this.props.voltage)/(coil_strength*frequency);
    var IL_max = (this.props.current*rateTime) +(Il_delta/2)
    var IL_min = (this.props.current*rateTime) -(Il_delta/2)



    switch(this.props.part){
      case "Us in V":{
        return  ((valueOfX%time_cycle)<=rateTime)?  this.props.voltage : 0;

      }
      case  "Ul in V":{
          return  ((valueOfX%time_cycle)<=rateTime)? (this.props.voltage*time_cycle)-(this.props.voltage*rateTime) : -(this.props.voltage*rateTime);

      }
      case "Ud in V":{
          return  ((valueOfX%time_cycle)<=rateTime)? 0 : this.props.voltage  ;

      }
      case "Is in A":{
          return (((valueOfX%time_cycle)<=rateTime)? (IL_min + (IL_max*(valueOfX%time_cycle))) : 0);

      }
      case  "Il in A":{
          return (((valueOfX%time_cycle)<=rateTime)? (IL_min + (IL_max*((valueOfX%time_cycle)/rateTime))) : ( IL_min + (IL_max-((((valueOfX%time_cycle)-rateTime)/(time_cycle-rateTime)*IL_max)))));

      }
      case "Id in A":{
          return (((valueOfX%time_cycle)<=rateTime)? 0 : (IL_min + (IL_max*(time_cycle-(valueOfX%time_cycle)))));
      }
      default: {
        console.log("Error calculating the y-coordinate.");
        return 0;
      }
    }
};


  render() {

    return (
      <div className = "chart" >
      <Scatter data = {this.state.scatterChartData}
      options = {
        {
          tooltips: {
            enabled: false
          },
          legend: {
            display: false
        },
          animation: {
            duration: 0 //general animation time. Was: 140
          },
          hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
          showLines: true,
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Time'
              },
              ticks:{
                maxRotation: 0,
                 beginAtZero: true,
                 userCallback: function(label, index, labels) {
                   return null;
                 },
                 min:0,
                max:10,
              },
            }],
            yAxes: [{
              ticks: {},
              scaleLabel: {
                display: true,
                labelString: this.props.part
              }
            }]
          },
          elements: {
            point: {
              radius: 1
            }
          }
        }
      }
      />
      </div>
    )
  }
}

export default Chart;
