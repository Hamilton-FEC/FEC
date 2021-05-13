import React from 'react';
import {
  MdExpandMore,
  MdExpandLess,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from 'react-icons/md';

import { BsSearch } from 'react-icons/bs'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
    this.handleArrowClick = this.handleArrowClick.bind(this);
  }

  componentDidMount() {
    window.setInterval(() => {
      this.handleArrowClick()
    }, 4500)
  }

  handleArrowClick() {
    this.setState({ show: !this.state.show });
  }

  render() {
    let style = {paddingRight: "35px", fontWeight: "bold",}
    const { show } = this.state;
    return (
      <div className="main-header">
        <div className="main-logo">HAMILTON</div>
        <div id="mystuff">
        <span id="main-categories"><span style={style}>New Releases</span><span style={style}>Mens</span> <span style={style}>Women</span> <span style={style}>Children</span>  <b>Sale</b> </span>
        </div>
        <div className="main-sale">
          <span>
            {/* <MdKeyboardArrowLeft id="main-header-left" onClick={this.handleArrowClick} /> */}

            {show && <span id="main-sale-text">FREE SHIPPING FOR 60 DAYS!</span>}

            {!show && <span id="main-sale-text">HURRY BEFORE SALE ENDS!</span>}
            {/* <MdKeyboardArrowRight id="main-header-right"onClick={this.handleArrowClick} /> */}
            <span id="main-search"><BsSearch/> <input id="main-searchbar" placeholder="Search"></input></span>
          </span>
        </div>
      </div>
    );
  }
}

export default Header;
