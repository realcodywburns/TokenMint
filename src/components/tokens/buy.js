import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { BuyTokenModal } from '../transaction/modals';
import { generateBuyIco, loadCrowdSale } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { gotoTab } from '../../store/tabActions';
import { hexToDecimal } from '../../lib/convert';

const DefaultGas = "0x94da7";

class BuyForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.gotoToken = this.gotoToken.bind(this);
    this.loadSale = this.loadSale.bind(this);
    this.submitTx = this.submitTx.bind(this);
    this.state = {
      modalShow: false, 
      showTx: false,
      gas: DefaultGas,
      tx: {},
    };
  }

  gotoToken() {
    this.props.gotoToken();
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  loadSale() {
    this.props.loadSale(this.state.address);
  }

  buyIco() {
    const data = {
      quantity: this.state.quantity
    }
    this.setState({ modalShow: true, 
                    showTx: false
                  });
    this.props.buyIco(data, this.props.wallet)
      .then((result) => {
        this.setState({ modalShow: true,
                        showTx: true,
                        tx: result
                      });
      })
  }


  submitTx() {
    this.props.sendTransaction(
        this.state.tx.signedTx, 
        this.state,
        this.props.wallet.getAddressString()
        ).then((result) => {
          this.setState({ modalShow: false, showTx: false })
      })
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });

    return (
      <Grid>
        {!this.props.ico && 
          <Row>
            <Col>
              <h1> View Your Crowdsale </h1>
                <FormGroup
                  controlId="address"
                >
                  <ControlLabel>Crowdsale Address</ControlLabel>
                  <FormControl
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                  <Button 
                    bsStyle="info"
                    onClick={this.loadSale} >
                    GO
                  </Button>
              </FormGroup>
          </Col>
        </Row>}
        {this.props.token && 
        <Row>
          <Col>
            <h4>{this.props.token.get("name")}({this.props.token.get("symbol")})</h4>
            
            <Row>
              <Col sm={4}>Crowdsale Contract</Col>
              <Col sm={8}>
                <a href={`"http://gastracker.io/addr/${this.props.token.get("saleAddress")}"`} rel="noopener noreferrer" target="_blank">
                  {this.props.token.get("saleAddress")}
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>Token Contract</Col>
              <Col sm={8}>
                <a href={`"http://gastracker.io/addr/${this.props.token.get("tokenAddress")}"`} rel="noopener noreferrer" target="_blank">
                  {this.props.token.get("tokenAddress")}
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>Beneficiary</Col>
              <Col sm={8}>
                <a href={`"http://gastracker.io/addr/${this.props.token.get("owner")}"`} rel="noopener noreferrer" target="_blank">
                  {this.props.token.get("owner")}
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>Initial Supply</Col>
              <Col sm={8}>{this.props.token.get("initialSupply")}</Col>
            </Row>
          </Col>
        </Row>}

        {this.props.ico && <Row><Col>
        <Row>
          <Col>
          <h4>Your Crowdsale has been Created!</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>Funding Goal</Col>
          <Col sm={8}>{(this.props.ico.get("fundingGoal") || 0).toString(10)}</Col>
        </Row>
        <Row>
          <Col sm={4}>Amount Raised</Col>
          <Col sm={8}>{(this.props.ico.get("amountRaised") || 0).toString(10)}</Col>
        </Row>
        <Row>
          <Col sm={4}>Token Price</Col>
          <Col sm={8}>{(this.props.ico.get("tokenPrice") || 0).toString(10)}</Col>
        </Row>


        <hr />
        <Form>
          <FormGroup
            controlId="quantity"
          >
            <ControlLabel>Number of Tokens to Buy</ControlLabel>
            <FormControl
              type="number"
              placeholder="1"
              onChange={this.handleChange}
            />
            Total Cost(ETC) tODO: conversion (need decimals)
          </FormGroup>
          <FormGroup>
            {this.props.wallet &&
            <Button 
              bsStyle="primary"
              onClick={this.buyIco} >
              BUY
            </Button>}
          </FormGroup>

        </Form>
        <BuyTokenModal 
          show={this.state.modalShow} 
          close={modalClose} 
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          submitTx={this.submitTx}
          />
        </Col></Row>}
      </Grid>
    );
  }
};


const BuyIco = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
      token: state.tokens.get('token'),
      ico: state.tokens.get('ico'),
    }
  },
  (dispatch, ownProps) => ({
      loadSale: (address) => {
        dispatch(loadCrowdSale(address));
      },
      buyIco: (data, wallet) => {
        return new Promise((resolve, reject) => {
          dispatch(
            generateBuyIco( data, wallet )
          ).then((result) => resolve(result))
        })
      },
      sendTransaction: (tx, data, address) => {
        const afterTx = (txhash) => {
          console.log(txhash)
        };

        const resolver = (resolve, f) => (x) => {
          f.apply(x);
          resolve(x);
        };

        return new Promise((resolve, reject) => {
          dispatch(sendTransaction( tx ))
            .then(resolver(afterTx, resolve));
        });
      },      
      gotoToken: () => 
        dispatch(gotoTab('token'))
  })
)(BuyForm)

export default BuyIco;
