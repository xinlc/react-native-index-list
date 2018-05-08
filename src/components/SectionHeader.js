
/**
 * Copyright (c) 2015 Johannes Lumpe
 * Copyright (c) 2018 Leo Xin
 */

import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class SectionHeader extends PureComponent {

  componentDidMount() {
    const { updateTag, sectionId, } = this.props;
    if (updateTag) {
      updateTag(this.refs.view, sectionId);
    }
  }

  render() {
    const { component, ...rest } = this.props;
    const SectionComponent = component;
    const content = SectionComponent ? (
      <SectionComponent {...rest} />
    ) : (
      <Text style={styles.text}>{rest.title}</Text>
    );

    return (
      <View ref="view" style={styles.container}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontWeight: '700',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
  }
});

SectionHeader.propTypes = {

  /**
   * The id of the section
   */
  sectionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  /**
   * A component to render for each section item
   */
  component: PropTypes.func,

  /**
   * A function used to propagate the root nodes handle back to the parent
   */
  updateTag: PropTypes.func

};
