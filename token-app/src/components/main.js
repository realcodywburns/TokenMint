import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, Grid, Row, Col, Button } from 'react-bootstrap';
import Screen from './screen';

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
                <Screen id="body"/>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <div id="footer">
                    Ethereum Classic, 2017
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
