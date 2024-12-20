import React, { createElement } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { WIDGET } from './ItemTypes';
import { removeWidget, sortWidget } from '../util';
import DefaultFrame from './DefaultFrame';

interface WidgetFrameProps {
  frameComponent?: React.ComponentType<any>;
  children: React.ReactNode;
  editable: boolean;
  title: string;
  frameSettings?: any;
  layout: any;
  rowIndex: number;
  columnIndex: number;
  widgetIndex: number;
  widgetName: string;
  onMove: (layout: any) => void;
  onRemove: (layout: any, rowIndex: number, columnIndex: number, widgetIndex: number) => void;
  onEdit: (widgetKey: string) => void;
}

const WidgetFrame: React.FC<WidgetFrameProps> = ({
  frameComponent,
  children,
  editable,
  title,
  frameSettings,
  layout,
  rowIndex,
  columnIndex,
  widgetIndex,
  widgetName,
  onMove,
  onRemove,
  onEdit,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: WIDGET,
    item: { widgetName, rowIndex, columnIndex, widgetIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: WIDGET,
    hover: (item, monitor) => {
      const dragIndex = item.widgetIndex;
      const hoverIndex = widgetIndex;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = monitor.getClientOffset();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = monitor.getClientOffset().y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

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
        item.widgetIndex = hoverIndex;
      }
    },
  });

  const remove = () => {
    const newLayout = removeWidget(layout, rowIndex, columnIndex, widgetIndex);
    onRemove(newLayout, rowIndex, columnIndex, widgetIndex);
  };

  const edit = () => {
    onEdit(layout.rows[rowIndex].columns[columnIndex].widgets[widgetIndex].key);
  };

  let selected = null;

  if (frameComponent) {
    selected = createElement(frameComponent, {
      children,
      editable,
      title,
      settings: frameSettings,
      onRemove: remove,
      onEdit: edit,
      rowIndex,
      columnIndex,
      widgetIndex,
      isDragging,
    });
  } else {
    selected = (
      <DefaultFrame
        title={title}
        editable={editable}
        children={children}
        onRemove={remove}
        onEdit={edit}
      />
    );
  }

  const opacity = isDragging ? 0 : 1;
  const widgetFrame = (
    <div ref={drag(drop)} style={{ opacity }}>
      {selected}
    </div>
  );

  return editable ? widgetFrame : widgetFrame;
};

export default WidgetFrame;
