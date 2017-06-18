import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Modal, MenuItem } from 'react-bootstrap';
import { loadSSCoins, getMarketData } from '../../store/ssActions';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            exchangeRate: 1, // XBT/ETC
            coin: 'ETC',
        };
    }

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

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

    ShiftIt = () => {

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
            <FormGroup controlId="returnAddress" >
            <ControlLabel>Return Address (for refunds)</ControlLabel>
            <FormControl type="text"/>
            </FormGroup>
            {/* this should be a modal
            */}
            
            <Modal show={this.state.modalShow} bsSize="large">
                <Modal.Header closebutton>
                    <Modal.Title>Pay with {this.state.coin}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*<div>Deposit Limit: {this.state.rate.limit}</div>
                    <div>Minimum Amount: {this.state.rate.minimum}</div>
                    <div>MinerFee: {this.state.rate.minerFee}</div>*/}
                    <div>Rate: {this.state.exchangeRate}</div>
                    <Button 
                      bsStyle="primary"
                      onClick={this.ShiftIt} >
                      ACCEPT
                    </Button>
                </Modal.Body>
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