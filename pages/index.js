import React from 'react'
import Router from 'next/router'
import { withGoogleMap } from 'react-google-maps'

import Modal from '../components/modal'

import Map from '../components/map'

import getEntries from '../lib/get-entries'

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

  setMarker () {
    console.log('arguments', arguments[0])
    const nextMarkers = [
      ...this.state.markers, arguments[0],
    ]
    this.setState({
      markers: nextMarkers,
    })
    Router.push('/')
  }

  render () {
    const { url, photos, markers, markerInput } = this.props

    return (
      <div>
        <div className="info">click to record audio on this immaculate google map thx 4 bein you</div>
        <Map markers={this.state.markers} markerInput={markerInput}/>
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
          .info {
            position: absolute;
            right: 30px;
            top: 10px;
            border: 1px solid;
            background-color: wheat;
            z-index: 1;
          }
          .list {
            padding: 50px;
            text-align: center;
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
