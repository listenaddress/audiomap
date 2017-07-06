import { default as React, Component } from 'react'
import { withGoogleMap, GoogleMap, Marker, places, InfoWindow } from 'react-google-maps'
import withScriptjs from 'react-google-maps/lib/async/withScriptjs'
import Router from 'next/router'
let defaultCenter
let styles

const AsyncMap = withScriptjs(
  withGoogleMap(props => (
    <div>
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={15}
        defaultCenter={props.defaultCenter}
        onClick={props.onMapClick}
        defaultOptions={{ styles: styles }}
      >
        {props.markers.map(marker => (
          <Marker
            {...marker}
            onRightClick={() => props.onMarkerRightClick(marker)}
            onClick={() => props.onMarkerClick(marker)}
          />
        ))}
        {
          props.userLocation && !props.queryParams &&
            <InfoWindow
              children={
                <div>
                  <button
                    onClick={() =>
                      Router.push(
                        `/?record=true&lat=${props.userLocation.lat}&lng=${props.userLocation.lng}`,
                        `/?record=true&lat=${props.userLocation.lat}&lng=${props.userLocation.lng}`
                      )}
                  >
                    Record something
                  </button>
                </div>
              }
              position={props.userLocation}
            />
        }
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


  // Set map's defaultCenter to the params in the url if they're there
  // Otherwise set it to the users location if it's given
  // Otherwise set it to Dolores Park
  componentWillMount() {
    if (this.props.queryParams) {
      defaultCenter = this.props.queryParams
      return
    }

    defaultCenter = this.props.userLocation ?
      this.props.userLocation : { lat: 37.76026565039252, lng: -122.42709160374943 }
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

  handleMapClick = this.handleMapClick.bind(this)
  handleMarkerClick = this.handleMarkerClick.bind(this)
  handleMarkerRightClick = this.handleMarkerRightClick.bind(this)

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
        <div className="info">click anywhere on this immaculate google map to record audio thx 4 bein you</div>
        <AsyncMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0V1PJO-7iIm5vphhZXw_VfBgMtJDntn4&libraries=places"
          loadingElement={
            <div style={{ height: `100%` }}>
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
          userLocation={this.props.userLocation}
          defaultCenter={defaultCenter}
          queryParams={this.props.queryParams}
        />
        <style jsx>{`
          .info {
            position: absolute;
            right: 30px;
            top: 10px;
            font-size: 18px;
            border: 1px solid;
            background-color: #f4b3f5;
            z-index: 1;
          }
        `}</style>
      </div>
    )
  }
}

styles = [
  {
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]
