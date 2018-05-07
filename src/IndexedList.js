/**
 * IndexedList
 * Created by xinlc on 07/05/2018.
 * @flow
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

type Props = {
  containerStyle?: View.propTypes.style,
};

type State = {
};

export default class IndexedList extends PureComponent<Props, State> {
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { containerStyle, ...rest } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <Text>Hello World!!!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
