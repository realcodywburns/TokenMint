export const ToSmodal = React.createClass({

  getInitialState(){
    return { showModal: true };
  },

  close(){
    this.setState({ showModal: false });
  },

  open(){
    this.setState({ showModal: true });
  },

  render() {
    return (
      <div>
        <Button onClick={this.open}>
          Launch modal
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title><img src={process.env.PUBLIC_URL + "/img/logo.png"} alt="TokenMint"  /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <h4>Welcome to TokenMint!</h4>
            <br />
            <p>This is simple to use token and ICO generator created for use with the Ethereum blockchains ETC & ETH. The purpose of this generator is to make it simple for users to create their own token and crowdsale using smart contracts. Tokens are effectively a virtual currency created and secured on top of the Ethereum blockchain. An ICO is an Intial Coin Offering. At a designated price, users can offer their tokens at a set price in either ETC or ETH. This can be useful for raising funds in a crowdsale. Tokens can be used in a variety of ways, user rewards, rebates, virtual currencies, or as a voting mechanism with a Decentralized Autonomous Organization (DAO).</p>
            <hr />
            <h5 class="text-align: center">We are currently still under construction but feel free to look around!</h5>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});
