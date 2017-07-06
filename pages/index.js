import React from 'react'
import Router from 'next/router'
import { withGoogleMap } from 'react-google-maps'
import Modal from '../components/modal'
import Map from '../components/map'
import getEntries from '../lib/get-entries'
let queryParams

export default class extends React.Component {
  static async getInitialProps () {
    const markers = await getEntries()

    return {
      photos: new Array(15).fill(0).map((v, k) => k + 1),
      markers: markers
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      markers: props.markers
    }
  }

  componentWillMount () {
    const { url } = this.props

    if (url.query.lat && url.query.lng) {
      queryParams = {
        lat : Number(url.query.lat),
        lng: Number(url.query.lng)
      }
    }
  }

  componentDidMount () {
    const self = this
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }, function(err) {
        self.setUserLocation()
      })
    } else {
      self.setUserLocation()
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter())
    }
  }

  onKeyDown (e) {
    if (!this.props.url.query.photoId) return
    if (e.keyCode === 27) {
      this.props.url.back()
    }
  }

  dismissModal () {
    Router.push('/')
  }

  showPhoto (e, id) {
    e.preventDefault()
    Router.push('/?record=100', '/record=100')
  }

  setMarker = this.setMarker.bind(this)
  setUserLocation = this.setUserLocation.bind(this)

  setMarker () {
    const nextMarkers = [
      ...this.state.markers, arguments[0],
    ]
    this.setState({
      markers: nextMarkers,
    })
    Router.push('/')
  }

  setUserLocation (userLocation) {
    this.setState({userLocation})
    this.setState({userLocationSet: true})
  }

  render () {
    const { url, photos, markers, markerInput } = this.props

    return (
      <div>
        {
          !this.state.userLocationSet &&
            <img className="loadingImage" src="https://web.archive.org/web/20091024052842/http://www.geocities.com/al_3abarat/Audio.gif"/>
        }
        {
          this.state.userLocationSet &&
            <Map markers={this.state.markers} markerInput={markerInput} userLocation={this.state.userLocation} queryParams={queryParams}/>
        }
        {
          url.query.record &&
            <Modal
              id={1}
              onDismiss={() => this.dismissModal()}
              onSave={this.setMarker}
              url={url}
            />
        }
        {
          url.query.key &&
            <Modal
              id={1}
              viewing={true}
              onDismiss={() => this.dismissModal()}
              url={url}
              markers={this.state.markers}
            />
        }
        <style jsx>{`
          :global(body) {
            overflow-y: hidden;
            margin: 0px;
          }

          .list {
            padding: 50px;
            text-align: center;
          }

          .loadingImage {
            position: absolute;
            left: 20%;
            top: 35%;
          }

          .photo {
            display: inline-block;
          }

          .photoLink {
            color: #333;
            verticalAlign: middle;
            cursor: pointer;
            background: #eee;
            display: inline-block;
            width: 250px;
            height: 250px;
            line-height: 250px;
            margin: 10px;
            border: 2px solid transparent;
          }

          .photoLink:hover {
            borderColor: blue;
          }
        `}</style>
      </div>
    )
  }
}
