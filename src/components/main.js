import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Grid, Row, Col } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';


const Header = ({ logo }) => (
    <div class="navbar navbar-inverse set-radius-zero" >
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">
                    <img className="img-responsive" src={process.env.PUBLIC_URL + "/img/logo.png"} alt="logo" />
                </a>
            </div>
        </div>
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
        <section class="footer-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                       &copy; 2017 TokenMint.io |<a href="http://ethereumclassic.org/"  rel="noopener noreferrer" target="_blank"  > Designed for Ethereum Classic</a> 
                    </div>

                </div>
            </div>
        </section>
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
