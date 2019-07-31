import React from 'react';
import { 
  StyleSheet,
  Text, 
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  Slider,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

class App extends React.Component {

  constructor(props) {
    super(props)

    this.scrollOffset = 0

    this.animation = new Animated.ValueXY({ x:0, y: (SCREEN_HEIGHT - 80) })
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if ((this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 0)
            || ( !this.state.isScrollEnabled && gestureState.dy < 0)) {
          return true
        } else {
          return false
        }
      },
      // onMoveShouldSetPanResponder: e => true,
      onPanResponderGrant: (e, gestureState) => {
        this.animation.extractOffset()
      },
      onPanResponderMove: (e, gestureState) => {
        this.animation.setValue({ x: 0, y: gestureState.dy })
      },
      onPanResponderRelease: (e, gestureState) => {

        if (gestureState.moveY > SCREEN_HEIGHT - 120) {
          Animated.spring(this.animation.y, {
            toValue: 0, 
            tension: 1
          }).start()
        }
        else if (gestureState.moveY < 120) {
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start()
        }
        else if(gestureState.dy < 0) {
          this.setState({ isScrollEnabled: true })
          Animated.spring(this.animation.y, {
            toValue: -SCREEN_HEIGHT + 120,
            tension: 0.5
          }).start()
        }
        else if (gestureState.dy > 0) {
          this.setState({ isScrollEnabled: false })
          Animated.spring(this.animation.y, {
            toValue: SCREEN_HEIGHT - 120,
            tension: 0.5
          }).start()
        }
      }
    })
  }

  state = {
    isScrollEnabled: false
  }

  componentDidMount() {
    // this.animation = new Animated.ValueXY({ x:0, y: (SCREEN_HEIGHT - 80) })
    
  }

  render() {

    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    }

    animatedImageHeight = this.animation.y.interpolate({
      inputRange: [ 0, SCREEN_HEIGHT - 80 ],
      outputRange: [ 200, 32 ],
      extrapolate: 'clamp'
    })
    animatedSongTitleOpacity  = this.animation.y.interpolate({
      inputRange: [ 0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80 ],
      outputRange: [ 0, 0, 1 ],
      extrapolate: 'clamp'
    })
    animatedImageMarginLeft = this.animation.y.interpolate({
      inputRange: [ 0, SCREEN_HEIGHT - 80 ],
      outputRange: [ SCREEN_WIDTH/2 - 100, 10 ],
      extrapolate: 'clamp'
    })
    animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [ 0, SCREEN_HEIGHT - 80 ],
      outputRange: [ SCREEN_HEIGHT/2, 80 ],
      extrapolate: 'clamp'
    })
    animatedSongDetailsOpacity  = this.animation.y.interpolate({
      inputRange: [ 0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80 ],
      outputRange: [ 1, 0, 0 ],
      extrapolate: 'clamp'
    })
    
    return (
      <Animated.View 
        { ...this.panResponder.panHandlers }
        style={ styles.container }
      >
        <Animated.View style={[ animatedHeight, styles.panResponser ] }>
          <ScrollView
            scrollEnabled={ this.state.isScrollEnabled }
            scrollEventThrottle={ 16 }
            onScroll={ (e) => {
              this.scrollOffset = e.nativeEvent.contentOffset.y
            }}
          >
            <Animated.View 
              style={{
                height: animatedHeaderHeight,
                paddingHorizontal: 10,
                borderTopWidth: 1,
                borderTopColor: '#EBE5E5',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={ styles.imageAndText }>
                <Animated.View style={{
                  height: animatedImageHeight,
                  width: animatedImageHeight,
                  marginLeft: animatedImageMarginLeft
                }}>
                  <Image
                    style={ styles.image }
                    source={ require('./assets/AndHurtingStop.jpg') }
                  />
                </Animated.View>
                <Animated.Text style={{
                  opacity: animatedSongTitleOpacity,
                  fontSize: 18, 
                  paddingLeft: 10
                }}>
                  And Hurting Stop
                </Animated.Text>
              </View>
              <Animated.View style={{
                opacity: animatedSongTitleOpacity,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}>
                <Ionicons name='md-pause' size={ 32 }/>
                <Ionicons name='md-play' size={ 32 }/>
              </Animated.View>
            </Animated.View>
            <Animated.View style={{
              height: animatedHeaderHeight,
              opacity: animatedSongDetailsOpacity
            }}>
              <View style={{ 
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22 }}>
                    And Hurting Stop
                </Text>
              </View>
              <View style={{
                height: 40,
                width: SCREEN_WIDTH,
                alignItems: 'center' 
              }}>
                <Slider
                  style={{ width: 300 }}
                  step={ 1 }
                  minimumValue={ 18 }
                  maximumValue={ 71 }
                  value={ 18 }
                />
              </View>
              <View style={{
                flex: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:'space-around'
              }}>
                <Ionicons name="md-rewind" size={ 40 }/>
                <Ionicons name="md-pause" size={ 50 }/>
                <Ionicons name="md-fastforward" size={ 40 }/>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingBottom: 20
              }}>
                <Ionicons name='md-add' size={ 32 } style={{ color: '#AB77C6' }}/>
                <Ionicons name='md-more' size={ 32 } style={{ color:'#AB77C6' }}/>
              </View>
            </Animated.View>
            <View style={{ height: 1000 }}></View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panResponser: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'white',
    height: SCREEN_HEIGHT
  },
  bottomBarCradle: {
    height: 80,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#EBE5E5',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageAndText: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageCradle: {
    height: 32,
    width: 32,
    marginLeft: 10,
  },
  image: {
    flex: 1,
    width: null,
    height: null
  },
  text: {
    opacity: 1,
    fontSize: 18, 
    paddingLeft: 10
  },
  buttons: {
    opacity: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default App