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
    if (this.state.isLoading) {
      return <View style={{flex:1, alignItems:'center', justifyContent:'center' }}>
               <ActivityIndicator size="large" />
             </View>
    }

    let formatEpisode = num => 'E' + (num < 10? '0' : '') + num
    let renderItem = ({item}) =>
        <View style={[styles.itemContainer, {marginLeft:10, marginRight:10}]}>
          <Image style={styles.itemImage} source={{uri: item.image}} />
          <Text style={[styles.itemText, {marginLeft:10, width:48}]}>{formatEpisode(item.episode)}</Text>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>

    let renderSectionHeader = ({section}) =>
        <View style={[styles.itemContainer, {backgroundColor:'#999'}]}>
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
  itemContainer: { flex:1, flexDirection:'row', padding:2, height:44, alignItems:'center' },
  itemImage: { width: 40, height: 40, borderRadius: 4 },
  itemText: { fontSize:18 },
  title: { fontSize:28 },
})
