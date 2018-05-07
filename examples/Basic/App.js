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

type Props = {};
export default class App extends Component<Props> {
  state ={
  }

  render() {
    return (
      <View style={styles.container}>
        <IndexedList
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
