import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, ActivityIndicator, SectionList} from 'react-native'

/**
 * Shows episodes for the found TV series.  Data is passed via props:
 *   - The `isLoading` prop should be set to indicate whether we are awaiting
 *     a result to display,
 *   - The `query` prop should be set to the current search query,
 *   - The `results` prop should be an object with a `title` field (string)
 *     and a `sections` field (SectionList sections set).
 */
export default class ResultsView extends Component {
  render() {
    // Show a spinner if we're awaiting a result
    if (this.props.isLoading) {
      return <View style={styles.placeholderContainer}>
               <ActivityIndicator size="large" />
             </View>
    }

    // Show placeholder text if there's no search results
    if (this.props.results.sections.length == 0) {
      return <View style={styles.placeholderContainer}>
               <Text style={styles.placeholder}>{
                  this.props.query == ""? "Enter query" : "No results"
                }</Text>
             </View>
    }

    // We have results; show a nice list of results
    let formatEpisode = num => 'E' + (num < 10? '0' : '') + num
    let renderItem = ({item, section, index}) =>
        <View style={[ styles.itemContainer,
                       // Additional margin for first & last item of section
                       { marginTop:    index == 0?                      4 : 0,
                         marginBottom: index == section.data.length-1? 14 : 0 } ]}>
          <Image style={styles.itemImage} source={item.image} />
          <Text style={[styles.itemText, {marginLeft:10, width:48}]}>{formatEpisode(item.episode)}</Text>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>

    let renderSectionHeader = ({section}) =>
        <View style={[ styles.itemContainer, {marginLeft:0, marginRight:0, backgroundColor:'#789'} ]}>
          <Text style={[ styles.itemText, {marginLeft:10, color:'#EEE'} ]}>{section.title}</Text>
        </View>

    return <View style={{flex:1}}>
             <Text style={styles.title}>{this.props.results.title}</Text>
             <SectionList renderItem={renderItem}
                          renderSectionHeader={renderSectionHeader}
                          sections={this.props.results.sections} />
           </View>
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex:            1,
    flexDirection: 'row',
    alignItems:    'center',
    marginLeft:     10,
    marginRight:    10,
    padding:         2,
    height:         44,
  },
  itemImage: {
    width:          40,
    height:         40,
    borderRadius:    4,
  },
  itemText: {
    fontSize:       18,
  },
  title: {
    fontSize:       28,
    marginLeft:     10,
    marginRight:    10,
    marginTop:      10,
    marginBottom:   20,
  },
  placeholderContainer: {
    flex:            1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize:       28,
    color:         '#999',
  },
})
