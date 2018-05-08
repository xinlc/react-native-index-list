
/**
 * Copyright (c) 2015 Johannes Lumpe
 * Copyright (c) 2018 Leo Xin
 */

import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export default class CellWrapper extends PureComponent {

  componentDidMount() {
    const { updateTag, sectionId, } = this.props;
    if (updateTag) {
      updateTag(this.refs.view, sectionId);
    }
  }

  _onLayout = (e) => {
    const { updateTag, sectionId, } = this.props;
    const y = e.nativeEvent.layout.y;
    if (updateTag) {
      updateTag(y, sectionId);
    }
  }

  render() {
    const { component, ...rest } = this.props;
    const Cell = component;
    return (
      <View ref="view" onLayout={this._onLayout}>
        <Cell {...rest} />
      </View>
    );
  }
}

CellWrapper.propTypes = {

  /**
   * The id of the section
   */
  sectionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  /**
   * A component to render for each cell
   */
  component: PropTypes.func.isRequired,

  /**
   * A function used to propagate the root nodes handle back to the parent
   */
  updateTag: PropTypes.func

};
