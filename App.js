import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator,
         SectionList, TextInput } from 'react-native';

//-- SearchField ----------------------------------------------------
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

class SearchField extends Component {
  constructor(props) {
    super(props)
    this.state = {text: ''}
    this.debouncedOnSearch = debounce(query => this.props.onSearch(query))
  }
  render() {
    return <TextInput {...this.props}
             style={styles.searchField}
             onChangeText={ str => {
               this.setState({text: str})
               this.props.onPreSearch()
               this.debouncedOnSearch(600, str)
             } }
             onEndEditing={ () => this.debouncedOnSearch(0, this.state.text) }
             editable={true}
             placeholder="Search…"
             returnKeyType="search"
             value={this.state.text} />
  }
}

//-- ResultsView ----------------------------------------------------
class ResultsView extends Component {
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
        <View style={[resultsStyles.itemContainer, {marginLeft:10, marginRight:10}]}>
          <Image style={resultsStyles.itemImage} source={{uri: item.image}} />
          <Text style={[resultsStyles.itemText, {marginLeft:10, width:48}]}>{formatEpisode(item.episode)}</Text>
          <Text style={resultsStyles.itemText}>{item.name}</Text>
        </View>

    let renderSectionHeader = ({section}) =>
        <View style={[resultsStyles.itemContainer, {backgroundColor:'#999'}]}>
          <Text style={[resultsStyles.itemText, {marginLeft:10, color:'#EEE'}]}>{section.title}</Text>
        </View>

    return <View style={{flex:1}}>
             <Text style={resultsStyles.title}>{this.state.title}</Text>
             <SectionList
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                sections={this.state.sections} />
           </View>
  }
}
const resultsStyles = StyleSheet.create({
  itemContainer: { flex:1, flexDirection:'row', padding:2, height:44, alignItems:'center' },
  itemImage: { width: 40, height: 40, borderRadius: 4 },
  itemText: { fontSize:18 },
  title: { fontSize:28 },
});

//-- performSearch --------------------------------------------------
const noPictureURI = 'http://firefly.nu/up/me.jpg'

function performSearch(query, resultsComponent) {
  // Skip API request if the search query is empty
  if (query.trim().length == 0) {
    resultsComponent.setState({ isLoading:false, title:"", sections:[] })
    return
  }

  fetch(`http://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query).replace(/%20/g,'+')}&embed=episodes`)
    .then(res => (console.warn(res.status), res.json()))
    .then(res => {
      let episodes = res._embedded.episodes.map(e => ({
        key:     e.id,
        name:    e.name,
        season:  e.season,
        episode: e.number,
        image:   e.image == null? noPictureURI : e.image.medium
      }))

      // Maps season numbers to episodes
      let seasonMap = {}
      for (let episode of episodes) {
        let key = episode.season
        if (seasonMap[key] == null) seasonMap[key] = []
        seasonMap[key].push(episode)
      }

      // Sections for the results SectionList
      let sections = Object.keys(seasonMap).map(Number)
                           .sort((a,b) => a-b)
                           .map(num => ({ data:  seasonMap[num],
                                          title: "Season " + num }))

      resultsComponent.setState({ isLoading:false, title:res.name, sections })
    })
    .catch(err => console.warn(err))
}

//-- Root component -------------------------------------------------
export default class App extends Component {
  render() {
    let resultsView = null
    return <View style={styles.container}>
             <SearchField
               onPreSearch={ () => resultsView.setState({ isLoading: true }) }
               onSearch={ query => performSearch(query, resultsView) } />
             <ResultsView onConstruct={ obj => {resultsView = obj} } />
           </View>
  }
}

//-- Stylesheet -----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#EEE',
  },

  searchField: {
    backgroundColor: '#D3D3D3',
    margin: 10,
    padding: 6,
    borderRadius: 8,
  },
});
