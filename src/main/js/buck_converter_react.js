import React from 'react';
import ReactDOM from 'react-dom';
//import 'css/bootstrap.min.css'
import { Alert, Row, Col, Container, Popover, Button, PopoverHeader, PopoverBody, Form, FormGroup, FormFeedback, Label, Input, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Graph from "./graph";
//import 'css/BuckConverter.css';

class BuckConverter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dutyCycle: 0,
      dutyCycleTemp: 0,
      current: 0,
      currentTemp: 0,
      voltage: 0,
      voltageTemp: 0,
      power: 0,
      /**
       * The graphs that should be rendered for 
       * the corresponding circuit element
       */
      popoverContent: "svgSwitch",
      /**
       * The circuit element where the popover
       * should be shown
       */
      acceptingElement: "circuit",
      popoverOpen: false,
    
     /**
      *  A variable for the switching intervall
      */
      switchIt: null,
      /**
       * A boolean varibale for the bootstrap modal.
       * @type {boolean}
       */
      modal: false,
      /**
       * A  variable for the state of interactive circuit (on/off)
       * @type {boolean}
       */
      isSwitchedOn: false

    };
    this.togglePopover = this.togglePopover.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleRateChange = this.handleRateChange.bind(this);
    this.handleCurrentChange = this.handleCurrentChange.bind(this);
    this.handleVoltageChange = this.handleVoltageChange.bind(this);
    this.handleParams = this.handleParams.bind(this);
    this.handlePopoverContent = this.handlePopoverContent.bind(this);
    this.resetBuckConverter = this.resetBuckConverter.bind(this);
    this.handleSvgAnimation = this.handleSvgAnimation.bind(this);
    this.resetElectronAnimation = this.resetElectronAnimation.bind(this);
    this.labelGraph = this.labelGraph.bind(this);

  }

  togglePopover() {
    this.setState({
      popoverOpen : !this.state.popoverOpen
  });
}

  toggleModal() {
    this.setState({
      modal : !this.state.modal
    });
  }

  /**
   * Checks if the circuit is switched on, shows the popover
   * at the correspoding element and renders the popover's content
   * Throws an alert if the circuit is not yet switched on.
   * @param {String} element
   */
  showPopoverAt(element) {
    if (this.state.isSwitchedOn === true) {
      this.setState({
        acceptingElement : element
    });
      this.togglePopover();
      this.handlePopoverContent(element);
    } else {
      alert('Please turn on the buck converter first to see the interactive charts.');
    }

  }

