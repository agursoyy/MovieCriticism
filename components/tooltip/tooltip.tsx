import React, { FC } from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import './tooltip.scss';

interface IProps {
  text: string,
  tooltip: string
}


const Tooltip: FC<IProps> = ({ text, tooltip }) => {
  function Trigger({ getTriggerProps, triggerRef }: any) {
    return (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: 'trigger'
        })}
      >
        <i className="icon icon-heart"></i>
        <span className="d-none d-sm-block">
          {text}
        </span>

      </span>
    );
  }
  function Tooltip({
    getTooltipProps,
    getArrowProps,
    tooltipRef,
    arrowRef,
    placement
  }: any) {
    return (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: 'tooltip-container'
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            'data-placement': placement,
            className: 'tooltip-arrow'
          })}
        />
        <div className="tooltip-body">{tooltip}</div>
      </div>
    );
  }
  return (
    <TooltipTrigger placement="right" trigger="click" tooltip={Tooltip}>
      {Trigger}
    </TooltipTrigger>
  );
};

export default Tooltip;
