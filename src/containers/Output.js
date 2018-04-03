import React, { Component } from 'react'
import * as acorn from 'acorn'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import bios from '../utils/bios.js'
import screenTypes from '../utils/screenTypes.js'

const mapStateToProps = ({ screen, game, songs, chains, phrases }) => ({
  songs,
  chains,
  phrases,
  game: screen === screenTypes.BOOT ? bios : game,
  focus: screen === screenTypes.RUN,
  run: [screenTypes.BOOT, screenTypes.RUN].includes(screen)
})

const mapDispatchToProps = dispatch => ({
  finishBoot: () => dispatch(actions.finishBoot())
})

class Output extends Component {
  constructor (props) {
    super(props)

    this.handleBlur = this.props.focus ? this.handleBlur.bind(this) : this.noop
  }

  noop () {}

  handleBlur (e) {
    e.currentTarget.focus()
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    this._iframe.focus()
  }

  componentWillReceiveProps (nextProps) {
    if (this.isLoaded) {
      const { game } = nextProps
      if (game !== this.props.game) {
        this.evaluate(nextProps)
      }
    }
  }

  evaluate ({ game, finishBoot, run, songs, chains, phrases }) {
    // Validate code before drawing.
    let isValid = true
    try {
      acorn.parse(game)
    } catch (e) {
      isValid = false
    }

    if (isValid) {
      // Get the iframe.
      const iframe = window.frames[0]

      // Send iframe the game code.
      iframe.script8.callCode({
        game,
        songs,
        chains,
        phrases,
        run,
        endCallback: finishBoot
      })
    }
  }

  render () {
    return (
      <div className='Output'>
        <iframe
          src='iframe.html'
          title='SCRIPT-8'
          onBlur={this.handleBlur}
          ref={_iframe => {
            this._iframe = _iframe
          }}
          onLoad={() => {
            this.isLoaded = true
            this.evaluate(this.props)
          }}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Output)