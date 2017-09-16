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

/** Implements a search field component, with built-in debounce.  Searches are
 *  performed as a query is typed (with a debounce delay), or as soon as
 *  enter/search is pressed.  Props are passed onto the TextInput as well.
 *
 *  Props:
 *  - `onSearch`: (required) function to call when a search occurs, receives
 *    the search query as its parameter,
 *  - `onPreSearch`: (optional) function to call as soon as a search starts,
 *    receives the search query as its parameter.
 */
export default class SearchField extends Component {
  constructor(props) {
    super(props)
    this.state = {query: ''}
    if (this.props.onSearch == null) throw new Error("SearchField: onSearch prop required")
    this.debouncedOnSearch = debounce(query => this.props.onSearch(query))
  }
  render() {
    return <TextInput {...this.props}
             style={[ styles.searchField, this.props.style ]}
             onChangeText={ query => {
               this.setState({ query })
               if (this.props.onPreSearch != null) this.props.onPreSearch(query)
               this.debouncedOnSearch(600, query)
             } }
             onEndEditing={ () => this.debouncedOnSearch(0, this.state.query) }
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
