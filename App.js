import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import {StackNavigator} from 'react-navigation'

import SearchField from './lib/SearchField.js'
import ResultsView from './lib/ResultsView.js'
import EpisodeScreen from './lib/EpisodeScreen.js'

//-- API interface --------------------------------------------------
const placeholderIcon = require('./res/placeholder.png')

const API = {
  // Search for all episodes for a given show
  searchSingle: async function (query) {
    const NO_RESULTS = { title: "", sections: [] }

    // Skip API request if the search query is empty
    if (query.trim().length == 0) return NO_RESULTS

    let res = await fetch(`http://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query).replace(/%20/g,'+')}&embed=episodes`)

    // Check for no search result
    if (res.status == 404) return NO_RESULTS

    if (!res.ok) {
      let err = new Error(res.statusText)
      err.code = res.status
      throw err
    }

    // We're good; parse JSON and process API response
    let json = await res.json()

    let episodes = json._embedded.episodes.map(e => ({
      // For the SectionList item
      key:        e.id,
      name:       e.name,
      season:     e.season,
      episode:    e.number,

      imageMenu:  e.image == null? placeholderIcon : {uri: e.image.medium},
      imageFull:  e.image == null? placeholderIcon : {uri: e.image.original},

      // Extended data, to show in the per-episode view
      showName:   json.name,
      url:        e.url,
      aired:      new Date(e.airstamp),
      runtime:    e.runtime,
      summary:    e.summary,
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

    return { title: json.name, sections }
  },
}

//-- Root component -------------------------------------------------
class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search for TV series',
  }
  constructor(props) {
    super(props)
    this.state = {
      query:     "",
      isLoading: false,
      results:   { title: "", sections: [] },
    }
  }
  render() {
    const {navigate} = this.props.navigation
    return <View style={styles.container}>
             <SearchField style={{margin: 10}}
               onPreSearch={ query => this.setState({ isLoading: true, query }) }
               onSearch={ query => API.searchSingle(query)
                                     .then(res => this.setState({ isLoading: false, results: res }))
                                     .catch(err => console.warn(err)) } />
             <ResultsView query={this.state.query}
                          isLoading={this.state.isLoading}
                          results={this.state.results}
                          onPress={ item => navigate('Episode', item) } />
           </View>
  }
}

const App = StackNavigator({
  Home:    { screen: SearchScreen  },
  Episode: { screen: EpisodeScreen },
})
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
  },
})
