import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, ActivityIndicator, SectionList} from 'react-native'

export default class ResultsView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      title:     "",
      sections:  [],
    }
    if (props.onConstruct != null) props.onConstruct(this)
  }

  render() {
    // Show a spinner if we're awaiting a result
    if (this.state.isLoading) {
      return <View style={{flex:1, alignItems:'center', justifyContent:'center' }}>
               <ActivityIndicator size="large" />
             </View>
    }

    // Point out clearly if there were no results
    // TODO: disambiguate between whether we had a query or not (only show
    //       "No results" if we actually performed a query)
    if (this.state.sections.length == 0) {
      return <View style={{flex:1, alignItems:'center', justifyContent:'center' }}>
               <Text style={styles.placeholder}>No results</Text>
             </View>
    }

    // We have results; show a nice list of results
    let formatEpisode = num => 'E' + (num < 10? '0' : '') + num
    let renderItem = ({item, section, index}) =>
        <View style={[styles.itemContainer,
                      { marginLeft:   10,
                        marginRight:  10,
                        marginTop:    index == 0? 4 : 0,
                        marginBottom: index == section.data.length-1? 14 : 0 }]}>
          <Image style={styles.itemImage} source={{uri: item.image}} />
          <Text style={[styles.itemText, {marginLeft:10, width:48}]}>{formatEpisode(item.episode)}</Text>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>

    let renderSectionHeader = ({section}) =>
        <View style={[styles.itemContainer, {backgroundColor:'#789'}]}>
          <Text style={[styles.itemText, {marginLeft:10, color:'#EEE'}]}>{section.title}</Text>
        </View>

    return <View style={{flex:1}}>
             <Text style={styles.title}>{this.state.title}</Text>
             <SectionList
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                sections={this.state.sections} />
           </View>
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex:            1,
    flexDirection: 'row',
    alignItems:    'center',
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
  placeholder: {
    fontSize:       28,
    color:         '#999',
  },
})
