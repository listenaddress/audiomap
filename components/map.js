import { default as React, Component } from 'react'
import { withGoogleMap, GoogleMap, Marker, places, InfoWindow } from 'react-google-maps'
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import SearchBox from "react-google-maps/lib/places/SearchBox"
import Router from 'next/router'

const AsyncMap = withScriptjs(
  withGoogleMap(props => (
    <div>
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: 37.76026565039252, lng: -122.42709160374943 }}
        onClick={props.onMapClick}
      >
        {props.markers.map(marker => (
          <Marker
            {...marker}
            onRightClick={() => props.onMarkerRightClick(marker)}
            onClick={() => props.onMarkerClick(marker)}
          />
        ))}
      </GoogleMap>
    </div>
  ))
)

export default class extends React.Component {
  static getInitialProps () {
    return {
      photos: new Array(15).fill(0).map((v, k) => k + 1)
    }
  }

  constructor (props) {
    super(props)
    this.state = { markerInput: [] }
  }

  componentDidMount () {
    const markers = this.props.markers;
    this.setState({ markers });
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  dismissModal () {
    Router.push('/')
  }

  handleMapLoad = this.handleMapLoad.bind(this)
  handleMapClick = this.handleMapClick.bind(this)
  handleMarkerClick = this.handleMarkerClick.bind(this)
  handleMarkerRightClick = this.handleMarkerRightClick.bind(this)

  handleMapLoad(map) {
    this._mapComponent = map
    if (map) {
      console.log(map.getZoom())
    }
  }

  handleMapClick(event) {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }

    Router.push(
      `/?record=true&lat=${position.lat}&lng=${position.lng}`,
      `/?record=true&lat=${position.lat}&lng=${position.lng}`
    )
  }

  handleMarkerClick(targetMarker) {
    Router.push(
      `/?key=${targetMarker.key}`,
      `/?key=${targetMarker.key}`
    )
  }

  handleMarkerRightClick(targetMarker) {
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker)
    this.setState({
      markers: nextMarkers,
    })
  }

  render () {
    return (
      <div style={{ height: `100vh`, width: `100vw` }}>
        <AsyncMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0V1PJO-7iIm5vphhZXw_VfBgMtJDntn4&libraries=places"
          loadingElement={
            <div style={{ height: `100%` }}>
              <h1>loading...</h1>
            </div>
          }
          containerElement={
            <div style={{ height: `100%`, width: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%`, width: `100%` }} />
          }
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.props.markers}
          markerInput={this.state.markerInput}
          onMarkerClick={this.handleMarkerClick}
          onMarkerRightClick={this.handleMarkerClick}
        />
      </div>
    )
  }
}

// <SearchBox
//   controlPosition={window.google.maps.ControlPosition.TOP_CENTER}
//   inputPlaceholder="Customized your placeholder"
// />

// {props.markerInput.map(marker => (
//   <div>
//     <Marker
//       {...marker}
//     />
//     <InfoWindow
//       position={marker.position}
//       options={{pixelOffset: new google.maps.Size(0,-30)}}
//     >
//       <div>
//         <button>Record</button>
//         <marquee>/\/\___/\______/\</marquee>
//       </div>
//     </InfoWindow>
//   </div>
// ))}
