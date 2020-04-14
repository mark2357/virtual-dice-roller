// modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { AmmoJSPlugin } from '@babylonjs/core';

// proptypes
import { PersistentDataProps } from '../propTypes/PersistentDataProps';
import { FullScreenPanelDataProps } from '../propTypes/FullScreenPanelDataProps';

// providers
import { withPersistentDataContext } from './providers/PersistentDataProvider';
import { withFullScreenPanelContext } from './providers/FullScreenPanelProvider';

// components
import DiceButtons from './DiceButtons';
import Scene from './Scene';
import DiceRollTotalCounter from '../DiceRollTotalCounter';
import ResultPanel from './ResultPanel';
import CustomDiceRolls from './CustomDiceRolls';
import Button from './generics/Button';

// helper
import calcRandomVectorBetween from '../helpers/calcRandomVectorBetween';
import calculateCustomDiceRollResult from '../helpers/calculateCustomDiceRollResult';

// static minified js file
import * as Ammo from '../../../assets/ammo';

// constants
import PANEL_TYPES from '../constants/PanelTypes';

class Page extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diceRollArray: [],
            resultPanelVisible: false,
            resultText: '',
        }

        // stores the original  dice mesh and colliders mesh 
        this.dice = {
            mesh: {
                D4: null,
                D6: null,
                D8: null,
                D10: null,
                D12: null,
                D20: null,
            },
            collider: {
                D4: null,
                D6: null,
                D8: null,
                D10: null,
                D12: null,
                D20: null,
            }
        };
        this.customResultCalculation = null; //string value or null, should be null when standard dice calculation is used
        this.diceInstanceArray = []; // array of mesh colliders
        this.scene = null;
        this.engine = null;
        this.shadowGenerator = null;
        this.shadowLight = null; // the light that is used to cast shadows
        this.diceRollTotalCounter = new DiceRollTotalCounter(this.getDiceInstanceArray, this.displayRollResult);
    }

    componentDidUpdate(prevProps) {
        const { settings } = this.props.persistentData;
        const { settings: prevSettings } = prevProps.persistentData;


        // checks if the settings value for shadows has changed
        if (settings.shadowsEnabled !== prevSettings.shadowsEnabled) {
            if (settings.shadowsEnabled)
                this.enableShadows();
            else
                this.disableShadows();
        }
    }

    //#region initial load functions
    /**
     * @description
     * loads babylon file once scene has loaded
     * @param {{canvas: HTMLElement, scene: BABYLON.Scene, engine: BABYLON.Engine }} e
     */
    handleSceneMount = async (e) => {
        const { canvas, engine } = e;

        this.engine = engine;

        let scene = null;
        let sceneLoad = new Promise((resolve, reject) => {
            BABYLON.SceneLoader.Load("./assets/", "Scene.babylon", engine, function (newScene) {
                scene = newScene
                resolve();
            }, null, (scene, msg, exc) => {
                console.log(msg, exc);
                reject();
            });
        });

        // waits until scene has finished loading, uses promise as it's easier to debug when not inside a inline function
        await sceneLoad;

        this.scene = scene;
        //sets up physics
        let physicsEnginePlugin = new AmmoJSPlugin(true, Ammo);
        scene.enablePhysics(null, physicsEnginePlugin);

        //let physicsEngine = scene.getPhysicsEngine();
        // physicsEngine.setGravity(new BABYLON.Vector3(0, -0.1, 0));
        // physicsEngine.setSubTimeStep(1000/1000);

        this.createCamera(canvas);

        this.setupMaterials();

        this.createSkybox();

        this.createLightsAndShadows();

        this.processMeshes();

        // scene.debugLayer.show();
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    }

    /**
     * @description
     * creates and sets up the camera as one is not included in the scene
     * @param {any} canvas 
     */
    createCamera = (canvas) => {
        let camera = new BABYLON.ArcRotateCamera("camera1", 0, 0.6, 8, new BABYLON.Vector3(0, 0, 0), this.scene);

        // camera.panningSensibility = 0;
        camera.pinchPrecision = 100;
        camera.wheelPrecision = 100;
        camera.lowerRadiusLimit = 1;
        camera.upperRadiusLimit = 20;
        camera.minZ = 0.1;
        camera.maxZ = 100;

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

    }

    /**
     * @description
     * as the exporter unnecessarily bakes multi materials some cleanup is needed 
     */
    setupMaterials = () => {
        this.scene.materials.forEach((material) => {
            if (material.name === 'Dice Material') {
                material.albedoColor = new BABYLON.Color3(1, 0, 0);
            }
        });
    }

    /**
     * @description
     * creates skybox and reflection texture for each material
     */
    createSkybox = () => {

        // reflection texture
        let reflectionTexture = new BABYLON.CubeTexture("./assets/textures/skybox_sml/skybox", this.scene);
        reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;

        // applies reflection texture to all materials in scene
        this.scene.materials.forEach((material) => {
            if (['Dice Material', 'Wood'].includes(material.name)) {
                material.reflectionTexture = reflectionTexture;
            }
        });

        // skybox
        let skyboxTexture = new BABYLON.CubeTexture("./assets/textures/skybox_sml/skybox", this.scene);
        // let skyboxTexture = new BABYLON.HDRCubeTexture("/assets/cayley_interior_8k.hdr", this.scene, 1024);


        let skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this.scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = skyboxTexture;
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    }

    /**
     * @description
     * creates shadow caster and sets it's settings
     */
    createLightsAndShadows = () => {

        this.shadowLight = this.scene.lights[0];
        if (this.shadowLight !== null && this.shadowLight !== undefined) {

            this.shadowGenerator = new BABYLON.ShadowGenerator(512, this.shadowLight);
            this.shadowGenerator.bias = 0.02;
            this.shadowGenerator.usePoissonSampling = true;
            this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
            // this.shadowGenerator.usePercentageCloserFiltering = true;
            this.shadowLight.autoCalcShadowZBounds = true;
            this.shadowLight.intensity = 2;
        }
        const { settings } = this.props.persistentData;
        if (!settings.shadowsEnabled) {
            this.disableShadows();
        }
    }

    /** 
     * @description
     * adds dice mesh to arrays and adds physics to the walls and floor
     */
    processMeshes = () => {
        this.scene.meshes.forEach((mesh) => {
            switch (mesh.name) {
                case 'D4 Dice':
                    this.dice.mesh.D4 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D6 Dice':
                    this.dice.mesh.D6 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D8 Dice':
                    this.dice.mesh.D8 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D10 Dice':
                    this.dice.mesh.D10 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D12 Dice':
                    this.dice.mesh.D12 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D20 Dice':
                    this.dice.mesh.D20 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D4 Dice Collider':
                    this.dice.collider.D4 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D6 Dice Collider':
                    this.dice.collider.D6 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D8 Dice Collider':
                    this.dice.collider.D8 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D10 Dice Collider':
                    this.dice.collider.D10 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D12 Dice Collider':
                    this.dice.collider.D12 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'D20 Dice Collider':
                    this.dice.collider.D20 = mesh;
                    mesh.isVisible = false;
                    break;
                case 'Ground':
                case 'Wall 1':
                case 'Wall 2':
                case 'Wall 3':
                case 'Wall 4':
                    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, this.scene);
                    break;
            }
        });
    }

    //#endregion


    /**
     * @description
     * creates shadow caster and adds objects that need to cast shadows to the list of shadow casters
     */
    enableShadows() {
        if (this.shadowLight !== null) this.shadowLight.shadowEnabled = true;
    }

    /**
     * @description
     * destroys shadow caster
     */
    disableShadows() {
        if (this.shadowLight !== null) this.shadowLight.shadowEnabled = false;
    }

    /**
     * @description
     * adds the mesh to the list of shadow casters for the shadow generator
     * 
     * @param {BABYLON.Mesh} mesh 
     * @param {Boolean} includeDescendants 
     */
    addShadowCaster(mesh, includeDescendants) {
        if (this.shadowGenerator !== null)
            this.shadowGenerator.addShadowCaster(mesh, includeDescendants);
    }

    /**
     * @description
     * function used to get current diceInstanceArray 
     */
    getDiceInstanceArray = () => {
        return this.diceInstanceArray;
    }

    /**
     * @description
     * handles when the roll dice buttons are pressed
     * @param {Array<number>} diceSidesArray an array of numbers representing the number of sides of the dice
     * @param {string | undefined} customResultCalculation custom way of calculating result 
     */
    handleDiceRollButtonOnClick = (diceSidesArray, customResultCalculation) => {
        this.diceRollTotalCounter.stopChecking();

        if (customResultCalculation !== undefined) {
            this.customResultCalculation = customResultCalculation;
        }
        else this.customResultCalculation = null;


        // remove old dice
        this.diceInstanceArray.forEach(diceInstance => {
            diceInstance.dispose();
        });
        this.diceInstanceArray = [];

        // create new dice
        for (let i = 0; i < diceSidesArray.length; i++) {
            const diceSides = diceSidesArray[i];
            this.createDiceInstance(diceSides);
        }

        this.setState({ resultPanelVisible: false });

        this.diceRollTotalCounter.startChecking();
    }

    /**
     * @description
     * @param {number} diceSides 
     */
    createDiceInstance(diceSides) {
        const linearDamping = 0;
        const angularDamping = 0;
        const positionMin = new BABYLON.Vector3(-2, 1, -2);
        const positionMax = new BABYLON.Vector3(2, 1, 2);
        const velocityLinearMin = new BABYLON.Vector3(0, 0, 0);
        const velocityLinearMax = new BABYLON.Vector3(5, 0, 5);
        const velocityAngularMin = new BABYLON.Vector3(-10, -10, -10);
        const velocityAngularMax = new BABYLON.Vector3(10, 10, 10);


        let meshOriginal = null;
        let collider = null;
        switch (diceSides) {
            case 4:
                meshOriginal = this.dice.mesh.D4;
                collider = this.dice.collider.D4;
                break;
            case 6:
                meshOriginal = this.dice.mesh.D6;
                collider = this.dice.collider.D6;
                break;
            case 8:
                meshOriginal = this.dice.mesh.D8;
                collider = this.dice.collider.D8;
                break;
            case 10:
                meshOriginal = this.dice.mesh.D10;
                collider = this.dice.collider.D10;
                break;
            case 12:
                meshOriginal = this.dice.mesh.D12;
                collider = this.dice.collider.D12;
                break;
            case 20:
                meshOriginal = this.dice.mesh.D20;
                collider = this.dice.collider.D20;
                break;
        }
        if (meshOriginal !== null && collider !== null) {
            let colliderInstance = collider.clone(`collider instance D${diceSides}`);

            colliderInstance.physicsImpostor = new BABYLON.PhysicsImpostor(colliderInstance, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0.001, friction: 0.5, restitution: 0 }, this.scene);

            let instance = meshOriginal.clone(`instance D${diceSides}`);
            instance.isVisible = true;
            this.addShadowCaster(instance, false);
            colliderInstance.addChild(instance);
            colliderInstance.isVisible = false;

            colliderInstance.physicsImpostor.physicsBody.setDamping(linearDamping, angularDamping);
            colliderInstance.physicsImpostor.physicsBody.getCollisionShape().setMargin(0);


            const position = calcRandomVectorBetween(positionMin, positionMax);
            colliderInstance.position = position;
            let linearVelocity = calcRandomVectorBetween(velocityLinearMin, velocityLinearMax);
            if (position.x > 0) linearVelocity.x *= -1;
            if (position.z > 0) linearVelocity.z *= -1;

            colliderInstance.physicsImpostor.setLinearVelocity(linearVelocity);
            colliderInstance.physicsImpostor.setAngularVelocity(calcRandomVectorBetween(velocityAngularMin, velocityAngularMax));
            this.diceInstanceArray.push(colliderInstance);
        }
    }

    /**
     * @description
     * displays the result of a dice roll
     * @param {Array<number>} diceRollArray
     */
    displayRollResult = (diceRollArray) => {

        let resultText = '';
        if (this.customResultCalculation !== null) {
            resultText = calculateCustomDiceRollResult(diceRollArray, this.customResultCalculation).message;
        }
        else {
            resultText = '[';
            let totalRoll = 0;
            for (let i = 0; i < diceRollArray.length; i++) {
                const roll = diceRollArray[i];

                totalRoll += roll;

                resultText += `${roll}`;
                if (i < diceRollArray.length - 1) resultText += ', ';
            }

            resultText += `] Total: ${totalRoll}`;
        }
        this.setState({ diceRollArray, resultPanelVisible: true, resultText });
    }

    /**
     * @description
     * hides result panel, is passed to child components
     */
    hideResultPanel = () => {
        this.setState({ resultPanelVisible: false });
    }

    /**
     * @description
     * handles when the settings button is clicked
     */
    handleSettingButtonOnClick = () => {
        const { fullScreenPanelData } = this.props;
        fullScreenPanelData.showPanel(PANEL_TYPES.SETTINGS_PANEL, {engine: this.engine});
    };


    render() {

        const {
            resultPanelVisible,
            resultText,
        } = this.state;

        return (
            <div className='page'>
                <Scene
                    onSceneMount={this.handleSceneMount}
                />

                <div className='ui-container'>
                    <div className='side-buttons-container'>

                        <DiceButtons
                            onClick={this.handleDiceRollButtonOnClick}
                        />
                        <CustomDiceRolls
                            onDiceRollClick={this.handleDiceRollButtonOnClick}
                        />
                    </div>

                    <div className='bottom-row-container'>
                        <ResultPanel
                            resultText={resultText}
                            resultPanelVisible={resultPanelVisible}
                            hideResultPanel={this.hideResultPanel}
                        />
                        <div className='setting-button-wrapper'>
                            <Button
                                className='settings-button no-shrink'
                                icon='cog'
                                onClick={this.handleSettingButtonOnClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    persistentData: PropTypes.shape(PersistentDataProps).isRequired,
    fullScreenPanelData: PropTypes.shape(FullScreenPanelDataProps).isRequired,
};

export default withFullScreenPanelContext(withPersistentDataContext(Page));