import React, {Component} from 'react';
import {StyleSheet, TextInput} from 'react-native';

function debounce(fn) {
  let timeout = null
  return function (delay, ...args) {
    // Expire any previous timeout
    if (timeout != null) clearTimeout(timeout)
    // Call immediately or with a delay
    if (delay == 0) fn.apply(this, args)
    else timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default class SearchField extends Component {
  constructor(props) {
    super(props)
    this.state = {query: ''}
    this.debouncedOnSearch = debounce(query => this.props.onSearch(query))
  }
  render() {
    return <TextInput {...this.props}
             style={[ styles.searchField, this.props.style ]}
             onChangeText={ str => {
               this.setState({query: str})
               this.props.onPreSearch()
               this.debouncedOnSearch(600, str)
             } }
             onEndEditing={ () => this.debouncedOnSearch(0, this.state.query) }
             editable={true}
             placeholder="Search…"
             returnKeyType="search"
             value={this.state.query} />
  }
}

const styles = StyleSheet.create({
  searchField: {
    backgroundColor: '#D3D3D3',
    padding: 6,
    borderRadius: 8,
  },
})