/**
 * This function orchestrates the two states of the switched-on converter.
 * 
 * 1) The switch is closed and electricity flows through it, charging the coil. The diode is off.
 * 2) The switch is open and the accumulated electricity from the coil flows only through the diode, lighting it up.
 * 
 * The movement of the electrons is animated. The purpose is educational, an absolute accuracy is excluded.
 *
 */
  flipping() {

    var pathOpen = "m 587.1907,128.48809 19.46984,-8.53849";
    var pathClosed = "m 587.1907,128.48809 19.85288,0.0973";

    var svgSwitchLine = document.getElementById('svgSwitchLine');

    /*
       * The setInterval-function has its own enviromental context.
       * This causes an error when trying to call external functions
       * bound to the "this" keyword (where "this" refers to the whole
       * React context) inside the setInterval-function. That is why the 
       * code of those functions is inserted here manually.
       * This is not so bad as the code is only a handful of lines.
       * However, I realize that it is a suboptimal solution. Then again,
       * it is one I prefer to tweeking additional properties and using external frameworks. 
       */
    if (svgSwitchLine.getAttribute("d") === pathOpen) {
      svgSwitchLine.setAttribute("d", pathClosed);

      {
        /**
         * Resetting the electron animation
         */
        //this.resetElectronAnimation();
        const array_el_path = document.querySelectorAll('.electron_path') || null;

        for (let i = 0; i < array_el_path.length; i++) {
          array_el_path.item(i).classList.add('electron_path_hidden');
          array_el_path.item(i).classList.remove('electron_path');
          array_el_path.item(i).classList.remove('animation_reverse');

        }

        /**
         * Animating the "big circle" when the switch is closed
         */
        //this.handleElectronAnimation(pathClosed);
        let elPathReverse_Regex = new RegExp("el_path_[6-9]|el_path_12");

        for (let i = 1; i < 10; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }

        for (let i = 12; i < 19; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }
      }

      /**
       * "Switching off" the diode
       */

      document.getElementById('path-14').style.stroke = "black";
      document.getElementById('path2524').style.stroke = "black";
      document.getElementById('arrow-6').style.stroke = "black";

    } else {
      svgSwitchLine.setAttribute("d", pathOpen);

      {

        /**
         * Resetting the electron animation
         */

        //this.resetElectronAnimation();


        const array_el_path = document.querySelectorAll('.electron_path') || null;

        for (let i = 0; i < array_el_path.length; i++) {
          array_el_path.item(i).classList.add('electron_path_hidden');
          array_el_path.item(i).classList.remove('electron_path');
          array_el_path.item(i).classList.remove('animation_reverse');

        }

        /**
         * Animating the "small circle" of paths
         */
        //this.handleElectronAnimation(pathOpen);
        let elPathReverse_Regex = new RegExp("el_path_[6-9]");
        for (let i = 1; i < 12; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }

        /**
         * Lighting up the diode
         */
        document.getElementById('path-14').style.stroke = "yellow";
        document.getElementById('path2524').style.stroke = "yellow";

      }
    }
  }

  /**
   * Flips the switch and executes the flipping function in
   * an interval of 1 second.
   * @see {flipping}
   */
  flipSwitch() {

    if (this.state.switchIt == null) {

      this.setState({
        switchIt: setInterval(this.flipping, 1000)
      });
    }

  }

  /**
   * Resets the input values of the buck converter and switches it off
   */
  resetBuckConverter() {
    var pathOpen = "m 587.1907,128.48809 19.46984,-8.53849";

    //The line of the switch
    var svgSwitchLine = document.getElementById('svgSwitchLine');

    //Duty Cycle
    var dutyCycleInput = document.getElementById('D_');

    //Input current 
    var currentInput = document.getElementById('I_e');

    //Input voltage
    var voltageInput = document.getElementById('U_e');

    clearInterval(this.state.switchIt);

    svgSwitchLine.setAttribute("d", pathOpen);

    dutyCycleInput.setAttribute('value', 0);
    dutyCycleInput.removeAttribute('disabled');
    currentInput.setAttribute('value', 0)
    currentInput.removeAttribute('disabled');
    voltageInput.setAttribute('value', 0)
    voltageInput.removeAttribute('disabled');

    document.getElementById('info_workstate').innerHTML = "The buck converter is switched off.";
    document.getElementById('info_workstate').classList.remove("alert-success");
    document.getElementById('info_workstate').classList.add("alert-danger");

    this.resetElectronAnimation();

    document.getElementById('path-14').style.stroke = "black";
    document.getElementById('path2524').style.stroke = "black";


    this.setState({
      dutyCycle: 0,
      dutyCycleTemp: 0,
      current: 0,
      currentTemp: 0,
      voltage: 0,
      voltageTemp: 0,
      power: 0,
      popoverContent: "svgSwitch",
      switchIt: null,
      isSwitchedOn: false
    });
  }


/**
 * Sets the right graphs for the popover at the correspoding circuit element.
 */
  handlePopoverContent(element) {
    this.setState({
      popoverContent: element
    })
  }

