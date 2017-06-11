import React from 'react';
import { connect } from 'react-redux';
import { Tab, Grid, Row, Col , Nav, NavItem, Navbar, Modal, Button, Popover, Tooltip } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';

const welcomeModal = React.createClass({
  getInitialState() {
    return { showModal: true };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    );

    return (
      <div>
        <p>Click to get the full Modal experience!</p>

        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.open}
        >
          Launch demo modal
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            Welcome
          </Modal.Header>
          <Modal.Body>
            <h4>Welcome to TokenMint!</h4>
            <br /> This is simple to use token and ICO generator created for use with the Ethereum blockchains ETC & ETH. The purpose of this generator is to make it simple for users to create their own token and crowdsale using smart contracts. Tokens are effectively a virtual currency created and secured on top of the Ethereum blockchain. An ICO is an Intial Coin Offering. At a designated price, users can offer their tokens at a set price in either ETC or ETH. This can be useful for raising funds in a crowdsale. Tokens can be used in a variety of ways, user rewards, rebates, virtual currencies, or as a voting mechanism with a Decentralized Autonomous Organization (DAO).
            <hr />
            <h5 class="text-align: center">We are currently still under construction but feel free to look around!</h5>
          </Modal.Body>
          <Modal.Footer>
        <Button onClick={this.close}>Close</Button>
    </Modal.Footer>
   </Modal>
  </div>
  );
}
});


const Render = ({...props}) => (
  <Grid>
  <welcomeModal />
  <Tab.Container id="tabs-with-dropdown" defaultActiveKey="start">
  <Row className="clearfix">
    <Col sm={12}>
    <Navbar collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>

          <a href="/">
            <img className="col-sm-6" src={process.env.PUBLIC_URL + "/img/logo.png"} alt="logo"  />
          </a>

        </Navbar.Brand>
      </Navbar.Header>
      <Navbar.Collapse>
      <Nav  pullRight bsStyle="tabs">
        <NavItem eventKey="start">
        Getting Started
        </NavItem>
        <NavItem eventKey="token">
        Mint a Token
        </NavItem>
        <NavItem eventKey="ico">
        Launch an ICO
        </NavItem>
        <NavItem eventKey="buy">
        Token Trading
        </NavItem>
        <NavItem eventKey="wallet">
        Wallet Manager
        </NavItem>
        </Nav>
        </Navbar.Collapse>
        </Navbar>
    </Col>
    <Col sm={12}>
        <Tab.Content animation
          defaultActiveKey={"start"}
          activeKey={props.tab}
          onSelect={props.handleSelect}
          id="tokenTabs">
          <hr />
          <Tab.Pane eventKey={"start"}>
            <Information />
          </Tab.Pane>
          <Tab.Pane eventKey={"token"}>
            <CreateToken />
          </Tab.Pane>
          <Tab.Pane eventKey={"ico"}>
            <LaunchIco />
          </Tab.Pane>
          <Tab.Pane eventKey={"buy"}>
            <h1> ICO / Crowdsale Browser coming soon... </h1>
          </Tab.Pane>
          <Tab.Pane eventKey={"wallet"}>
            <OpenWallet />
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
<hr />

</Grid>
);

const Main = connect(
    (state, ownProps) => ({
        tab: state.tab.get('id'),
        params: state.tab.get('params'),
    }),
    (dispatch, ownProps) => ({
        handleSelect: (key) => {
            dispatch(gotoTab(key));
        }
    })
)(Render);

export default Main;
