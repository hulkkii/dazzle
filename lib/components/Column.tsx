import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { WIDGET } from './ItemTypes';
import AddWidget from './AddWidget';
import { moveWidget } from '../util';

interface ColumnProps {
  className: string;
  layout: any;
  rowIndex: number;
  columnIndex: number;
  editable: boolean;
  children: React.ReactNode;
  onAdd: (layout: any, rowIndex: number, columnIndex: number) => void;
  editableColumnClass: string;
  droppableColumnClass: string;
  addWidgetComponentText: string;
  addWidgetComponent: React.ComponentType<{ text: string; onClick: () => void }>;
  onMove: (layout: any) => void;
}

const Column: React.FC<ColumnProps> = ({
  className,
  layout,
  rowIndex,
  columnIndex,
  editable,
  children,
  onAdd,
  editableColumnClass,
  droppableColumnClass,
  addWidgetComponentText,
  addWidgetComponent,
  onMove,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: WIDGET,
    drop: (item: any) => {
      if (item.columnIndex !== columnIndex || item.rowIndex !== rowIndex) {
        const movedLayout = moveWidget(layout, {
          rowIndex: item.rowIndex,
          columnIndex: item.columnIndex,
          widgetIndex: item.widgetIndex,
        }, {
          rowIndex,
          columnIndex,
        }, item.widgetName);
        onMove(movedLayout);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  let classes = className;
  classes = editable ? `${className} ${editableColumnClass}` : classes;
  const isActive = isOver && canDrop;
  classes = isActive ? `${classes} ${droppableColumnClass}` : classes;

  let addWidgetComponentToUse = null;
  if (addWidgetComponent) {
    addWidgetComponentToUse = createElement(addWidgetComponent, { text: addWidgetComponentText, onClick: () => { onAdd(layout, rowIndex, columnIndex); } });
  } else {
    addWidgetComponentToUse = <AddWidget text={addWidgetComponentText} onClick={() => { onAdd(layout, rowIndex, columnIndex); }} />;
  }

  return (
    <div ref={drop} className={classes}>
      {editable && addWidgetComponentToUse}
      {children}
    </div>
  );
};

Column.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onAdd: PropTypes.func,
  layout: PropTypes.object,
  rowIndex: PropTypes.number,
  columnIndex: PropTypes.number,
  editable: PropTypes.bool,
  editableColumnClass: PropTypes.string,
  droppableColumnClass: PropTypes.string,
  addWidgetComponentText: PropTypes.string,
  addWidgetComponent: PropTypes.func,
  onMove: PropTypes.func,
};

Column.defaultProps = {
  editableColumnClass: 'editable-column',
  droppableColumnClass: 'droppable-column',
};

export default Column;
