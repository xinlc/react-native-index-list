
# react-native-index-list

[![npm package](https://img.shields.io/npm/v/react-native-index-list.svg?style=flat-square)](https://www.npmjs.org/package/react-native-index-list)
[![npm downloads](https://img.shields.io/npm/dt/react-native-index-list.svg)](https://www.npmjs.com/package/react-native-index-list)

A Listview with a sidebar to directly jump to sections.

## Example

![](./docs/ios.gif)

## Installation

```bash
$ npm install --save react-native-index-list
```

## Usage

[See the example](./examples/Basic/App.js)

## Customized

```js
import { SelectableSectionsListView } from 'react-native-index-list';

...
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
...

```
> More available `SelectableSectionsListView` API can be found at [readme](./src/components/README.md)
