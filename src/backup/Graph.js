import React, {Component} from 'react';
import {Scatter} from 'react-chartjs-2';
import _ from 'lodash';

const coil_strength = 0.125;
const frequency = 50;
const time_cycle = 2;
const graph_x = 10;


class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countToThirty: 0,
      counter: 0,
      scatterChartData: {},
      newGraph: false,
      renderStart: 0,
      savestate:{},
      ticks: [],
    };


    this.plotGraphs = this.plotGraphs.bind(this);
    //this.getLineCoordinates = this.getLineCoordinates.bind(this);
  }


  getInterval = (start, end, steps) => _.range(start, end, steps);
/*
getInterval = (start, end, steps) =>
{
let rateTime = time_cycle*this.props.rate;
var arr = []
for(let i = 0 ; i<20/time_cycle; i++){
  arr.push([
     (this.props.time-(0.01+(i*time_cycle))),

     (this.props.time+0.01+(i*time_cycle)),
 (this.props.time-0.01+(i*time_cycle)+rateTime),
   (this.props.time+0.01+(i*time_cycle)+rateTime),
  ])

}
*//*
getLineCoordinates = () =>{

  let rateTime = time_cycle*this.props.rate;
  var arr = []
  for(let i = 0 ; i<12/time_cycle; i++){
    console.log(i);
    for(let j = 0; j < 10; j++)
    {
        arr.push({
        x: this.props.time-((10-j)/100)+(i*time_cycle),
        y: this.func(((this.props.time-(j/100))+(i*time_cycle)))
      },{
        x: (this.props.time-((10-j)/200)+(i*time_cycle)),
        y: this.func(((this.props.time-(j/200))+(i*time_cycle)))
      });
      arr.push({
        x: (this.props.time+(j/200)+(i*time_cycle)),
        y: this.func(((this.props.time+(j/200))+(i*time_cycle)))
      },{
        x: (this.props.time+(j/100)+(i*time_cycle)),
        y: this.func(((this.props.time+(j/100))+(i*time_cycle)))
      });
      arr.push({
        x: (this.props.time-((10-j)/100)+(i*time_cycle)+rateTime),
        y: this.func(((this.props.time-(j/100))+(i*time_cycle)+rateTime))
      },{
        x: (this.props.time-((10-j)/200)+(i*time_cycle)+rateTime),
        y: this.func(((this.props.time-(j/200))+(i*time_cycle)+rateTime))
      });
      arr.push({
        x: (this.props.time+(j/200)+(i*time_cycle)+rateTime),
        y: this.func(((this.props.time+(j/200))+(i*time_cycle)+rateTime))
      },{
        x: (this.props.time+(j/100)+(i*time_cycle)+rateTime),
        y: this.func(((this.props.time+(j/100))+(i*time_cycle)+rateTime))
      });
    }
  }
  console.log(arr);
  console.log("berechnet mit "+ this.props.part);

  return arr;
}*/

getLineCoordinatesOnChange = () => this.getInterval(0 , graph_x, 0.01).map(x =>  {

    return {
      x: _.floor(x,3),
      y: this.func(_.ceil(x,3))
    }
  })
  getLineCoordinates = () => this.getInterval(0 , graph_x, 0.01).map(x =>  {

      return {
        x: _.floor(x,3),
        y: this.func(_.ceil(x,3))
      }
    })



  plotGraphs() {
//console.log(this.props.part);

    const oxidationGraph = {
      label: 'Redukt',
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)', //red
      borderColor: 'rgb(255, 99, 132)',
      markerType: "circle", //"square", "cross", "none"
      pointRadius: 5,


      data: [{
        x: this.props.time%10,
        y: this.func(this.props.time%10)
      }]}
