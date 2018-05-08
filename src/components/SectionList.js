import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, PanResponder } from 'react-native';
import PropTypes from 'prop-types';

const returnTrue = () => true;


export default class SectionList extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.lastSelectedIndex = null;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => { // 由于 y0 很多时候为0（不知道为什么），所有用View的onResponderGrant事件
        // this.tapTimeout = setTimeout(() => {
        //   this.detectAndScrollToSection(gestureState.y0); // 当响应器产生时的屏幕坐标
        // }, 100);
      },
      onPanResponderMove: (evt, gestureState) => {
        // clearTimeout(this.tapTimeout);
        this.detectAndScrollToSection(gestureState.moveY); // 最近一次移动时的屏幕纵坐标
      },
      onPanResponderRelease: () => {
        this.resetSection();
      },
      onPanResponderTerminate: () => {
        this.resetSection();
      }
    });
  }

  onSectionSelect = (sectionId, fromTouch) => {
    const { onSectionSelect } = this.props;

    if (onSectionSelect) {
      onSectionSelect(sectionId);
    }

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  onResponderGrant = (e) => {
    const y = e.nativeEvent.pageY;
    this.detectAndScrollToSection(y);
  }

  _onLayout() {
    this.refs.alphabetContainer.measure((x1, y1, width, height, px, py) => {
      this.absContainerTop = py;
      this.containerHeight = height;
    });
  }

  detectAndScrollToSection = (y) => {
    const { sections, } = this.props;
    const top = y - (this.absContainerTop || 0);
    let index = 0;
    if (top >= 1 && top <= this.containerHeight) {
      // index = Math.round((top / this.containerHeight) * this.props.sections.length); // 获取索引
      index = parseInt((top / this.containerHeight) * sections.length); // 获取索引
    }
    if (this.lastSelectedIndex !== index) {
      this.lastSelectedIndex = index;
      this.onSectionSelect(sections[index], true);
    }
  }

  resetSection = () => {
    this.lastSelectedIndex = null;
  }

  render() {
    const { component, sections, getSectionListTitle, } = this.props;
    const SectionComponent = component;
    const sectionComps = sections.map((section, index) => {
      const title = getSectionListTitle ? getSectionListTitle(section) : section;

      const child = SectionComponent ? (
        <SectionComponent
          sectionId={section}
          title={title}
        />
      ) : (
        <View style={styles.item}>
          <Text style={[styles.text]}>{title}</Text>
        </View>
      );

      return (
        <View key={index} pointerEvents="none">
          {child}
        </View>
      );
    });

    return (
      <View
        style={[styles.container]}
      >
        <View
          ref="alphabetContainer"
          onLayout={this._onLayout.bind(this)}
          style={this.props.style}
          {...this._panResponder.panHandlers}
          onStartShouldSetResponder={returnTrue}
          onResponderGrant={this.onResponderGrant}
        >
          {sectionComps}
        </View>
      </View>
    );
  }
}

SectionList.propTypes = {

  /**
   * A component to render for each section item
   */
  component: PropTypes.func,

  /**
   * Function to provide a title the section list items.
   */
  getSectionListTitle: PropTypes.func,

  /**
   * Function to be called upon selecting a section list item
   */
  onSectionSelect: PropTypes.func,

  /**
   * The sections to render
   */
  sections: PropTypes.array.isRequired,  // eslint-disable-line

  /**
   * A style to apply to the section list container
   */
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ])
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0
  },

  item: {
    padding: 0
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  }
});
