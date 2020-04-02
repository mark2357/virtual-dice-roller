import React from 'react';
import PropTypes from 'prop-types';
import * as BABYLON from '@babylonjs/core';

export default class Scene extends React.Component {

    constructor(props) {
        super(props);
        this.scene = null;
        this.engine = null;
        this.canvas = null;
    }

    /**
     * @description
     * handles when the browser window resizes
     */
    onResizeWindow = () => {
      if (this.engine) {
        this.engine.resize();
      }
    }

    componentDidMount () {
      this.engine = new BABYLON.Engine(
          this.canvas,
          true,
          this.props.engineOptions,
          this.props.adaptToDeviceRatio
      );

      let scene = new BABYLON.Scene(this.engine);
      this.scene = scene;

      if (typeof this.props.onSceneMount === 'function') {
        this.props.onSceneMount({
          scene,
          engine: this.engine,
          canvas: this.canvas
        });
      } else {
        console.error('onSceneMount function not available');
      }

      // Resize the babylon engine when the window is resized
      window.addEventListener('resize', this.onResizeWindow);
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.onResizeWindow);
    }

    onCanvasLoaded = (c) => {
      if (c !== null) {
        this.canvas = c;
      }
    }

    render() {        
        let { width, height } = this.props;

        let opts = {};

        if (width !== null && height !== null) {
            opts.width = width;
            opts.height = height;
        }

        return (
            <canvas
                {...opts}
                ref={this.onCanvasLoaded}
            />
        )
    }
}

Scene.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	engineOptions: PropTypes.object,
	adaptToDeviceRatio: PropTypes.bool,
	onSceneMount: PropTypes.func,
}

Scene.defaultProps = {
	width: null,
	height: null,
	engineOptions: {},
	adaptToDeviceRatio: false,	
	onSceneMount: null,
};