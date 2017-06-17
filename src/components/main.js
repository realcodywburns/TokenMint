import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Grid, Row, Col , Nav, NavItem, NavDropdown, MenuItem, Radio,FormGroup } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';
import BuyIco from './tokens/buy';
import ToSmodal from './info/ToS';
import logo from '../img/logo.png';

const Render = ({...props}) => (
  <Grid id="main">
      <Row>
          <Col sm={4}>
              <img className="col-md-6" onClick={props.goHome} src={logo} alt="TokenMint"  />
          </Col>
          <Col sm={8}>
              <Nav  pullRight bsStyle="tabs">
                <NavItem onClick={() => props.handleSelect("start")}>
                  Getting Started
                </NavItem>
                <NavItem onClick={() => props.handleSelect("token")}>
                  Mint a Token
                </NavItem>
                <NavItem onClick={() => props.handleSelect("ico")}>
                  Launch an ICO
                </NavItem>
                <NavItem onClick={() => props.handleSelect("buy")}>
                  Token Browser
                </NavItem>
                <NavItem onClick={() => props.handleSelect("wallet")}>
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
          </Col>
    </Row>
    <Row>
      <Col sm={12}>
        <Tabs
          defaultActiveKey={"start"}
          activeKey={props.tab}>
          <Tab eventKey={"start"}>
            <Information />
          </Tab>
          <Tab eventKey={"token"}>
            <CreateToken />
          </Tab>
          <Tab eventKey={"ico"}>
            <LaunchIco />
          </Tab>
          <Tab eventKey={"buy"}>
            <BuyIco />
          </Tab>
          <Tab eventKey={"wallet"}>
            <OpenWallet />
          </Tab>
        </Tabs>
      </Col>
  </Row>
  <ToSmodal />
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
        },
        goHome: () => {
            dispatch(gotoTab('start'));
        }
    })
)(Render);

export default Main;
