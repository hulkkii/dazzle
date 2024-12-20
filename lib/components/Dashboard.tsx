import React from 'react';
import { useDragDropManager } from 'react-dnd';
import LayoutRenderer from './LayoutRenderer';

interface DashboardProps {
  layout: any;
  widgets: any;
  editable: boolean;
  rowClass: string;
  frameComponent: React.ComponentType<any>;
  addWidgetComponent: React.ComponentType<any>;
  editableColumnClass: string;
  droppableColumnClass: string;
  addWidgetComponentText: string;
  onRemove: (layout: any) => void;
  onAdd: (layout: any, rowIndex: number, columnIndex: number) => void;
  onMove: (layout: any) => void;
  onEdit: (widgetKey: string) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const dragDropManager = useDragDropManager();

  return (
    <div>
      <LayoutRenderer {...props} />
    </div>
  );
};

export { Dashboard as DashboardWithoutDndContext };
export default Dashboard;