/*
    */

    if(this.state.countToThirty === 0 ){
      console.log("count = 0");
      //this.state.savestate = this.getLineCoordinates();
    const reductionGraph = {

      lineTension : 0,
      label: 'Reduktion',
      fill: false,

      backgroundColor: 'rgb(54, 162, 235)', //blue
      borderColor: 'rgb(54, 162, 235)',
      data: this.getLineCoordinates()
    };
    this.setState({
      renderStart: this.props.time,
      savestate:this.getLineCoordinates(),
      newGraph: false,
      scatterChartData: {
        datasets: [
          oxidationGraph,
          reductionGraph,

        ]
      }
    })
  }


  else{
    console.log("normalrender");
  const reductionGraph = {
    legend: {
  display: true,
  },

    lineTension : 0,
    label: 'Reduktion',
    fill: false,
    backgroundColor: 'rgb(54, 162, 235)', //blue
    borderColor: 'rgb(54, 162, 235)',
    data: this.state.savestate
  };
  this.setState({
    renderStart: this.props.time,

    scatterChartData: {
      datasets: [
        oxidationGraph,
        reductionGraph,

      ]
    }
  })}




  }
  componentDidMount() {
    this.timer = setInterval(
     () => this.increment(),
     200


)
}
componentWillUnmount() {
clearInterval(this.timer)
}
increment() {
  this.setState({counter: this.state.counter + 0.2})
  this.plotGraphs();
/*
  if ((this.props.time%10 )== 0){
    this.setState({
      countToThirty: this.state.countToThirty + 10
    })
  }
*/

    if(this.state.countToThirty <9.7){
      let x = this.state.countToThirty + 0.2;
      this.setState({countToThirty: x });
    }else{
      this.setState({countToThirty: 0});
    }


}

  //berechnet punkte für "Oxidation"
  /*func = (xValue, n = 1) => {
    if(xValue%T<DT){
      return(Ue-Ua)
    }else return -Ua
  };*/
  func = (xValue) => {
    var rateTime = time_cycle*this.props.rate;
    var delta = (this.props.rate*(1-this.props.rate)*this.props.voltage)/(coil_strength*frequency);
    var average = delta/2;
    var IL_max = (this.props.strom*rateTime) +(delta/2)//korrekt
    var IL_min = (this.props.strom*rateTime) -(delta/2)//Korrekt



    switch(this.props.part){
      case "Us in V":{
        return  ((xValue%time_cycle)<=rateTime)?  this.props.voltage : 0;

      }
      case  "Ul in V":{
          return  ((xValue%time_cycle)<=rateTime)? (this.props.voltage*time_cycle)-(this.props.voltage*rateTime) : -(this.props.voltage*rateTime);

      }
      case "Ud in V":{
          return  ((xValue%time_cycle)<=rateTime)? 0 : this.props.voltage  ;

      }
      case "Is in A":{
          return (((xValue%time_cycle)<=rateTime)? ( IL_min + (IL_max*(xValue%time_cycle))) : 0);

      }
      case  "Il in A":{
          return (((xValue%time_cycle)<=rateTime)? ( IL_min + (IL_max*((xValue%time_cycle)/rateTime))) : ( IL_min + (IL_max-((((xValue%time_cycle)-rateTime)/(time_cycle-rateTime)*IL_max)))));

      }
      case "Id in A":{
          return (((xValue%time_cycle)<=rateTime)? 0 : ( IL_min + (IL_max*(time_cycle-(xValue%time_cycle)))));
      }











    }






  };
  /*
  NUMBER TESTING PART
  <p>{this.state.counter}</p>
  <p>{this.props.time}</p>
  <p>{parseInt(this.props.time)}</p>
  <p>{this.props.time - this.state.countToThirty}</p>
  <p>{Math.round(this.props.time - this.state.countToThirty)}</p>
  <p>{this.props.time +10 - this.state.countToThirty}</p>
  <p>{Math.round(this.props.time +10 - this.state.countToThirty)}</p>
  <p>{this.state.countToThirty}</p>
  <p>{parseInt(this.state.countToThirty)}</p>
  <p>{this.props.time}</p>
  */
  //berechnet punkte für "Reduktion"


  render() {

    return (
      <div className = "chart" >



      <p>{this.state.scatterChartData[0]}</p>
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
            duration: 140
          },
          showLines: true,
          scales: {
            xAxes: [{
              scaleLabel: {
                display: false,
                labelString: 'Time'
              },
              ticks:{
                maxRotation: 0,
                 beginAtZero: true,
                 userCallback: function(label, index, labels) {
                     // when the flimport React from 'react';oored value is the same as the value we have a whole number/*
                     //if (Math.floor(label) === label && Math.floor(label)%2 === 0) {
                         //return label;
                     //}
                      return null;
                 },

                /*
                min:Math.floor((this.props.time -15)),
                max:Math.floor((this.props.time +15))
              */
                min:0,
                max:10,

/*Ü
                afterBuildTicks: function(this){
                  this.ticks = [];
                  this.ticks.push(this.props.time -15);
                  this.ticks.push(this.props.time -10);
                  this.ticks.push(this.props.time -5);
                  this.ticks.push(this.props.time);
                  this.ticks.push(this.props.time +5);
                  this.ticks.push(this.props.time +10);
                  this.ticks.push(this.props.time +15)
                }
                afterTickToLabelConversion: function(scaleInstance) {
                  // set the first and last tick to null so it does not display
                  // note, ticks[0] is the last tick and ticks[length - 1] is the first
                  this.ticks[0] = null;
                  this.ticks[scaleInstance.ticks.length - 1] = null;

                  // need to do the same thing for this similiar array which is used internally
                  this.ticksAsNumbers[0] = null;
                  this.ticksAsNumbers[scaleInstance.ticksAsNumbers.length - 1] = null;
                }*/
              }



            }],
            yAxes: [{
              ticks: {
              //  min: -500,
              //  max: 500
              },
              scaleLabel: {
                display: true,
                labelString: this.props.part,
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
