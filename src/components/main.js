import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, Tabs, Tab, Grid, Row, Col , Nav, NavItem, Navbar } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';




const Render = ({...props}) => (
    <Grid>
  <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
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
