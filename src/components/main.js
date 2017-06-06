import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Grid, Row, Col } from 'react-bootstrap';
import CreateToken from './tokens/create';
import Information from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';

const Header = ({ logo }) => (
    <div className="App-header">
      <img src="/img/logo.png" alt="logo" />
      <h2>Token Mint</h2>
    </div>
);

const Render = ({...props}) => (
    <Grid>
        <Row>
            <Col xs={12}>
            <Header/>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Tabs defaultActiveKey={5} id="tokenTabs">
                    <Tab eventKey={1} title="Getting Started">
                        <Information />
                    </Tab>
                    <Tab eventKey={2} title="Create a Token">
                        <CreateToken />
                    </Tab>
                    <Tab eventKey={3} title="Launch an ICO">
                        <LaunchIco />
                    </Tab>
                    <Tab eventKey={4} title="Buy Tokens">ICO / Crowdsale Browser</Tab>
                    <Tab eventKey={5} title="Wallet Manager">
                        <OpenWallet />
                    </Tab>
                    <Tab eventKey={6} title="Exchange">Token Market</Tab>
                </Tabs>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <div id="footer">
                    Built for Ethereum Classic, 2017
                </div>
            </Col>
        </Row>
    </Grid>
);

const Main = connect(
    (state, ownProps) => ({

    }),
    (dispatch, ownProps) => ({

    })
)(Render);

export default Main;
