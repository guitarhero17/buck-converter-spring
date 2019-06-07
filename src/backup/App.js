import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css'
import { Alert} from "react-bootstrap";
import { Row, Col,Container, Popover, Button, PopoverHeader, PopoverBody, Collapse, CardBody, Card, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Graph from "./Graph";
import './BuckConverter.css';

class BuckConverter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rate: 0,
      rateTemp: 0,
      time: 0,
      strom: 0,
      stromTemp: 0,
      voltage: 0,
      voltageTemp: 0,
      power: 0,
      renderElement: "svgSwitch",
      visible: false,
      loggedInAdmin: this.props.loggedInAdmin,

      ///////Lifted state from "Circuit_Dobo.js"
      acceptingElement: "circuit",
      popoverOpen: false,
      //schalterOpen: false,
      ////////////////////////////////////////
      /////A variable for the switching intervall////
      switchIt: null,

      ///////////////////////////////////////
      /////A varibale for the collapsing text. Text is open per "default"
      collapse: true

    };
    this.toggle = this.toggle.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleStromChange = this.handleStromChange.bind(this);
    this.handleVoltageChange = this.handleVoltageChange.bind(this);
    this.handleParams = this.handleParams.bind(this);
    this.handleRenderButton = this.handleRenderButton.bind(this);
    this.onAlertDismiss = this.onAlertDismiss.bind(this);
    this.resetBuckConverter = this.resetBuckConverter.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);

  }

  /////////////
  onAlertDismiss() {
    this.setState({ visible: false });
  }



  editState(prop, value) {

    let dummyState = this.state;
    dummyState[prop] = value;
    console.log("Should be edited: ");
    console.log(dummyState);
    return dummyState;
  }

  toggle() {
    this.setState(this.editState("popoverOpen", !this.state.popoverOpen));
  }

  toggleCollapse() {
    this.setState(this.editState("collapse", !this.state.collapse));
  }

  showPopoverAt(elem) {
    console.log("In showPopover");
    this.setState(this.editState("acceptingElement", elem));
    this.toggle();
    this.handleRenderButton(elem);
  }


  flipping() {
    var pathOpen = "m 587.1907,128.48809 19.46984,-8.53849";
    var pathClosed = "m 587.1907,128.48809 19.85288,0.0973";

    var svgSwitchLine = document.getElementById('svgSwitchLine');
    if (svgSwitchLine.getAttribute("d") == pathOpen) {
      svgSwitchLine.setAttribute("d", pathClosed);
    } else {
      svgSwitchLine.setAttribute("d", pathOpen);
    }
  }

  flipSwitch() {
    console.log("switch")

    if (this.state.switchIt == null) {
      this.state.switchIt = setInterval(this.flipping, 500);
    }

    //Schlater offen: <path d="m 587.1907,131.48809 15.46984,0" id="line2-1" class="colors" style="fill:none;stroke-width:3.54330897;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"/>
    //object.attr('d') == pathOpen;
  }

  resetBuckConverter() {
    var pathOpen = "m 587.1907,128.48809 19.46984,-8.53849";

    //Die Linie des Schalters im SVG
    var svgSwitchLine = document.getElementById('svgSwitchLine');

    //Tastgrad
    var dutyCycle_input = document.getElementById('D_');

    //Eingangsstrom
    var enteringCurrent_input = document.getElementById('I_e');

    //Eingangsspannung
    var enteringVoltage_input = document.getElementById('U_e');

    clearInterval(this.state.switchIt);
    svgSwitchLine.setAttribute("d", pathOpen);

    dutyCycle_input.setAttribute('value', 0);
    enteringCurrent_input.setAttribute('value', 0);
    enteringVoltage_input.setAttribute('value', 0);

    document.getElementById('info_workstate').innerHTML = "TSS ist aus.";
    document.getElementById('info_workstate').classList.remove("alert-success");
    document.getElementById('info_workstate').classList.add("alert-danger");

    this.setState({
      rate: 0,
      rateTemp: 0,
      time: 0,
      strom: 0,
      stromTemp: 0,
      voltage: 0,
      voltageTemp: 0,
      power: 0,
      renderElement: "svgSwitch",
      visible: false,
      switchIt: null
    });
  }



  //////////////




  handleRenderButton(a) {
    this.setState({
      renderElement: a
    })
  }

  handleParams() {
    if (this.state.stromTemp <= 10 && this.state.stromTemp > 0 && this.state.voltageTemp <= 100 && this.state.voltageTemp > 0 && this.state.rateTemp <= 1 && this.state.rateTemp > 0) {

      this.setState({
        strom: this.state.stromTemp,
        voltage: this.state.voltageTemp,
        rate: this.state.rateTemp,
      });

      this.flipSwitch();
      document.getElementById('info_workstate').innerHTML = "TSS ist an!";
      document.getElementById('info_workstate').classList.remove("alert-danger");
      document.getElementById('info_workstate').classList.add("alert-success");
    }


    else {
      alert("D muss zwischen 0 und 1 liegen, \n Ie zwischen 0 und 10 \n Ue zwischen 0 und 100");
    }

  }

  handleRateChange(event) {

    var dimension = null;
    if (event.target.value >= 0 && event.target.value <= 1) {
      this.setState({
        rateTemp: event.target.value
      });
    } else {
      alert("Der Wert des ... soll im Interval (0;1] sein.")
      this.setState({
        visible: true
      });
    }
  }

  handleStromChange(event) {
    if(event.target.value > 0 && event.target.value <= 100){
      this.setState({
        stromTemp: event.target.value
      });
    } else {
      alert("Der Wert des Tastgrads soll im Interval (0;1] sein.")
      this.setState({
        visible: true
      });
    }
  }

  handleVoltageChange(event) {
    if(event.target.value > 0 && event.target.value <= 100){
    this.setState({
      voltageTemp: event.target.value
    });
  } else {
    alert("Der Wert des Tastgrads soll im Interval (0;1] sein.")
    this.setState({
      visible: true
    });
  }
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
    this.setState(prevState => ({

      time: prevState.time + 0.2
      //(Math.round((this.state.time + 5)*10)/10))/1,

    }))

    //this.state.time += (Math.round((this.state.time + 1)*10)/10);
  }






  render() {

    const eingang = (

      <div className="Options">
        {/*<Form>
          <FormGroup row>
            <Label sm={2} for="D_">Tastgrad <strong>D = </strong></Label>

            <Col sm={10}>
              <Input type="number" min="0" max="1" step="0.05" id="D_" name="D_" value={this.state.rateTemp} onChange={this.handleRateChange} />
            </Col>
          </FormGroup>
        </Form>*/}

        <label for="D_">Tastgrad</label>
        <p><strong>D = </strong>
          < input className="werte" type="number" min="0" max="1" step="0.05" id="D_" name="D_" value={this.state.rateTemp} onChange={this.handleRateChange} />
        </p>
        <label for="I_e">Eingangsstrom</label>
        <p><strong>Ie = </strong>
          < input className="werte" type="number" min="0" max="10" step="0.1" id="I_e" name="I_e" value={this.state.stromTemp} onChange={this.handleStromChange} />
        </p>
        <label for="U_e">Eingangsspannung</label>
        <p><strong>Ue = </strong>
          < input className="werte" type="number" min="0" max="100" step="1" id="U_e" name="U_e" value={this.state.voltageTemp} onChange={this.handleVoltageChange} />
        </p>
        <label for="P_e">Eingangsleistung</label>
        <p><strong>Pe = {(this.state.stromTemp * this.state.voltageTemp).toFixed(2)} </strong>
          </p>

        <Button outline color="success" onClick={this.handleParams}>Start</Button>
        <Button outline color="danger" onClick={this.resetBuckConverter}>Stop</Button>
      </div>);

    const diode = (
      <div>
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Ud in V"


        ></Graph>,
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Id in A"


        ></Graph>
      </div>
    );
    const svgSwitch = (
      <div>
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Us in V"


        ></Graph>,
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Is in A"


        ></Graph>
      </div>
    );
    const spule = (

      <div>
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Ul in V"


        ></Graph>,
        <Graph
          time={this.state.time}
          strom={this.state.strom}
          voltage={this.state.voltage}
          rate={this.state.rate}
          power={this.state.power}
          part="Il in A"


        ></Graph>
      </div>
    );
    const ausgang = (
      <div className="Options">
        <label for="D_"></label>
        <p className="werteA"><strong>D = </strong>
          < input className="werteA" />

        </p>
        <label for="I_e">Ausgangsspannung</label>
        <p><strong>Ua = {(this.state.voltage * this.state.rate).toFixed(2)}</strong>
          < input className="werteA" type="number" min="0" max="10" step="0.1" id="I_e" name="I_e" value={this.state.strom} onChange={this.handleStromChange} />

        </p>

        <label for="P_e">Ausgangsleistung</label>
        <p><strong>Pa = </strong>
          {Math.round(this.state.voltage * (this.state.strom / 10), 2)}
        </p>

        <label for="U_e"></label>
        <p className="werteA"><strong>Ue = </strong>
          < input className="werteA" type="number" min="0" max="100" step="1" id="U_e" name="U_e" value={this.state.voltage} onChange={this.handleVoltageChange} />

        </p>
      </div>);

    let x = this.state.renderElement
    let content_;
    //console.log("here we are" + x);
    switch (x) {
      case "diode": {

        content_ = diode
        break;
      }
      case "switch_point_1": {

        content_ = svgSwitch;
        break;
      }
      case "spule_windungen": {
        content_ = spule;
        break;
      }
      case "spannungsquelle_a": {
        content_ = ausgang;
        break;
      }
      default: {
        content_ = eingang;
      }
    }

    return (

   
    

      <Container className="grid">
        <Row>
          <Col md="3">
            {eingang}
          </Col>
          <Col md="6">
            <div>

              <Popover placement={"bottom"} isOpen={this.state.popoverOpen} target={this.state.acceptingElement} toggle={this.toggle}>
                <PopoverHeader>Graph</PopoverHeader>
                <PopoverBody>{content_}</PopoverBody>
              </Popover>


              <svg width="100%" height="100%" viewBox="0 0 572 250" id="circuit">
                <path id="path4771" d="M 0,0 5,-5 -12.5,0 5,5 Z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '1.00000003pt', strokeOpacity: 1 }} transform="matrix(-0.4,0,0,-0.4,-4,0)" />
                <marker orient="auto" refY={0} refX={0} id="Arrow2Lend" style={{ overflow: 'visible' }}>
                  <path id="path4783" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '0.625', strokeLinejoin: 'round', strokeOpacity: 1 }} d="M 8.7185878,4.0337352 -2.2072895,0.01601326 8.7185884,-4.0017078 c -1.7454984,2.3720609 -1.7354408,5.6174519 -6e-7,8.035443 z" transform="matrix(-1.1,0,0,-1.1,-1.1,0)" />
                </marker>
                <marker orient="auto" refY={0} refX={0} id="Arrow1Send" style={{ overflow: 'visible' }}>
                  <path id="path4777" d="M 0,0 5,-5 -12.5,0 5,5 Z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '1.00000003pt', strokeOpacity: 1 }} transform="matrix(-0.2,0,0,-0.2,-1.2,0)" />
                </marker>
                <path style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} id="path2518" d="m 289.65918,218.56734 -0.27392,-59.28422" />
                <g id="diode" className="btn hov five_elements" transform="translate(-4.4843756,-3.9073454)" onClick={() => { this.showPopoverAt("diode") }}>
                  <path d="m 293.87046,131.34004 -14.17322,28.62235 h 28.34644 z" id="path2522" style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1 }} />
                  <path d="M 308.04368,131.34002 H 279.69724" id="path2524" style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <path d="m 296.12425,224.26924 c 79.82361,0.11575 153.7296,0.0142 204.52009,0.13001" id="path6655" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="m 292.57191,224.88953 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="path2404" style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />
                <path d="M 289.38608,123.64256 V 55.319164" id="path3131" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="m 292.57191,48.889533 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="path3133" style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />
                <path d="M 74.487831,48.889533 H 159.17062" id="path3156" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <g transform="matrix(-1,0,0,1,498.4019,-68.039617)" id="g3309" style={{ display: 'inline', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                <text x="402.83884" y="82.402435" id="spule_text_l" onClick={() => { this.showPopoverAt("spule_windungen") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="402.83884" y="82.402435" id="tspan3700" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>L</tspan>
                </text>
                <text x="158.94281" y="35.092113" id="switch_s" className="btn hov" onClick={() => { this.showPopoverAt("switch_point_1") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="158.94281" y="35.092113" id="tspan3726" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>S</tspan>
                </text>
                <text x="248.85667" y="189.86465" id="diode_text_d" onClick={() => { this.showPopoverAt("diode") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="248.85667" y="189.86465" id="tspan3730" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>D</tspan>
                </text>
                <g transform="matrix(0,-0.70694549,0.59964829,0,62.21968,450.65963)" id="diode_pfeil" onClick={() => { this.showPopoverAt("diode") }} style={{ strokeWidth: '6.14354038', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="path3979" style={{ fill: 'none', stroke: '#000000', strokeWidth: '6.14354038', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '6.14354038', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <text id="text918" y="-12.268635" x="329.49225" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan y="12.060173" x="329.49225" id="tspan916" />
                </text>
                <g transform="matrix(1.4422122,0,0,1.3433605,-678.02041,-123.63068)" id="svgSwitch" className="btn hov five_elements" onClick={() => { this.showPopoverAt("switch_point_1") }} style={{ display: 'inline', strokeWidth: '2.87375093', strokeMiterlimit: 4, strokeDasharray: 'none' }}>

                  <path d="m 587.1907,128.48809 19.46984,-8.53849" id="svgSwitchLine" onMouseOver={() => { document.getElementById("svgSwitch").focus() }} style={{ fill: 'none', strokeWidth: '2.87375093', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />

                </g>
                <flowroot id="flowRoot924" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} transform="translate(-58.168609,-501.29296)">
                  <flowregion id="flowRegion926" style={{ fontSize: '26.66666603px', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                    <rect id="rect928" width="70.896347" height="56.789898" x="89.93042" y="143.2101" style={{ fontSize: '26.66666603px', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  </flowregion>
                  <flowpara id="flowPara930" />
                </flowroot>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="91.357391" y="33.416122" id="text934">
                  <tspan id="tspan932" x="91.357391" y="33.416122" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6671">e</tspan>
                  </tspan>
                </text>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="426.07886" y="29.132351" id="text940">
                  <tspan id="tspan938" x="426.07886" y="29.132351" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', lineHeight: '33.33333206px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6700">L</tspan>
                    <tspan style={{ fontSize: '18.66666603px', lineHeight: '33.33333206px' }} id="tspan6712">= </tspan>i
            <tspan style={{ fontSize: '64.99999762%', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6665">a</tspan>
                    <tspan style={{ fontSize: '26.66666603px', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan942"> </tspan>
                  </tspan>
                </text>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="357.3573" y="15.828125" id="spule_text_u" onClick={() => { this.showPopoverAt("spule_windungen") }}>
                  <tspan id="tspan948" x="357.3573" y="15.828125" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>u
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6702">L</tspan>
                  </tspan>
                </text>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="327.30688" y="163.05183" id="diode_text_u" onClick={() => { this.showPopoverAt("diode") }}>
                  <tspan id="tspan954" x="327.30688" y="163.05183" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>u
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6667">D</tspan>
                  </tspan>
                </text>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="247.78865" y="121.72112" id="diode_text_i" onClick={() => { this.showPopoverAt("diode") }}>
                  <tspan id="tspan972" x="247.78865" y="121.72112" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6669">D</tspan>
                  </tspan>
                </text>
                <path id="path5881" d="m 120.49826,48.789703 -5.36301,3.10001 v -6.20002 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path id="path5881-2" d="m 444.12465,49.02474 -5.36301,3.10001 v -6.20002 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="M 206.61741,49.057503 H 283.9603" id="path3129-4" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="m 206.57191,48.889533 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="switch_point_2" style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />
                <path d="m 168.83316,48.975153 a 3.1858315,3.1858253 0 1 1 -6.37166,0 3.1858315,3.1858253 0 1 1 6.37166,0 z" id="switch_point_1" className="btn hov five_elements" onClick={() => { this.showPopoverAt("switch_point_1") }} style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />
                <g id="spule_windungen" className="btn hov five_elements" onClick={() => { this.showPopoverAt("spule_windungen") }} style={{ strokeWidth: '4.76689386', strokeMiterlimit: 4, strokeDasharray: 'none' }} transform="matrix(0.91773158,0,0,0.76724371,144.30629,-16.863541)">
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -223.98783,-78.568224 a 11.213235,15.640902 0 0 1 -5.12986,14.263377 11.213235,15.640902 0 0 1 -11.4332,0.56096 11.213235,15.640902 0 0 1 -5.83567,-13.725361" id="circle4-8" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -246.38655,-77.469248 a 11.213235,15.640902 0 0 1 -5.12987,14.263377 11.213235,15.640902 0 0 1 -11.43319,0.56096 11.213235,15.640902 0 0 1 -5.83568,-13.725361" id="circle4-8-9" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -268.7853,-76.370272 a 11.213235,15.640902 0 0 1 -5.05533,14.19609 11.213235,15.640902 0 0 1 -11.35125,0.745296 11.213235,15.640902 0 0 1 -5.98899,-13.470945" id="circle4-8-93" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                </g>
                <path d="m 410.7022,49.057503 h 88.77805" id="path3129-4-7" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="M 72.757661,124.21935 V 48.859807" id="path3315-9-1" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <g transform="translate(-385.24234,-51.887904)" id="spannungsquelle_e" className="five_elements" /*onClick={() => {this.showPopoverAt("spannungsquelle_e")}}*/ style={{ strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <circle r="17.547169" id="circle4-5-9" cy="194.08688" cx="458.12958" style={{ fill: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  <path style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} id="spannungsquelle_e_linie" /*onClick={() => {this.showPopoverAt("spannungsquelle_e")}}*/ d="M 458,214.07532 V 178.53249" />
                </g>
                <path d="M 72.757661,222.9736 V 161.87654" id="path3315-9-1-9" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="M 500.68267,124.75791 V 49.057503" id="path3315-9-1-8" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="m 295.74716,49.397259 h 47.0578" id="path3129-4-8" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path id="path5881-3" d="m 289.36089,109.33354 3.10066,5.36264 -6.20002,7.4e-4 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="m 72.861736,224.53226 c 83.728784,0.11575 161.250454,0.0142 214.525744,0.13001" id="path6655-1" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <path d="M 500.97365,224.44407 V 163.33034" id="path3315-9-1-9-9" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <g transform="matrix(0.8628357,0,0,0.59964829,6.5269824,-227.15643)" id="spule_pfeil" onClick={() => { this.showPopoverAt("spule_windungen") }} style={{ strokeWidth: '5.56093264', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="path3979-4-4" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.56093264', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-1" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.56093264', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <g transform="matrix(0,0.92992512,-0.59964829,0,299.84009,-254.34688)" id="spannungsquelle_e_pfeil" /*onClick={() => {this.showPopoverAt("spannungsquelle_e")}}*/ style={{ strokeWidth: '5.35658121', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="path3979-4-0" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-5" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <g transform="translate(42.766332,-52.149071)" id="spannungsquelle_a" className="five_elements" /*onClick={() => {this.showPopoverAt("spannungsquelle_a")}}*/ style={{ strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <circle r="17.547169" id="circle4-5-9-1" cy="194.08688" cx="458.12958" style={{ fill: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  <path style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} id="path3315-9-3-7-2" d="M 458,214.07532 V 178.53249" />
                </g>
                <g transform="matrix(0,0.92992512,-0.59964829,0,786.35645,-256.31426)" id="spannungsquelle_a_pfeil" /*onClick={() => {this.showPopoverAt("spannungsquelle_a")}}*/ style={{ strokeWidth: '5.35658121', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="path3979-4-0-7" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-5-6" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="6.5884051" y="146.52469" id="spannungsquelle_e_u" /*onClick={() => {this.showPopoverAt("spannungsquelle_e")}}*/>
                  <tspan id="tspan972-6" x="6.5884051" y="146.52469" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>U
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub' }} id="tspan6742">e</tspan>
                  </tspan>
                </text>
                <text style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="539.97443" y="145.94833" id="spannungsquelle_a_u" /*onClick={() => {this.showPopoverAt("spannungsquelle_a")}}*/>
                  <tspan id="tspan972-6-0" x="539.97443" y="145.94833" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>U
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub' }} id="tspan6765">a</tspan>
                  </tspan>
                </text>
              </svg>
            </div>
            <Alert color="danger" id="info_workstate">
              TSS ist aus.
      </Alert>
          </Col>
          <Col md="3">
            {ausgang}
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <div hidden>
              {this.props.renderElement}
              {content_}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          <Button color="danger" onClick={this.toggleCollapse} style={{marginBottom: '1rem'}}>Beschreibung</Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
            <p className="description">
              <p>Eine der wichtigsten Schaltungen zum Thema Leistungselektronik ist der Tiefsetzsteller. In dieser dynamischen Anwendung ist das elektrische Ersatzschaltbild mit einigen Besonderheiten versehen.</p>
              <p>Am Eingang können die Eingangsspannung, der Eingangsstrom und der Tastgrad eingestellt werden. Daraus berechnen sich die Eingangsleistung und die Ausgangsgrößen. Diese erscheinen neben dem Symbol der ausgangsseitigen Spannungsquelle.</p>
              <p>Möchte man nun noch wissen, was innerhalb der Schaltung passiert, kann man per Anklicken der Bauteile Schalter, Diode und Spule sich die Spannung- und Stromverläufe anzeigen lassen.</p>
  <p>Viel Spaß beim Austesten!</p>
              </p>
            </CardBody>
          </Card>
        </Collapse>
            
          </Col>
        </Row>
      </Container>
      
    
    )
  }
}


/*
<button onClick={() => this.handleButton("eingang")}>Input</button>



<Graph
  time={this.state.time}
  strom={this.state.strom}
  alpha={this.state.voltage}
  rate={this.state.rate}
  power={this.state.power}
  part="Is in A"


></Graph>,<Graph
  time={this.state.time}
  strom={this.state.strom}
  alpha={this.state.voltage}
  rate={this.state.rate}
  power={this.state.power}
  part="Ul in V"


></Graph>,<Graph
  time={this.state.time}
  strom={this.state.strom}
  alpha={this.state.voltage}
  rate={this.state.rate}
  power={this.state.power}
  part="Il in A"


></Graph>,
<Graph
  time={this.state.time}
  strom={this.state.strom}
  alpha={this.state.voltage}
  rate={this.state.rate}
  power={this.state.power}
  part="Ud in V"


></Graph>,
<Graph
  time={this.state.time}
  strom={this.state.strom}
  alpha={this.state.voltage}
  rate={this.state.rate}
  power={this.state.power}
  part="Id in A"


></Graph>,
*/

export default BuckConverter;