/**
 * Handles the input parameters for the converter.
 * If all of them are correct, the converter is switched on.
 */
  handleParams() {

    //Restrictions specified by an electrical engineer.
    if (this.state.currentTemp <= 10 && this.state.currentTemp > 0 && this.state.voltageTemp <= 100 && this.state.voltageTemp > 0 && this.state.dutyCycleTemp <= 1 && this.state.dutyCycleTemp > 0) {

      this.setState({
        current: this.state.currentTemp,
        voltage: this.state.voltageTemp,
        dutyCycle: this.state.dutyCycleTemp,
      });

      document.getElementById("D_").setAttribute("disabled", "");
      document.getElementById("I_e").setAttribute("disabled", "");
      document.getElementById("U_e").setAttribute("disabled", "");



      this.flipSwitch();
      document.getElementById('info_workstate').innerHTML = "The buck converter is switched on!";
      document.getElementById('info_workstate').classList.remove("alert-danger");
      document.getElementById('info_workstate').classList.add("alert-success");


      {
        /**
         * Handling initial electron movement. After that
         * its management occurs in the flipping()-Function.
         * @see {flipping}
         */
        let elPathReverse_Regex = new RegExp("el_path_[6-9]|el_path_12");

        for (let i = 1; i < 12; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }

        document.getElementById('path-14').style.stroke = "yellow";
        document.getElementById('path2524').style.stroke = "yellow";

      }


      this.setState({
        isSwitchedOn: true
      });


    } else {

      alert("ERROR: Handling Params failed.");
    }

  }

  /**
   * Saves the input duty cycle to a temporary variable.
   * @param {Object} event 
   */
  handleRateChange(event) {

    let dutyCycleInput = document.getElementById("D_");
    let formFeedback = document.getElementById("feedback-D_");

    //Restrictions specified by an electrical engineer.
    if (event.target.value > 0 && event.target.value <= 1) {

      dutyCycleInput.classList.remove("is-invalid");
      formFeedback.style.display = "none";

      this.setState({
        dutyCycleTemp: event.target.value
      });
    } else {

      dutyCycleInput.classList.add("is-invalid");
      formFeedback.style.display = "block";

    }
  }

  /**
   * Saves the input current to a temporary variable.
   * @param {Object} event 
   */
  handleCurrentChange(event) {

    let currentInput = document.getElementById("I_e");
    let formFeedback = document.getElementById("feedback-I_e");

    //Restrictions specified by an electrical engineer.
    if (event.target.value > 0 && event.target.value <= 10) {

      currentInput.classList.remove("is-invalid");
      formFeedback.style.display = "none";

      this.setState({
        currentTemp: event.target.value
      });

    } else {
      currentInput.classList.add("is-invalid");
      formFeedback.style.display = "block";
    }
  }

   /**
   * Saves the input voltage to a temporary variable.
   * @param {Object} event 
   */
  handleVoltageChange(event) {

    event.preventDefault();

    let voltageInput = document.getElementById("U_e");
    let formFeedback = document.getElementById("feedback-U_e");

    //Restrictions specified by an electrical engineer.
    if (event.target.value > 0 && event.target.value <= 100) {

      voltageInput.classList.remove("is-invalid");
      formFeedback.style.display = "none";

      this.setState({
        voltageTemp: event.target.value
      });

    } else {
      voltageInput.classList.add("is-invalid");
      formFeedback.style.display = "block";

    }
  }

  resetElectronAnimation() {

    const array_el_path = document.querySelectorAll('.electron_path') || null;

    for (var i = 0; i < array_el_path.length; i++) {
      array_el_path.item(i).classList.add('electron_path_hidden');
      array_el_path.item(i).classList.remove('electron_path');
      array_el_path.item(i).classList.remove('animation_reverse');

    }
  }

  handleElectronAnimation() {

    //el_path[6-9] or 12
    let elPathReverse_Regex = new RegExp("el_path_[6-9]");
    let path = "m 587.1907,128.48809 19.85288,0.0973";

    switch (path) {

      case "m 587.1907,128.48809 19.46984,-8.53849": {

        this.resetElectronAnimation();

        for (let i = 1; i < 12; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }
        break;
      }
      case "m 587.1907,128.48809 19.85288,0.0973": {

        this.resetElectronAnimation();

        for (let i = 1; i < 10; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }

        for (let i = 12; i < 19; i++) {
          let elPath = document.querySelector(`#el_path_${i}`);
          elPath.classList.add('electron_path');
          if (elPathReverse_Regex.test(elPath.id)) {
            elPath.classList.add('animation_reverse');
          }
          elPath.classList.remove('electron_path_hidden');
        }
        break;
      }
      default: {
        this.resetElectronAnimation();
        alert("Error in handleElectronAnimation");
      }
    }
  }

  /**
   * This function creates the animated drawing of
   * the circuit by modifying CSS properties.
   */
  handleSvgAnimation() {

    // Paths
    for (var i = 1; i < 20; i++) {
      if (i === 2) {
        continue;
      }
      let svgPath = document.querySelector(`#path-${i}`);
      let pathLength = svgPath.getTotalLength();
      svgPath.setAttribute("stroke-dasharray", pathLength);
      svgPath.setAttribute("stroke-dashoffset", pathLength);
      svgPath.classList.add("drawing-animation");
    }

    let svgSwitchLine = document.getElementById('svgSwitchLine');
    let pathLength = svgSwitchLine.getTotalLength();
    svgSwitchLine.setAttribute('stroke-dasharray', pathLength);
    svgSwitchLine.setAttribute('stroke-dashoffset', pathLength);
    svgSwitchLine.classList.add('drawing-animation');

    // Arrows
    for (i = 1; i < 8; i++) {

      let svgArrow = document.querySelector(`#arrow-${i}`);
      let pathLength = svgArrow.getTotalLength();
      svgArrow.setAttribute("stroke-dasharray", pathLength);
      svgArrow.setAttribute("stroke-dashoffset", pathLength);
      svgArrow.classList.add("drawing-animation");
    }

    // Points
    for (i = 1; i < 3; i++) {

      let svgPoint = document.querySelector(`#point-${i}`);
      let pathLength = svgPoint.getTotalLength();
      svgPoint.setAttribute("stroke-dasharray", pathLength);
      svgPoint.setAttribute("stroke-dashoffset", pathLength);
      svgPoint.classList.add("drawing-animation");
    }

    for (i = 1; i < 3; i++) {

      let svgPoint = document.querySelector(`#switchPoint-${i}`);
      let pathLength = svgPoint.getTotalLength();
      svgPoint.setAttribute("stroke-dasharray", pathLength);
      svgPoint.setAttribute("stroke-dashoffset", pathLength);
      svgPoint.classList.add("drawing-animation");
    }
  }

