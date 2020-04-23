import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Voice from '@react-native-community/voice';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Views
import MyRecordings from './views/MyRecordings';
import Profile from './views/Profile';
import MapView from './views/MapView';

export default App = () => {
  const [itemsList, setItemsList] = useState([])
  const [itemsListRendered, setItemsListRendered] = useState()
  let currentResult

  const renderList = () => {
    console.log(itemsListRendered)
    let renderedList = itemsList.map((item, key) =>
      <Text style={styles.welcome} key={key}>{item}</Text>
    )
    setItemsListRendered(renderedList)
  }  

  useEffect(() => {
    console.log(currentResult)
    return
  }, [currentResult])

  const isStartStopDetected = (spokenTextLowered) => {
    let startIndex = spokenTextLowered.indexOf('start')
    let stopIndex = spokenTextLowered.indexOf('stop')

    if(startIndex < stopIndex && startIndex !== -1 && stopIndex !== -1) {
      return true
    } else return false
  }

  const checkResults = (spokenText) => {
    let spokenTextLowered = spokenText.toLowerCase()
    console.log(spokenTextLowered)

    if(isStartStopDetected(spokenTextLowered)) {


      let unfilteresResult = spokenTextLowered
      let filteredResult = unfilteresResult.substring( unfilteresResult.lastIndexOf("start") + 6, unfilteresResult.lastIndexOf("stop") - 1)
      console.log(filteredResult)
      currentResult = filteredResult

      handleMircophone('stop')
      setTimeout(() => {
        handleMircophone('start')
      }, 1000);
      
    }
  }

  const handleEnding = () => {
    console.log('speech ended')
    console.log(currentResult)
    let oldList = itemsList
    oldList.push(currentResult)
    setItemsList(oldList)
    renderList()
  }

  const handleMircophone = async(action) => {

    if(action === 'start') {
      Voice.onSpeechStart = () => console.log('speech started');
      Voice.onSpeechEnd = () => handleEnding();
      Voice.onSpeechResults = (e) => checkResults(e.value[0]);

      try {
          await Voice.start('en-US');
      } catch (e) {
          console.error(e);
      }
    } else if(action === 'stop') {
      try {
        await Voice.stop();
        Voice.removeAllListeners()
      } catch (e) {
          console.error(e);
      }
    }
  }

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
       <Tab.Navigator initialRouteName="MyRecordings"
       screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MyRecordings') {
            iconName = 'ios-list'
          } else if (route.name === 'MapView') {
            iconName = 'md-map'
          } else if (route.name === 'Profile') {
            iconName = 'md-person'
          }

          return <Ionicons name={iconName} size={40} color={color}/>;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        showLabel: false,
        size: 30,
        style: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor:"#FFF",
          position:'absolute',
          padding:10, 
        },
        activeBackgroundColor: 'none'
      }}>
        <Tab.Screen name="MapView" component={MapView}/>
        <Tab.Screen name="MyRecordings" component={MyRecordings}/>
        <Tab.Screen name="Profile" component={Profile}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    alignSelf: 'flex-start'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
