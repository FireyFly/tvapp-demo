import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import SearchField from './lib/SearchField.js'
import ResultsView from './lib/ResultsView.js'

//-- performSearch --------------------------------------------------
const placeholderIcon = require('./res/placeholder.png')
async function performSearch(query) {
  const NO_RESULTS = { isLoading:false, title:"", sections:[] }

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
    key:     e.id,
    name:    e.name,
    season:  e.season,
    episode: e.number,
    image:   e.image == null? placeholderIcon : {uri: e.image.medium}
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

  return { isLoading:false, title:json.name, sections }
}

//-- Root component -------------------------------------------------
export default class App extends Component {
  render() {
    let resultsView = null
    return <View style={styles.container}>
             <SearchField style={{margin: 10}}
               onPreSearch={ () => resultsView.setState({ isLoading: true }) }
               onSearch={ query => performSearch(query)
                                     .then(res => resultsView.setState(res))
                                     .catch(err => console.warn(err)) } />
             <ResultsView onConstruct={ obj => {resultsView = obj} } />
           </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#EEE',
  },
})
