import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export const tip = (props) => (
  <Tooltip id="tooltip">
    {props.title}
  </Tooltip>
);

export const ToolPopup = (props) => (
    <OverlayTrigger placement="right" overlay={<tip title={props.title}/>}>
        {props.children}
    </OverlayTrigger>
)