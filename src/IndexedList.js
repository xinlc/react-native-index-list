/**
 * IndexedList
 * Created by xinlc on 08/05/2018.
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import SelectableSectionsListView from './components/SelectableSectionsListView';

class Cell extends PureComponent { // eslint-disable-line
  // 历史选择
  _renderCell(items) {
    const styles = {
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        backgroundColor: '#EEF2F5',
      },
      button: {
        width: 102,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        marginBottom: 8,
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#DEDFE1',
        backgroundColor: '#fff'
      },
      buttonText: {
        color: '#6C7987',
        fontSize: 14,
      },
    };

    return (
      <View style={styles.container}>
        {
          items.map((n, i) => {
            let textColor = '#6C7987';
            if (this.props.sectionId == 'current' || this.props.sectionId == 'hot') {
              textColor = this.props.selected.some(o => n.name == o.name) ? '#F9CB00' : '#6C7987';
            }
            return (
              <TouchableOpacity
                key={i}
                style={styles.button}
                onPress={() => {
                  this.props.pressCell(n);
                }}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  { n.name }
                </Text>
              </TouchableOpacity>
            );
          })
        }
      </View>
    );
  }
  render() {
    const item = this.props.item;
    // 是历史城市或热门城市
    if (Array.isArray(item)) {
      return this._renderCell(item);
    }
    const viewStyle = {
      justifyContent: 'center',
      marginLeft: 15,
      height: 40,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#EEEFF0',
      backgroundColor: '#fff'
    };

    const textColor = this.props.selected.some(n => item.name == n.name) ? '#F9CB00' : '#333';

    return (
      <TouchableOpacity
        style={viewStyle}
        onPress={() => {
          this.props.pressCell(item);
        }}
      >
        <Text style={{ color: textColor, fontSize: 15 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
}

class SectionHeader extends PureComponent { // eslint-disable-line
  _renderSectionHeader(title) {
    const styles = {
      sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#EEF2F5',
      },
      sectionTitle: {
        color: '#BCBDBF',
        fontSize: 13,
      },
      verticalLine: {
        width: 3,
        height: 12,
        marginLeft: 4,
        marginRight: 5,
        backgroundColor: '#FACD00',
      },
    };
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.verticalLine} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    );
  }

  render() {
    const title = this.props.title;
    // 是历史城市或热门城市
    if (title == 'history') {
      return this._renderSectionHeader('历史选择');
    } else if (title == 'hot') {
      return this._renderSectionHeader('热门类别');
    } else if (title == 'current') {
      return this._renderSectionHeader('当前选择');
    }
    const textStyle = {
      padding: 5,
      fontWeight: '700',
      color: '#C0C2C3',
      fontSize: 16,
      marginLeft: 10,
    };

    const viewStyle = {
      backgroundColor: '#EEF2F5',
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{title}</Text>
      </View>
    );
  }
}

class SectionListItem extends PureComponent { // eslint-disable-line

  render() {
    let title = this.props.title;
    if (title == 'history') {
      title = '*';
    } else if (title == 'hot') {
      title = '#';
    } else if (title == 'current') {
      title = '!';
    }
    return (
      <Text style={{ color: '#fff', marginVertical: 2 }}>{title}</Text>
    );
  }
}


class IndexedList extends PureComponent { // eslint-disable-line

  static defaultValue = {
    data: {},
    selected: [],
    pressCell: () => {},
  }

  constructor(props) {
    super(props);
    const state = {
      data: props.data,
      selected: Array.isArray(props.selected) ? props.selected : [props.selected]
    };
    if (state.data.current) {
      state.data.current = [state.selected];
    }
    this.state = state;
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      const state = {
        data: nextProps.data
      };
      if (state.data.current) {
        state.data.current = [this.state.selected];
      }
      this.setState(state);
    }
  }

  _pressCell = (obj) => {
    this.props.pressCell(obj);
  }

  render() {
    return (
      <SelectableSectionsListView
        data={this.state.data}
        cell={Cell}
        sectionHeader={SectionHeader}
        sectionListItem={SectionListItem}
        sectionListStyle={styles.sectionListStyle}
        cellProps={{ pressCell: this._pressCell, selected: this.state.selected }}
        cellHeight={45}
        sectionHeaderHeight={30}
        initialListSize={100}
        useDynamicHeights
        enableEmptySections
      />
    );
  }
}

const styles = StyleSheet.create({
  sectionListStyle: {
    width: 20,
    alignItems: 'center',
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 3,
    backgroundColor: 'rgba(167, 168, 172, 0.7)',
  }
});

export default IndexedList;
