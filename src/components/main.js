import React from 'react';
import { connect } from 'react-redux';
import { Tab, Grid, Row, Col , Nav, NavItem, Navbar,NavDropdown, Modal, Button, Popover, Tooltip, MenuItem, Radio,FormGroup } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';
import BuyIco from './tokens/buy';

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
    return (
      <div>
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
    <Row>
    <div>
      <Navbar collapseOnSelect fixedTop>
          <Col sm={4}>
          <Navbar.Brand>
            <a href="/">
              <img className="col-sm-8" src={process.env.PUBLIC_URL + "/img/logo.png"} alt="TokenMint"  />
            </a>
          </Navbar.Brand>
          </Col>
          <Col sm={8}>
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
                Token Browser
              </NavItem>
              <NavItem eventKey="wallet">
                Wallet Manager
              </NavItem>
              { /*<NavDropdown eventKey={3} title={<i className="fa fa-cogs"></i>} id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Your Wallets</MenuItem>
                <MenuItem eventKey={3.2}>Add Wallet</MenuItem>
                <MenuItem eventKey={"Wallets"}>Manage Wallets</MenuItem>
                <MenuItem divider />
                 <FormGroup>
                 {' '}
                  <Radio name="radioGroup" inline>
                  ETC
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline>
                  ETH
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline>
                  RSK
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline>
                  Local
                  </Radio>
                  {' '}
                </FormGroup>
              </NavDropdown>*/ }
            </Nav>
        </Navbar.Collapse>
        </Col>
    </Navbar>
      </div>

      <div id="main">
      <Col sm={12}>
        <Tab.Content animation
          defaultActiveKey={"start"}
          activeKey={props.tab}
          onSelect={props.handleSelect}
          id="tokenTabs">
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
            <BuyIco />
          </Tab.Pane>
          <Tab.Pane eventKey={"wallet"}>
            <OpenWallet />
          </Tab.Pane>
        </Tab.Content>
        </Col>
        </div>
      </Row>
    </Tab.Container>
  <Col sm={12}>
      <Navbar collapseOnSelect fixedBottom>
      </Navbar>
  </Col>
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
