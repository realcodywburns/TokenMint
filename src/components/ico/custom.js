import React from 'react';
import { Media, PageHeader } from 'react-bootstrap';
import customImg from '../../img/custom-ico.png';

export const CustomHead = (props) => {
    const { name, symbol } = props;

    return ( 
      <Media>
        <Media.Left align="top">
          <img width={200} height={200} src={customImg} />
        </Media.Left>
        <Media.Body>
          <Media.Heading>
            <PageHeader>{name}
              &nbsp; <small>({symbol})</small>
            </PageHeader> 
          </Media.Heading>
          <p>The cryptographic keys to Heaven are now available on the blockchain.</p>
          <p><b><a href="http://www.jewishvirtuallibrary.org/new-testament-king-james-version-full-text" rel="noopener noreferrer"
                    target="_blank">
            Read the Whitepaper</a></b>
          </p>
        </Media.Body>
      </Media>
      )
  };

export const CustomAbout = (props) => {

  return(
      <p></p>
    )
}