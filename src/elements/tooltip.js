import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export const ToolPopup = (props) => (
    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">{props.title}</Tooltip>}>
        {props.children}
    </OverlayTrigger>
)