/**
 * Example
 * Created by xinlc on 07/05/2018.
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import IndexedList from 'react-native-index-list';
import data from './PositionData';

type Props = {};
export default class App extends Component<Props> {
  state ={
    positions: []
  }
  
  _selectPostion = (position) => {
    if (this.state.positions[0] && this.state.positions[0].id == position.id) { // eslint-disable-line
      this.state.positions.splice(0);
    } else {
      this.state.positions.splice(0);
      this.state.positions.push(position);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <IndexedList
          data={data.atoz}
          pressCell={this._selectPostion}
          selected={this.state.positions}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
});
