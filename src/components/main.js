import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Container, Row, Col, Image, Nav, NavItem } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import TokenList from './tokens/list';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import ManageWallet from './wallet/wallet';
import ToSmodal from './info/ToS';
import logo from '../img/logo.png';

const Render = ({...props}) => (
  <Container id="main">
      <Row>
          <Col md={2} sm={4} xs={6}>
              <Image responsive={true} onClick={props.goHome} src={logo} alt="TokenMint"  />
          </Col>
          <Col sm={8} md={10}>
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
                <NavItem onClick={() => props.handleSelect("browse")}>
                  Token Browser
                </NavItem>
                <NavItem onClick={() => props.handleSelect("wallet")}>
                  Wallet Manager
                </NavItem>
              </Nav>
          </Col>
    </Row>
    <Row>
      <Col sm={12}>
        <Tabs
          id="tokenTabs"
          defaultActiveKey={"start"}
          activeKey={props.tab}
          onSelect={props.handleSelect}>
          <Tab eventKey={"start"}>
            <Information />
          </Tab>
          <Tab eventKey={"token"}>
            <CreateToken />
          </Tab>
          <Tab eventKey={"ico"}>
            <LaunchIco />
          </Tab>
          <Tab eventKey={"browse"}>
            <TokenList />
          </Tab>
          <Tab eventKey={"wallet"}>
            <ManageWallet />
          </Tab>
        </Tabs>
      </Col>
  </Row>
  <ToSmodal />
</Container>

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
