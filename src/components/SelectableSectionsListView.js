
/**
 * Copyright (c) 2015 Johannes Lumpe
 * Copyright (c) 2018 Leo Xin
 */

import React, { PureComponent, } from 'react';
import { StyleSheet, View, ListView } from 'react-native';
import PropTypes from 'prop-types';

import SectionHeader from './SectionHeader';
import SectionList from './SectionList';
import CellWrapper from './CellWrapper';

const merge = require('merge');

export default class SelectableSectionsListView extends PureComponent {

  constructor(props, context) {
    super(props, context);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (prev, next) => prev !== next
      }),
      offsetY: 0
    };

    // used for dynamic scrolling
    // always the first cell of a section keyed by section id
    this.cellTagMap = {};
    this.sectionTagMap = {};
  }

  componentWillMount() {
    this.calculateTotalHeight();
  }

  componentDidMount() {
    // push measuring into the next tick
    // setTimeout(() => {
    //   this.refs.view.measure((x,y,w,h) => {
    //     this.containerHeight = h;
    //   });
    // }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.calculateTotalHeight(nextProps.data);
    }
  }

  onScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (this.props.updateScrollState) {
      this.setState({
        offsetY
      });
    }

    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
  }

  onScrollAnimationEnd = (e) => {
    if (this.props.updateScrollState) {
      this.setState({
        offsetY: e.nativeEvent.contentOffset.y
      });
    }
  }

  calculateTotalHeight(data) {
    data = data || this.props.data;

    if (Array.isArray(data)) {
      return;
    }

    this.sectionItemCount = {};
    this.totalHeight = Object.keys(data)
      .reduce((carry, key) => {
        const itemCount = data[key].length;
        carry += itemCount * this.props.cellHeight;
        carry += this.props.sectionHeaderHeight;

        this.sectionItemCount[key] = itemCount;

        return carry;
      }, 0);
  }

  updateTagInSectionMap = (tag, section) => {
    this.sectionTagMap[section] = tag;
  }

  updateTagInCellMap = (tag, section) => {
    this.cellTagMap[section] = tag;
  }

  scrollToSection = (section) => {
    let y = 0;
    const headerHeight = this.props.headerHeight || 0;
    y += headerHeight;

    if (!this.props.useDynamicHeights) {
      const cellHeight = this.props.cellHeight;
      let sectionHeaderHeight = this.props.sectionHeaderHeight;
      const keys = Object.keys(this.props.data);
      const index = keys.indexOf(section);

      let numcells = 0;
      for (let i = 0; i < index; i++) {
        numcells += this.props.data[keys[i]].length;
      }

      sectionHeaderHeight *= index;
      y += numcells * cellHeight + sectionHeaderHeight;
      const maxY = this.totalHeight - this.containerHeight + headerHeight;
      y = y > maxY ? maxY : y;

      this.refs.listview.scrollTo({ x: 0, y: y, animated: true });
    } else {
      // this breaks, if not all of the listview is pre-rendered!
      let y = this.cellTagMap[section];
      const maxY = this.totalHeight - this.containerHeight + headerHeight;
      y -= this.props.sectionHeaderHeight;
      y = y > maxY ? maxY : y;
      this.refs.listview.scrollTo({ x: 0, y: y, animated: true });

      // this.cellTagMap[section].measure((x, y, w, h) => {
      //   console.log(x,y,w,h)
      //   var maxY = this.totalHeight - this.containerHeight + headerHeight;
      //   y = y - this.props.sectionHeaderHeight;
      //   y = y > maxY ? maxY : y;
      //   this.refs.listview.scrollTo({ x: 0, y: y, animated: true });
      // });
    }

    if (this.props.onScrollToSection) {
      this.props.onScrollToSection(section);
    }
  }

  renderSectionHeader = (sectionData, sectionId) => {
    const updateTag = this.props.useDynamicHeights ? this.updateTagInSectionMap : null;
    const title = this.props.getSectionTitle ? this.props.getSectionTitle(sectionId) : sectionId;

    return (
      <SectionHeader
        component={this.props.sectionHeader}
        title={title}
        sectionId={sectionId}
        sectionData={sectionData}
        updateTag={updateTag}
      />
    );
  }

  renderFooter = () => {
    const Footer = this.props.footer;
    return <Footer />;
  }

  renderHeader = () => {
    const Header = this.props.header;
    return <Header />;
  }

  renderRow = (item, sectionId, index) => {
    const CellComponent = this.props.cell;
    index = parseInt(index, 10);

    const isFirst = index === 0;
    const isLast = this.sectionItemCount[sectionId] - 1 === index;

    const props = {
      isFirst,
      isLast,
      sectionId,
      index,
      item,
      offsetY: this.state.offsetY,
      onSelect: this.props.onCellSelect
    };

    return index === 0 && this.props.useDynamicHeights ? (
      <CellWrapper
        updateTag={this.updateTagInCellMap}
        component={CellComponent} {...props} {...this.props.cellProps} />
    ) : (
      <CellComponent {...props} {...this.props.cellProps} />
    );
  }

  render() {
    const { data } = this.props;
    const dataIsArray = Array.isArray(data);
    let sectionList;
    let renderSectionHeader;
    let dataSource;

    if (dataIsArray) {
      dataSource = this.state.dataSource.cloneWithRows(data);
    } else {
      sectionList = !this.props.hideSectionList ? (
        <SectionList
          style={this.props.sectionListStyle}
          onSectionSelect={this.scrollToSection}
          sections={Object.keys(data)}
          getSectionListTitle={this.props.getSectionListTitle}
          component={this.props.sectionListItem}
        />
      ) : null;

      renderSectionHeader = this.renderSectionHeader;
      dataSource = this.state.dataSource.cloneWithRowsAndSections(data);
    }

    const renderFooter = this.props.footer ?
      this.renderFooter :
      this.props.renderFooter;

    const renderHeader = this.props.header ?
      this.renderHeader :
      this.props.renderHeader;

    const props = merge(this.props, {
      onScroll: this.onScroll,
      onScrollAnimationEnd: this.onScrollAnimationEnd,
      dataSource,
      renderFooter,
      renderHeader,
      renderRow: this.renderRow,
      renderSectionHeader
    });

    props.style = void 0;  // eslint-disable-line

    return (
      <View ref="view" style={[styles.container, this.props.style]}>
        <ListView
          ref="listview"
          {...props}
        />
        {sectionList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const stylesheetProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
]);

SelectableSectionsListView.propTypes = {
  /**
   * The data to render in the listview
   */
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,

  /**
   * Whether to show the section listing or not
   */
  hideSectionList: PropTypes.bool,

  /**
   * Functions to provide a title for the section header and the section list
   * items. If not provided, the section ids will be used (the keys from the data object)
   */
  getSectionTitle: PropTypes.func,
  getSectionListTitle: PropTypes.func,

  /**
   * Callback which should be called when a cell has been selected
   */
  onCellSelect: PropTypes.func,

  /**
   * Callback which should be called when the user scrolls to a section
   */
  onScrollToSection: PropTypes.func,

  /**
   * The cell element to render for each row
   */
  cell: PropTypes.func.isRequired,

  /**
   * A custom element to render for each section list item
   */
  sectionListItem: PropTypes.func,

  /**
   * A custom element to render for each section header
   */
  sectionHeader: PropTypes.func,

  /**
   * A custom element to render as footer
   */
  footer: PropTypes.func,

  /**
   * A custom element to render as header
   */
  header: PropTypes.func,

  /**
   * The height of the header element to render. Is required if a
   * header element is used, so the positions can be calculated correctly
   */
  headerHeight: PropTypes.number,

  /**
   * A custom function to render as footer
   */
  renderHeader: PropTypes.func,

  /**
   * A custom function to render as header
   */
  renderFooter: PropTypes.func,

  /**
   * An object containing additional props, which will be passed
   * to each cell component
   */
  cellProps: PropTypes.object,  // eslint-disable-line

  /**
   * The height of the section header component
   */
  sectionHeaderHeight: PropTypes.number.isRequired,

  /**
   * The height of the cell component
   */
  cellHeight: PropTypes.number.isRequired,

  /**
   * Whether to determine the y postion to scroll to by calculating header and
   * cell heights or by using the UIManager to measure the position of the
   * destination element. This is an exterimental feature
   */
  useDynamicHeights: PropTypes.bool,

  /**
   * Whether to set the current y offset as state and pass it to each
   * cell during re-rendering
   */
  updateScrollState: PropTypes.bool,

  /**
   * Styles to pass to the container
   */
  style: stylesheetProp,

  /**
   * Styles to pass to the section list container
   */
  sectionListStyle: stylesheetProp

};
