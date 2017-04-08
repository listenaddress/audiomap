import React from 'react'
import Photo from './frame'
import Link from 'next/link'
import setEntry from '../lib/set-entry'

let rec
let audioChunks
let blob

export default class extends React.Component {
  dismiss (e) {
    if (this._shim === e.target ||
       this._photoWrap === e.target) {
      if (this.props.onDismiss) {
        this.props.onDismiss()
      }
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  getUserMedia () {
    navigator.mediaDevices.getUserMedia({audio:true})
      .then(stream => {
        console.log('stream', stream)
        rec = new MediaRecorder(stream)
        rec.ondataavailable = e => {
          audioChunks.push(e.data)
          if (rec.state == "inactive"){
            blob = new Blob(audioChunks,{type:'audio/x-mpeg-3'})
            const src = URL.createObjectURL(blob)
            this.setState({ src })
            console.log('src', src)
            // recordedAudio.controls = true
            // recordedAudio.autoplay = true
            // audioDownload.href = recordedAudio.src
            // audioDownload.download = 'mp3'
            // audioDownload.innerHTML = 'download'
          }
        }
      })
      .catch(e => console.log(e));
  }

  start = this.start.bind(this)
  stop = this.stop.bind(this)
  save = this.save.bind(this)
  cancel = this.cancel.bind(this)
  setPost = this.setPost.bind(this)

  start () {
    audioChunks = [];
    console.log('starting')
    this.setState({ recording: true })
    rec.start()
  }

  stop () {
    rec.stop()
    this.setState({ recording: false })
  }

  save () {
    const position = {
      lat: Number(this.props.url.query.lat),
      lng: Number(this.props.url.query.lng),
    }
    const onSave = this.props.onSave
    console.log('onSave', onSave)
    console.log('position', position)
    console.log('blob', blob)
    setEntry(position, blob).then(function (marker) {
      console.log('onSave', onSave)
      console.log('marker', marker)
      onSave(marker)
    })
  }

  cancel () {
    this.setState({ src: null })
  }

  componentDidMount () {
    // document.addEventListener('keydown', this.onKeyDown)
    this.getUserMedia()
    this.setPost(this.props)
  }

  setPost (props) {
    if (!props.markers) return
    console.log('setting post')
    const marker = props.markers.filter(function (obj) {
      return obj.key === props.url.query.key
    })

    console.log('setting marker', marker)
    this.setState({ marker: marker[0] })
  }

  render () {
    return (
      <div ref={el => (this._shim = el)} className='shim' onClick={(e) => this.dismiss(e)}>
        <div ref={el => (this._photoWrap = el)} className='photo'>
          <div className='post'>
            <div className='content'>
              {
                !this.state.marker &&
                !this.state.src &&
                <div>
                  <button onClick={this.start} disabled={this.state.recording}>start recording</button>
                  <button onClick={this.stop} disabled={!this.state.recording}>stop</button>
                </div>
              }
              {
                this.state.recording &&
                <p>🎤</p>
              }
              {
                this.state.src &&
                <div>
                  <p>preview</p>
                  <audio autoPlay="true" controls="true" src={this.state.src}></audio>
                </div>
              }
              {
                this.state.marker &&
                <audio autoPlay="true" controls="true" src={this.state.marker.audio}></audio>
              }
            </div>

            <div className='sidebar'>
              <ul className='sidebarList'>
                <li>
                  {
                    this.state.src &&
                    <div>
                      <button onClick={this.save}>save</button>
                      <button onClick={this.cancel}>cancel</button>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shim {
            position: fixed;
            background: rgba(0,0,0,.65);
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
          }

          .photo {
            position: absolute;
            top: 50%;
            width: 100%;
            margin-top: -250px;
          }

          .post {
            width: 800px;
            overflow: hidden;
            height: 500px;
            display: table;
            margin: 0 auto;
          }

          .content {
            float: left;
            width: 600px;
            height: 500px;
            background: #333;
            color: #fff;
            text-align: center;
            vertical-align: middle;
            line-height: 100px;
            font-size: 40px;
          }

          .sidebar {
            float: right;
            background: #fff;
            width: 200px;
            height: 500px;
            text-align: left;
            box-sizing: border-box;
            padding: 20px;
            font-family: Monaco;
            font-size: 11px;
          }

          .sidebarList {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </div>
    )
  }
}
