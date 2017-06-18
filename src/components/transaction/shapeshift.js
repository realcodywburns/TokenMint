import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Modal, MenuItem } from 'react-bootstrap';
import { loadSSCoins, getMarketData, shiftIt } from '../../store/ssActions';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            showSS: false, 
            exchangeRate: 1, // XBT/ETC
            coin: 'ETC',
            returnAddress: null,
        };
    }

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

    handleChange = (e) => 
        this.setState({ [e.target.id]: e.target.value });    

    getExchangeRate = (coin) => {
        this.props.dispatch(getMarketData(coin))
            .then((result) => {
                console.log(result)
                if (result.rate)
                    this.setState({ 
                        coin,
                        modalShow: true,
                        exchangeRate: result.rate
                    });
            });
    }

    getShapeShift = () => {
        const pair = this.state.coin.toLowerCase() + '_etc';
        shiftIt(this.state.returnAddress, pair, this.props.amount)
    }

    render() {
        return (
            <Grid>
            <DropdownButton 
                id="ssCoins"
                bsStyle="success"
                title="PAY WITH...">
                {this.props.coins.valueSeq().map((coin) => 
                    <MenuItem key={coin.get('symbol')} onClick={(e)=>this.getExchangeRate(coin.get('symbol'))}>
                        {coin.get('name')}
                    </MenuItem>)
                }
            </DropdownButton>
            
            <Modal show={this.state.modalShow} bsSize="large">
                <Modal.Header closebutton>
                    <Modal.Title>Buy {this.props.amount} {this.props.tokenName}s 
                        ({this.props.price} per {this.props.symbol})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* 
                        TODO: Error checking
                        Deposit Limit: {this.state.rate.limit}
                        Minimum Amount: {this.state.rate.minimum}
                        MinerFee: {this.state.rate.minerFee}   
                    */}
                    <h3>Pay with {this.state.coin}</h3>
                    <p>Exchange Rate: {this.state.exchangeRate} ({this.state.coin}/ETC)</p>

                    <FormGroup controlId="returnAddress" >
                        <ControlLabel>Return Address (for refunds)</ControlLabel>
                        <FormControl type="text"/>
                    </FormGroup>
                    <Button 
                      bsStyle="primary"
                      onClick={this.getShapeShift} >
                      OKAY
                    </Button>
                </Modal.Body>
                {showSS && <Modal.Body>
{/*<div ng-if="depositInfo" class="row">
    <div class="col-md-12">
        {{DepositStatus.status}}
    </div>
    <div class="col-md-3">
        <qrcode version="20" error-correction-level="H" size=200 data="{{depositInfo.depositQR}}"></qrcode>
    </div>
    <div class="col-md-5">
        <div>Deposit Type: {{depositInfo.depositType}}</div>
        <div ng-if="depositInfo.depositAmount">Deposit Amount: {{depositInfo.depositAmount}}</div>
        <div>Deposit Address: {{depositInfo.deposit}}</div>
        <div>Withdrawal Type: {{depositInfo.withdrawalType}}</div>
        <div>Withdrawal Address: {{depositInfo.withdrawal}}</div>
        <div ng-if="depositInfo.withdrawalAmount">Withdrawal Amount: {{depositInfo.withdrawalAmount}}</div>
        <div ng-if="depositInfo.quotedRate">Quoted Rate: {{depositInfo.quotedRate}}</div>
        <div ng-if="depositInfo.minerFee">Miner Fee: {{depositInfo.minerFee}}</div>
        <div ng-if="depositInfo.expiration">Expires: {{depositInfo.expiration}}</div>
    </div>
</div>*/}
              </Modal.Body>}
            </Modal>
          </Grid>

        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins');
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;