/**
 * A simple function that helps create a
 * corresponding label for the popover header.
 * @param {String} name 
 */
  labelGraph(name) {
    switch (name) {
      case "diode": {

        name = "diode";
        break;
      }
      case "switchPoint-1": {

        name = "switch";
        break;
      }
      case "coil": {
        name = "coil";
        break;
      }
      default: {
        name = "undefined";
      }
    }
    return name;
  }

//A native React function
  componentDidMount() {
   
    console.log("REACT started!");

    /** 
     * Getting the length of the first line in the electron cyclic path
     * and applying it to simulate a movement of electrons.
     */
    var el_path = document.querySelector('#path-4');
  
    this.setState({
      el_path_length : el_path.getTotalLength()
  });

    this.handleSvgAnimation();

    window.setInterval( () => {
      let svg = document.getElementById('circuit');
      svg.style.transform = 'scale(1)';
      svg.style.marginTop = "10px";
    }, 1800);

  }

  //A native React function
  componentWillUnmount() {
  
  }


//A native React function
  render() {

    const input = (

      <div className="forms animated">
        <Form>
          <FormGroup>
            <Label for="D_">Duty cycle</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">D =</InputGroupAddon>
              <Input type="number" min="0" max="1" step="0.05" id="D_" name="D_" value={this.state.dutyCycleTemp} onChange={this.handleRateChange} />
            </InputGroup>
            <FormFeedback id="feedback-D_">The value should be part of the interval (0;1]</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="I_e">Input current</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Ie =</InputGroupAddon>
              <Input type="number" min="0" max="10" step="0.1" id="I_e" name="I_e" value={this.state.currentTemp} onChange={this.handleCurrentChange} />
            </InputGroup>
            <FormFeedback id="feedback-I_e">The value should be part of the interval (0;10]</FormFeedback>

          </FormGroup>
          <FormGroup>
            <Label for="U_e">Input voltage</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Ue =</InputGroupAddon>
              <Input type="number" step="10" id="U_e" name="U_e" value={this.state.voltageTemp} onChange={this.handleVoltageChange} />
            </InputGroup>
            <FormFeedback id="feedback-U_e">The value should be part of the interval (0;100]</FormFeedback>

          </FormGroup>
          <FormGroup>
            <Label for="P_e">Input power</Label>
            <p><strong>Pe ≈ {(this.state.currentTemp * this.state.voltageTemp).toFixed(2)} </strong></p>
          </FormGroup>
        </Form>

        <Button outline color="success" onClick={this.handleParams}>Start</Button>
        <span> </span>
        <Button outline color="danger" onClick={this.resetBuckConverter}>Stop</Button>
      </div>
    );

    const diode = (
      <div>
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Ud in V">
        </Graph>,
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Id in A">
        </Graph>
      </div>
    );

    const svgSwitch = (
      <div>
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Us in V">
        </Graph>,
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Is in A">
        </Graph>
      </div>
    );
    const coil = (

      <div>
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Ul in V">
        </Graph>,
        <Graph
          current={this.state.current}
          voltage={this.state.voltage}
          dutyCycle={this.state.dutyCycle}
          power={this.state.power}
          part="Il in A">
        </Graph>
      </div>
    );

    const output = (
      <div className="forms animated">
        <Label for="I_e">Output voltage</Label>
        <p><strong>Ua ≈ {(this.state.voltage * this.state.dutyCycle).toFixed(2)}</strong></p>

        <Label for="P_e">Output power</Label>
        <p><strong>Pa ≈ {((this.state.voltage * this.state.dutyCycle).toFixed(2)*this.state.current).toFixed(2)}</strong></p>
        {/*<p><strong>Pa = </strong>{Math.round(this.state.voltage * (this.state.current / 10), 2)}</p>*/}
      </div>
    );

     let content;
    
    switch (this.state.popoverContent) {
      case "diode": {

        content = diode
        break;
      }
      case "switchPoint-1": {

        content = svgSwitch;
        break;
      }
      case "coil": {
        content = coil;
        break;
      }
      default: {
        content = input;
      }
    }

    return (

      <Container className="grid">
        <Row>
          <Col md="3">
            {input}
          </Col>
          <Col md="6">

            <div className="the_wrapper">
              <Popover placement={"bottom"} isOpen={this.state.popoverOpen} target={this.state.acceptingElement} toggle={this.togglePopover}>
                <PopoverHeader>Chart <span style={{ fontStyle: 'italic' }}>({this.labelGraph(this.state.acceptingElement)})</span></PopoverHeader>
                <PopoverBody>{content}</PopoverBody>
              </Popover>

              <svg className="svgOnLoadState" viewBox="0 0 572 250" id="circuit">

                {/* <path id="path4771" d="M 0,0 5,-5 -12.5,0 5,5 Z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '1.00000003pt', strokeOpacity: 1 }} transform="matrix(-0.4,0,0,-0.4,-4,0)" /> */}
                <marker orient="auto" refY={0} refX={0} id="Arrow2Lend" style={{ overflow: 'visible' }}>
                  <path id="path4783" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '0.625', strokeLinejoin: 'round', strokeOpacity: 1 }} d="M 8.7185878,4.0337352 -2.2072895,0.01601326 8.7185884,-4.0017078 c -1.7454984,2.3720609 -1.7354408,5.6174519 -6e-7,8.035443 z" transform="matrix(-1.1,0,0,-1.1,-1.1,0)" />
                </marker>
                <marker orient="auto" refY={0} refX={0} id="Arrow1Send" style={{ overflow: 'visible' }}>
                  <path id="path4777" d="M 0,0 5,-5 -12.5,0 5,5 Z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '1.00000003pt', strokeOpacity: 1 }} transform="matrix(-0.2,0,0,-0.2,-1.2,0)" />
                </marker>

                <path className="electron_path_hidden" id="el_path_10" d="m 289.65918,218.56734 -0.27392,-59.28422" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />
                <path id="path-13" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} d="m 289.65918,218.56734 -0.27392,-59.28422" />
                <g id="diode" className="btn hov five_elements" transform="translate(-4.4843756,-3.9073454)" onClick={() => { this.showPopoverAt("diode") }}>
                  <path id="path-14" d="m 293.87046,131.34004 -14.17322,28.62235 h 28.34644 z" style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeMiterlimit: 4, strokeOpacity: 1 }} />
                  <path d="M 308.04368,131.34002 H 279.69724" id="path2524" style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>

                <path className="electron_path_hidden" id="el_path_9" d="m 296.12425,224.26924 c 79.82361,0.11575 153.7296,0.0142 204.52009,0.13001" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <path d="m 296.12425,224.26924 c 79.82361,0.11575 153.7296,0.0142 204.52009,0.13001" id="path-12" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />
                <path d="m 292.57191,224.88953 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="point-2" style={{ display: 'inline', overflow: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, marker: 'none' }} />

                <path className="electron_path_hidden" id="el_path_11" d="M 289.38608,123.64256 V 55.319164" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <path id="path-15" d="M 289.38608,123.64256 V 55.319164" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path d="m 292.57191,48.889533 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="point-1" style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, marker: 'none' }} />

                <path d="M 74.487831,48.889533 H 159.17062" id="el_path_16" className="electron_path_hidden" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <path d="M 74.487831,48.889533 H 159.17062" id="path-1" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                <g transform="matrix(-1,0,0,1,498.4019,-68.039617)" id="g3309" style={{ display: 'inline', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                <text className="animated" x="402.83884" y="82.402435" id="coil_text_l" onClick={() => { this.showPopoverAt("coil") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="402.83884" y="82.402435" id="tspan3700" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>L</tspan>
                </text>
                <text x="158.94281" y="35.092113" id="switch_s" className="btn hov animated" onClick={() => { this.showPopoverAt("switchPoint-1") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="158.94281" y="35.092113" id="tspan3726" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>S</tspan>
                </text>
                <text className="animated" x="248.85667" y="189.86465" id="diode_text_d" onClick={() => { this.showPopoverAt("diode") }} style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', fontFamily: '"Bitstream Vera Sans"', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan x="248.85667" y="189.86465" id="tspan3730" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>D</tspan>
                </text>
                <g transform="matrix(0,-0.70694549,0.59964829,0,62.21968,450.65963)" id="diode_pfeil" onClick={() => { this.showPopoverAt("diode") }} style={{ strokeWidth: '6.14354038', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="arrow-5" style={{ fill: 'none', stroke: '#000000', strokeWidth: '6.14354038', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '6.14354038', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <text id="text918" y="-12.268635" x="329.49225" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <tspan y="12.060173" x="329.49225" id="tspan916" />
                </text>

                <path id="el_path_17" className="electron_path_hidden" d="m 587.1907,128.48809 19.85288,0.0973" transform="matrix(1.4422122,0,0,1.3433605,-678.02041,-123.63068)" style={{ fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <g transform="matrix(1.4422122,0,0,1.3433605,-678.02041,-123.63068)" id="svgSwitch" className="btn hov five_elements" onClick={() => { this.showPopoverAt("switchPoint-1") }} style={{ display: 'inline', strokeWidth: '2.87375093', strokeMiterlimit: 4, strokeDasharray: 'none' }}>

                  <path d="m 587.1907,128.48809 19.46984,-8.53849" id="svgSwitchLine" onMouseOver={() => { document.getElementById("svgSwitch").focus() }} style={{ fill: 'none', strokeWidth: '2.87375093', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                </g>
                <flowroot id="flowRoot924" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} transform="translate(-58.168609,-501.29296)">
                  <flowregion id="flowRegion926" style={{ fontSize: '26.66666603px', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                    <rect id="rect928" width="70.896347" height="56.789898" x="89.93042" y="143.2101" style={{ fontSize: '26.66666603px', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  </flowregion>
                  <flowpara id="flowPara930" />
                </flowroot>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="91.357391" y="33.416122" id="text934">
                  <tspan id="tspan932" x="91.357391" y="33.416122" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6671">e</tspan>
                  </tspan>
                </text>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="426.07886" y="29.132351" id="text940">
                  <tspan id="tspan938" x="426.07886" y="29.132351" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', lineHeight: '33.33333206px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6700">L</tspan>
                    <tspan style={{ fontSize: '18.66666603px', lineHeight: '33.33333206px' }} id="tspan6712">= </tspan>i
            <tspan style={{ fontSize: '64.99999762%', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6665">a</tspan>
                    <tspan style={{ fontSize: '26.66666603px', lineHeight: '33.33333206px', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan942"> </tspan>
                  </tspan>
                </text>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="357.3573" y="15.828125" id="coil_text_u">
                  <tspan id="tspan948" x="357.3573" y="15.828125" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: '"arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>u
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6702">L</tspan>
                  </tspan>
                </text>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="327.30688" y="163.05183" id="diode_text_u">
                  <tspan id="tspan954" x="327.30688" y="163.05183" style={{ fontStyle: 'italic', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'Arial', InkscapeFontSpecification: '"Arial Italic"', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>u
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6667">D</tspan>
                  </tspan>
                </text>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="247.78865" y="121.72112" id="diode_text_i" onClick={() => { this.showPopoverAt("diode") }}>
                  <tspan id="tspan972" x="247.78865" y="121.72112" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>i
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} id="tspan6669">D</tspan>
                  </tspan>
                </text>
                <path id="arrow-1" d="m 120.49826,48.789703 -5.36301,3.10001 v -6.20002 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeOpacity: 1 }} />
                <path id="arrow-3" d="m 444.12465,49.02474 -5.36301,3.10001 v -6.20002 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path d="M 206.61741,49.057503 H 283.9603" id="el_path_18" className="electron_path_hidden" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <path d="M 206.61741,49.057503 H 283.9603" id="path-3" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />
                <path d="m 206.57191,48.889533 a 3.185835,3.1858288 0 1 1 -6.37167,0 3.185835,3.1858288 0 1 1 6.37167,0 z" id="switchPoint-2" style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />
                <path d="m 168.83316,48.975153 a 3.1858315,3.1858253 0 1 1 -6.37166,0 3.1858315,3.1858253 0 1 1 6.37166,0 z" id="switchPoint-1" className="btn hov five_elements" onClick={() => { this.showPopoverAt("switchPoint-1") }} style={{ display: 'inline', overflow: 'visible', visibility: 'visible', fill: '#000000', fillOpacity: 1, fillRule: 'nonzero', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1, marker: 'none' }} />

                <g transform="matrix(0.91773158,0,0,0.76724371,144.30629,-16.863541)">

                  <path className="electron_path_hidden" id="el_path_2" transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -223.98783,-78.568224 a 11.213235,15.640902 0 0 1 -5.12986,14.263377 11.213235,15.640902 0 0 1 -11.4332,0.56096 11.213235,15.640902 0 0 1 -5.83567,-13.725361" style={{ fill: 'none', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length }} />
                  <path className="electron_path_hidden" id="el_path_3" transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -246.38655,-77.469248 a 11.213235,15.640902 0 0 1 -5.12987,14.263377 11.213235,15.640902 0 0 1 -11.43319,0.56096 11.213235,15.640902 0 0 1 -5.83568,-13.725361" style={{ fill: 'none', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length }} />
                  <path className="electron_path_hidden" id="el_path_4" transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -268.7853,-76.370272 a 11.213235,15.640902 0 0 1 -5.05533,14.19609 11.213235,15.640902 0 0 1 -11.35125,0.745296 11.213235,15.640902 0 0 1 -5.98899,-13.470945" style={{ fill: 'none', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length }} />

                </g>

                <g id="coil" className="btn hov five_elements" onClick={() => { this.showPopoverAt("coil") }} style={{ strokeWidth: '4.76689386', strokeMiterlimit: 4, }} transform="matrix(0.91773158,0,0,0.76724371,144.30629,-16.863541)">
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -223.98783,-78.568224 a 11.213235,15.640902 0 0 1 -5.12986,14.263377 11.213235,15.640902 0 0 1 -11.4332,0.56096 11.213235,15.640902 0 0 1 -5.83567,-13.725361" id="path-5" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4 }} />
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -246.38655,-77.469248 a 11.213235,15.640902 0 0 1 -5.12987,14.263377 11.213235,15.640902 0 0 1 -11.43319,0.56096 11.213235,15.640902 0 0 1 -5.83568,-13.725361" id="path-6" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4 }} />
                  <path transform="matrix(-0.99888884,-0.04712837,0.04637278,-0.9989242,0,0)" d="m -268.7853,-76.370272 a 11.213235,15.640902 0 0 1 -5.05533,14.19609 11.213235,15.640902 0 0 1 -11.35125,0.745296 11.213235,15.640902 0 0 1 -5.98899,-13.470945" id="path-7" style={{ fill: 'none', strokeWidth: '4.76689482', strokeMiterlimit: 4 }} />
                </g>

                <path className="electron_path_hidden" id="el_path_5" d="m 410.7022,49.057503 h 88.77805" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <path d="m 410.7022,49.057503 h 88.77805" id="path-8" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path id="el_path_15" className="electron_path_hidden" d="M 72.757661,124.21935 V 48.859807" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <path id="path-19" d="M 72.757661,124.21935 V 48.859807" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path id="el_path_14" className="electron_path_hidden" transform="translate(-385.24234,-51.887904)" d="M 458,214.07532 V 178.53249" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <g transform="translate(-385.24234,-51.887904)" className="five_elements" style={{ strokeWidth: 4, strokeMiterlimit: 4, }}>
                  <circle className="animated" r="17.547169" id="circle4-5-9" cy="194.08688" cx="458.12958" style={{ fill: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />

                  <path id="path-18" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} d="M 458,214.07532 V 178.53249" />
                </g>


                <path id="el_path_13" className="electron_path_hidden" d="M 72.757661,222.9736 V 161.87654" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <path id="path-17" d="M 72.757661,222.9736 V 161.87654" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path className="electron_path_hidden" id="el_path_6" d="M 500.68267,124.75791 V 49.057503" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <path d="M 500.68267,124.75791 V 49.057503" id="path-9" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />


                {/*Second path for electron animation. Same coordinates */}
                <path d="m 295.74716,49.397259 h 47.0578" id="el_path_1" className="electron_path_hidden" style={{ display: 'inline', fill: 'none', stroke: '#02b3e4', strokeWidth: 7, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />
                {/**------- */}
                <path d="m 295.74716,49.397259 h 47.0578" id="path-4" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path id="arrow-6" d="m 289.36089,109.33354 3.10066,5.36264 -6.20002,7.4e-4 z" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: 4, strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path id="el_path_12" className="electron_path_hidden" d="m 72.861736,224.53226 c 83.728784,0.11575 161.250454,0.0142 214.525744,0.13001" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, strokeDashoffset: this.state.el_path_length }} />

                <path id="path-16" d="m 72.861736,224.53226 c 83.728784,0.11575 161.250454,0.0142 214.525744,0.13001" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />

                <path className="electron_path_hidden" id="el_path_8" d="M 500.97365,224.44407 V 163.33034" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <path d="M 500.97365,224.44407 V 163.33034" id="path-11" style={{ display: 'inline', fill: 'none', stroke: '#000000', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} />
                <g transform="matrix(0.8628357,0,0,0.59964829,6.5269824,-227.15643)" id="coil_arrow" onClick={() => { this.showPopoverAt("coil") }} style={{ strokeWidth: '5.56093264', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="arrow-2" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.56093264', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-1" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.56093264', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <g transform="matrix(0,0.92992512,-0.59964829,0,299.84009,-254.34688)" style={{ strokeWidth: '5.35658121', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="arrow-7" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-5" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>

                <path className="electron_path_hidden" id="el_path_7" d="M 458,214.07532 V 178.53249" transform="translate(42.766332,-52.149071)" style={{ display: 'inline', fill: 'none', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDashoffset: this.state.el_path_length, strokeOpacity: 1 }} />

                <g transform="translate(42.766332,-52.149071)" className="five_elements" style={{ strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <circle className="animated" r="17.547169" id="circle4-5-9-1" cy="194.08688" cx="458.12958" style={{ fill: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} />
                  <path id="path-10" style={{ display: 'inline', fill: 'none', strokeWidth: 4, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1 }} d="M 458,214.07532 V 178.53249" />
                </g>
                <g transform="matrix(0,0.92992512,-0.59964829,0,786.35645,-256.31426)" style={{ strokeWidth: '5.35658121', strokeMiterlimit: 4, strokeDasharray: 'none' }}>
                  <path d="m 454.5806,426.99859 -61.35225,0.0896" id="arrow-4" style={{ fill: 'none', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeOpacity: 1, markerStart: 'none' }} />
                  <path d="m 458.22835,427.08814 -8.22706,-3.58226 c 0.7469,1.44954 0.71399,5.60838 -0.16693,7.08465 z" id="path3981-2-5-6" style={{ fill: '#000000', fillOpacity: 1, fillRule: 'evenodd', stroke: '#000000', strokeWidth: '5.35658121', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
                </g>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="6.5884051" y="146.52469" id="spannungsquelle_e_u">
                  <tspan id="tspan972-6" x="6.5884051" y="146.52469" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>U
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub' }} id="tspan6742">e</tspan>
                  </tspan>
                </text>
                <text className="animated" style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '26.66666603px', lineHeight: '1.25', fontFamily: 'sans-serif', letterSpacing: 0, wordSpacing: 0, fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }} x="539.97443" y="145.94833" >
                  <tspan id="tspan972-6-0" x="539.97443" y="145.94833" style={{ fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'normal', fontStretch: 'normal', fontSize: '26.66666603px', fontFamily: 'arial', InkscapeFontSpecification: 'arial', strokeWidth: 4, strokeMiterlimit: 4, strokeDasharray: 'none' }}>U
            <tspan style={{ fontSize: '64.99999762%', baselineShift: 'sub' }} id="tspan6765">a</tspan>
                  </tspan>
                </text>
              </svg>
            </div>

            <Alert className="animated" color="danger" id="info_workstate">
              The buck converter is switched off.
            </Alert>
            <Button className="animated" color="danger" onClick={this.toggleModal} style={{ display:'block', margin: 'auto' }}>Description</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
              <ModalHeader toggle={this.toggleModal}>Buck Converter</ModalHeader>
              <ModalBody>
                <p>This web application provides a dynamic representation of a buck converter – an essential electronic circuit which lowers voltage from its input to its output. Users can specify input parameters like the duty cycle, the current and the voltage. The input and output power are calculated automatically.</p>
                <p>Furthermore, the real-time changes of the voltage and the current as measured at the <strong>switch</strong>, <strong>the diode</strong> and <strong>the coil</strong> can be observed by clicking on one of these elements when the buck converter is switched on.</p>
                <p>The movement of the electrons is drawn according to the state of the converter (switch open or closed).</p>
              </ModalBody>
            </Modal>
          </Col>
          <Col md="3">
            {output}
          </Col>
        </Row>
      </Container>


    )
  }
}



ReactDOM.render(<BuckConverter />, document.getElementById('react'));

