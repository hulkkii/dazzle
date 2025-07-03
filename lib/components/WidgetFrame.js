import React, { Component, createElement, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { WIDGET } from './ItemTypes';
import { removeWidget, sortWidget } from '../util';
import DefaultFrame from './DefaultFrame';

/**
 * Frame component which surrounds each widget.
 */
const WidgetFrame = (props) => {
  const {
    frameComponent,
    children,
    editable,
    title,
    frameSettings,
    rowIndex,
    columnIndex,
    widgetIndex,
    layout,
    widgetName,
    onRemove,
    onEdit,
    onMove,
  } = props;

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: WIDGET,
    item: () => ({
      widgetName,
      rowIndex,
      columnIndex,
      widgetIndex,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: WIDGET,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.widgetIndex;
      const hoverIndex = widgetIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      if (item.rowIndex === rowIndex && item.columnIndex === columnIndex) {
        const newLayout = sortWidget(layout, {
          rowIndex,
          columnIndex,
          widgetIndex: dragIndex,
        }, {
          rowIndex,
          columnIndex,
          widgetIndex: hoverIndex,
        }, item.widgetName);

        onMove(newLayout);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.widgetIndex = hoverIndex; // eslint-disable-line no-param-reassign
      }
    },
  });

  const handleRemove = () => {
    const newLayout = removeWidget(layout, rowIndex, columnIndex, widgetIndex);
    onRemove(newLayout, rowIndex, columnIndex, widgetIndex);
  };

  const handleEdit = () => {
    onEdit(layout.rows[rowIndex].columns[columnIndex].widgets[widgetIndex].key);
  };

  let selected = null;

  if (frameComponent) {
    // if user provided a custom frame,  use it
    selected = createElement(frameComponent, {
      children,
      editable,
      title,
      settings: frameSettings,
      onRemove: handleRemove,
      onEdit: handleEdit,
      rowIndex,
      columnIndex,
      widgetIndex,
      isDragging,
    });
  } else {
    // else use the default frame
    selected = (
      <DefaultFrame
        title={title}
        editable={editable}
        children={children}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />
    );
  }

  const opacity = isDragging ? 0 : 1;
  const widgetFrame = (
    <div ref={ref} style={{ opacity }}>
      {selected}
    </div>
  );

  if (editable) {
    drag(drop(ref));
  }

  return widgetFrame;
};

WidgetFrame.propTypes = {
  /**
   * Childrens of the widget frame.
   */
  children: PropTypes.element,

  /**
   * Layout of the dahsboard.
   */
  layout: PropTypes.object,

  /**
   * Index of the column these widgets should be placed.
   */
  columnIndex: PropTypes.number,

  /**
   * Index of the row these widgets should be placed.
   */
  rowIndex: PropTypes.number,

  /**
   * Index of the widget.
   */
  widgetIndex: PropTypes.number,

  /**
   * Indicates weatehr dashboard is in ediable mode or not.
   */
  editable: PropTypes.bool,

  /**
   * User provided widget frame that should be used instead of the default one.
   */
  frameComponent: PropTypes.func,

  /**
   * User provided settings for be use by custom widget frame.
   */
  frameSettings: PropTypes.object,

  /**
   * Name of the widget.
   */
  widgetName: PropTypes.string,

  /**
   * Title of the widget.
   */
  title: PropTypes.string,

  /**
   * Function that should be called when a widget is about to be removed.
   */
  onRemove: PropTypes.func,

  /**
   * Function called when to edit a widget.
   */
  onEdit: PropTypes.func,

  /**
   * Function called when a widget is moved.
   */
  onMove: PropTypes.func,
};

WidgetFrame.defaultProps = {
  frameSettings: {},
};

export default WidgetFrame;
