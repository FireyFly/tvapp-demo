import React, {Component} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'

// TODO: this is far from ideal, but it works for now…
function deHTML(str) {
  // TODO: figure out if HTML entities are used? or in general what tags etc
  // are allowed in the summary… the API docs page doesn't seem to document
  // this.
  return str.replace(/<\/?p>/g, "")
}

function formatDate(date) {
  const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export default class EpisodeScreen extends Component {
  static navigationOptions = { title: "Episode details" }
  constructor(props) {
    super(props)
    this.state = Object.create(props.navigation.state.params)
  }
  render() {
    const {navigate} = this.props.navigation
    const { name, season, episode, imageFull, showName, url,
            aired, runtime, summary } = this.state
    return <View style={styles.container}>
             <Text style={styles.showName}>{showName}</Text>
             <Text style={styles.episodeName}>{name}</Text>
             <Image style={{width:'100%', height:'50%'}} source={imageFull} />
             <View style={{flex:1, flexDirection:'column'}}>
               <View style={styles.metadataCont}>
                 <Text style={styles.metadataLabel}>Season </Text>
                 <Text style={styles.metadataValue}>{season}</Text>
               </View>
               <View style={styles.metadataCont}>
                 <Text style={styles.metadataLabel}>Episode </Text>
                 <Text style={styles.metadataValue}>{episode}</Text>
               </View>
               <View style={styles.metadataCont}>
                 <Text style={styles.metadataLabel}>Aired </Text>
                 <Text style={styles.metadataValue}>{formatDate(aired)}</Text>
               </View>
               <View style={styles.metadataCont}>
                 <Text style={styles.metadataLabel}>Runs for </Text>
                 <Text style={styles.metadataValue}>{runtime} min</Text>
               </View>
               <Text style={styles.summary}>{deHTML(summary)}</Text>
             </View>
           </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#EEE',
  },

  showName: {
    fontSize:    28,
    margin:       8,
  },
  episodeName: {
    fontSize:    22,
    margin:       8,
  },

  metadataCont: {
    flexDirection: 'row',
    marginLeft:   8,
    marginRight:  8,
    marginTop:    4,
  },
  metadataLabel: {
    fontSize:    18,
    color:       '#999',
    width:       100,
  },
  metadataValue: {
    fontSize:    18,
  },

  summary: {
    fontSize:    18,
    margin:       8,
  },
})
