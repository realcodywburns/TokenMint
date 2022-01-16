import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
//import { ShareButtons, generateShareIcon } from 'react-share';
import TOKENS from '../../TOKENS';
import BuyIco from './buy';
import { toFiat, toEther } from '../../lib/etherUnits';
import { fetchIco } from '../../store/icoActions';
import logo from '../../img/logo.png';
import { CustomHead, CustomAbout } from './custom';

const TwitterIcon = generateShareIcon('twitter');

class RenderIco extends React.Component {

  constructor(props) {
    super(props);    
    const token = TOKENS.filter((t)=>t.crowdsale===this.props.match.params.id)[0];
    this.state = {
      id: this.props.match.params.id,
      custom: (token),
      token,
    };
  }

  componentWillMount = () => {
    this.props.dispatch(fetchIco(this.state.id));
  }

  render() {
    let fundingGoalUSD = (this.props.usdRate && this.props.fundingGoal) ? 
      toFiat(this.props.fundingGoal, "ether", this.props.usdRate.rate) : "0.00";
    let amountRaisedUSD = (this.props.usdRate && this.props.amountRaised) ? 
      toFiat(this.props.amountRaised, "ether", this.props.usdRate.rate) : "0.00";
    let priceUSD = (this.props.usdRate && this.props.price) ? 
      toFiat(this.props.price, "ether", this.props.usdRate.rate) : "0.00";

    return (
      <Container>
        <Row>
          <Col md={4} mdOffset={4}>
            <a href="/">
              <img className="col-md-6 col-sm-8" src={logo} alt="TokenMint"  />
            </a>
          </Col>
        </Row>
        
        {this.state.custom && 
            <CustomHead name={this.state.token.name}
              symbol={this.state.token.symbol}
              icon = {this.state.token.icon}
              blerb = {this.state.token.blerb} />
        }
        {this.props.ico && !this.state.custom && 
          <PageHeader>{this.props.ico.get("name")}
              &nbsp;<small>({this.props.ico.get("symbol")})</small>
          </PageHeader>
        }
        {this.props.ico && 
            <Card bsStyle="info" 
              header={`${this.props.amountRaised} ETC Raised ($${amountRaisedUSD})`} > 
          
              <Row>
                <Col sm={4}>Funding Goal</Col>
                <Col sm={8}>{this.props.fundingGoal} ETC (${fundingGoalUSD})</Col>
              </Row>
              <Row>
                <Col sm={4}>Token Price</Col>
                <Col sm={8}>{this.props.price} ETC (${priceUSD}) </Col>
              </Row>
              {/* TODO: Deal with possible token limits, fundraising limits, premine
              <hr />
              <Row>
                <Col sm={4}>Number of Tokens Available</Col>
                <Col sm={8}>{this.props.ico.get("initialSupply")} {this.props.ico.get("symbol")}</Col>
              </Row>*/}
            </Card>
        }

        {!this.props.ico && 
          <Card>
            <h1>Loading...</h1>
          </Card>}

        <BuyIco {...this.props} id={this.state.id} />

        <hr />
        {this.props.ico && <Row>
          <Col>
            <h3>More Info</h3>
            <Card footer={this.state.custom && <CustomAbout />}>
              <Row>
                <Col sm={4}>Token Contract</Col>
                <Col sm={8}>
                  <a href={`http://gastracker.io/addr/${this.props.ico.get("tokenReward")}`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.props.ico.get("tokenReward")}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>Crowdsale Address</Col>
                <Col sm={8}>
                  <a href={`http://gastracker.io/addr/${this.state.id}`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.state.id}
                  </a>
                </Col>
              </Row>
              
              
            </Card>
          </Col>
        </Row>}
      </Container>
    );

  }
}

const ViewIco = connect(
    (state, ownProps) => {
      const rates = state.wallet.get('rates');
      const usdRate = rates.filter((r)=>r.currency==='usd')[0];
      const fundingGoal = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('fundingGoal') || 0), 'wei');
      const amountRaised = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('amountRaised') || 0), 'wei');
      const price = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('price') || 0), 'wei');
      const balance = state.ico.get('balance').toString(10);
      return {
        ico: state.ico.get('ico'),
        fundingGoal,
        amountRaised,
        price,
        usdRate,
        balance,
      }
    },
    (dispatch, ownProps) => ({
      dispatch,
    })
)(RenderIco);

export default ViewIco;
