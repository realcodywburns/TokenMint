import React from 'react';
import { Modal, Image, Row, Col } from 'react-bootstrap';
import logo from '../../img/logo.png';


class ToSmodal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
    };
  }
  close = () => {
    this.setState({ showModal: false });
  }

  eject = () => {
    this.setState({ showModal: true });
  }

  render() {
    return (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Row>
                <Col md={4} sm={4} xs={6}>
                <Image responsive={true} src={logo} alt="TokenMint"  />
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <h4>Welcome to TokenMint!</h4>
            <br />
            <p>This is simple to use token and ICO generator created for use with the Ethereum Classic blockchain. The purpose of this generator is to make it simple for users to create their own token and crowdsale using smart contracts. Tokens are effectively a virtual currency created and secured on top of the Ethereum blockchain. An ICO is an Intial Coin Offering. At a designated price, users can offer their tokens at a set price in either ETC. This can be useful for raising funds in a crowdsale. Tokens can be used in a variety of ways, user rewards, rebates, virtual currencies, or as a voting mechanism.</p>
            <hr />
            <h2> Disclaimer </h2>
            <h5>NEITHER THE SOFTWARE NOR ITS CREATORS PROVIDE LEGAL ADVICE AND THIS CODE WAS NOT CREATED TO PROVIDE LEGAL ADVICE OR AS A SUBSTITUTE FOR LEGAL ADVICE. BY USING THIS CODE YOU ALSO AGREE:</h5>
            <ol>
            <li> The creators of the Software and its contributors are not your lawyers.</li>

            <li> The Software is not a lawyer.</li>

            <li> Your use of the Software does not, in and of itself, create a legally binding contract in any jurisdiction and does not establish a lawyer-client relationship. Your communication with a non-lawyer will not be subject to the attorney-client privilege and (depending on your jurisdiction) may not be entitled to protection as confidential communication.</li>

            <li> The dissemination, distribution, or usage of this software shall not constitute the provision of legal advice within your jurisdiction. Unless you are legally authorized and licensed to do so, you will not use the Software to provide or assist in the provision of legal advice.</li>

            <li> You acknowledge and understand that each jurisdiction has its own particular rules regarding the practice of law. IF YOU USE THIS SOFTWARE TO PROVIDE LEGAL ADVICE YOU MAY BE SUBJECT TO CIVIL AND CRIMINAL LIABILITY. PRACTICING LAW WITHOUT A LICENSE IS A VIOLATION OF CRIMINAL LAW IN SOME JURISDICTIONS. CONSULT A LAWYER LICENSED IN YOUR JURISDICTION IF YOU HAVE ANY QUESTIONS ABOUT WHAT DOES OR DOES NOT CONSTITUTE THE PRACTICE OF LAW.</li>

            <li> The providers of this software neither warrant nor guarantee this software shall meet the requirements of any particular legal system to form a legally binding contract, nor it it their intention to directly or indirectly facilitate or encourage the unauthorized practice of law.</li>

            <li> You agree that in order for you to form a legally binding contract that you shall seek legal advice from an appropriately qualified and experienced lawyer within your jurisdiction.</li>

            <li> Minting of tokens may constitute the sale of securities in certain jurisdictions. Seek appropriate legal advice before deploying a crowdsale contract.</li>
            </ol>

            <h5>We are currently still under construction but feel free to look around!</h5>
          </div>
          </Modal.Body>

        </Modal>
    );
  }
};

export default ToSmodal;
