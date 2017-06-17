import React from 'react';
import { connect } from 'react-redux';
import { Tab, Grid, Row, Col , Nav, NavItem, Navbar,NavDropdown, Modal, Button, MenuItem, Radio,FormGroup } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';
import BuyIco from './tokens/buy';
import { ToSmodal } from './info/ToS';
import logo from '../img/logo.png';

const Render = ({...props}) => (
  <Grid>
    <ToSmodal />
    <Tab.Container id="tabs-with-dropdown" defaultActiveKey="start">
      <Row>
        <div>
          <Navbar collapseOnSelect fixedTop>
              <Col sm={5}>
                <a href="/">
                  <img className="col-md-4" src={logo} alt="TokenMint"  />
                </a>
              </Col>
              <Col sm={7}>
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
