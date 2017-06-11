import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, Tabs, Tab, Grid, Row, Col  } from 'react-bootstrap';
import { gotoTab } from '../store/tabActions';
import CreateToken from './tokens/create';
import { Information } from './tokens/info';
import LaunchIco from './tokens/launch';
import OpenWallet from './wallet/open';

const Header = ({ logo }) => (

    <Col xs={3}>
      <a href="/">
        <img className="img-responsive" src={process.env.PUBLIC_URL + "/img/logo.png"} alt="logo"  />
      </a>
     </Col>

);



const Render = ({...props}) => (
    <Grid>
      <Row>
      <Header />
      </Row>
      <Row>
           <Col xs={12} >
                  <Tabs defaultActiveKey={"start"}
                    activeKey={props.tab}
                    onSelect={props.handleSelect}
                    id="tokenTabs">
                    <Tab eventKey={"start"} title="Getting Started">
                    <hr />
                      <Information />
                    </Tab>
                    <Tab eventKey={"token"} title="Mint a Token">
                        <CreateToken />
                    </Tab>
                    <Tab eventKey={"ico"} title="Launch an ICO">
                        <LaunchIco />
                    </Tab>
                    <Tab eventKey={"buy"} title="Token Trading">
                        <h1> ICO / Crowdsale Browser coming soon... </h1>
                    </Tab>
                    <Tab eventKey={"wallet"} title="Wallet Manager">
                        <OpenWallet />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
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
