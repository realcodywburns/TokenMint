import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Grid, Row, Col } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';

const Header = ({ logo }) => (
    <div className="App-header">
      <img src={process.env.PUBLIC_URL + "/img/logo.png"} alt="logo" />
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
                <Tabs defaultActiveKey={"wallet"} 
                    activeKey={props.tab} 
                    onSelect={props.handleSelect} 
                    id="tokenTabs">
                    <Tab eventKey={"start"} title="Getting Started">
                        <Information />
                    </Tab>
                    <Tab eventKey={"token"} title="Create a Token">
                        <CreateToken />
                    </Tab>
                    <Tab eventKey={"ico"} title="Launch an ICO">
                        <LaunchIco />
                    </Tab>
                    <Tab eventKey={"buy"} title="Buy Tokens">
                        <h1> ICO / Crowdsale Browser coming soon... </h1>
                    </Tab>
                    <Tab eventKey={"wallet"} title="Wallet Manager">
                        <OpenWallet />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
        <hr />
        <footer>
            <p>Built for Ethereum Classic, 2017</p>
        </footer>
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
