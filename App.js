import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import SearchField from './lib/SearchField.js'
import ResultsView from './lib/ResultsView.js'

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
             <SearchField style={{margin: 10}}
               onPreSearch={ () => resultsView.setState({ isLoading: true }) }
               onSearch={ query => performSearch(query, resultsView) } />
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
