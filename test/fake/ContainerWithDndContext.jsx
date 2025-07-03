import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

class ContainerWithDndContext extends Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div>{this.props.children}</div>
      </DndProvider>
    );
  }
}

ContainerWithDndContext.propTypes = {
  children: PropTypes.element,
};

export default ContainerWithDndContext;
