import React, { Component } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { AmmoJSPlugin } from '@babylonjs/core';
import * as Ammo from '../../assets/ammo';

import '../css/Page.scss';

import DiceButtons from './DiceButtons';
import Scene from './Scene';
import DiceRollTotalCounter from '../DiceRollTotalCounter';
import ResultPanel from './ResultPanel';
import CustomDiceRolls from './CustomDiceRolls';

import calcRandomVectorBetween from '../helpers/calcRandomVectorBetween';
import calculateCustomDiceRollResult from '../helpers/calculateCustomDiceRollResult';
import SettingsButton from './SettingButton';


export default class Page extends Component {

    constructor(props) {
        super(props);

        this.state = {
            diceRollArray: [],
            resultPanelVisible: false,
            resultText: '',
        }

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
        this.diceInstanceArray = [];
        this.scene = null;
        this.advancedTexture = null;
        this.shadowGenerator = null;
        this.diceRollTotalCounter = new DiceRollTotalCounter(this.getDiceInstanceArray, this.displayRollResult);
    }

    //#region initial load functions
    /**
     * @description
     * loads babylon file once scene has loaded
     * @param {{canvas: HTMLElement, scene: BABYLON.Scene, engine: BABYLON.Engine }} e
     */
    handleSceneMount = async (e) => {
        const { canvas, engine } = e;

        let scene = null;

        let pro = new Promise((resolve, reject) => {
            BABYLON.SceneLoader.Load("./assets/", "Scene.babylon", engine, function (newScene) {
                scene = newScene
                resolve();
            }, null, (scene, msg, exc) => {
                console.log(msg, exc);
                reject();
            });
        });

        await pro;

        this.scene = scene;

        // scene.clearColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        // scene.ambientColor = new BABYLON.Color3.White;


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

        // this.createGUI();

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
     * changes shadow setting on shadow caster
     */
    createLightsAndShadows = () => {

        let directionalLight = this.scene.lights[0];
        if (directionalLight !== null && directionalLight !== undefined) {

            this.shadowGenerator = new BABYLON.ShadowGenerator(512, directionalLight);
            this.shadowGenerator.bias = 0.02;
            this.shadowGenerator.usePoissonSampling = true;
            this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
            // this.shadowGenerator.usePercentageCloserFiltering = true;
            directionalLight.autoCalcShadowZBounds = true;
            directionalLight.intensity = 2;
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
     * creates initial GUI Texture
     */
    createGUI = () => {
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.advancedTexture.idealWidth = 600;
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
     * @param {Array<number>} diceSidesArray
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
     * displays dice roll as GUI
     * @param {BABYLON.Mesh} mesh
     * @param {number} diceRoll
     */
    displayResult = (mesh, diceRoll) => {
        let label = new GUI.TextBlock();
        label.text = `${diceRoll}`;
        this.advancedTexture.addControl(label);
        label.linkWithMesh(mesh);
        label.linkOffsetX = 0;
        label.linkOffsetY = -20;
        label.color = "White";

        this.GUIList.push(label);

        var line = new GUI.Line();
        line.lineWidth = 2;
        line.y2 = 5;
        line.linkOffsetY = -5;
        this.advancedTexture.addControl(line);
        line.linkWithMesh(mesh);
        line.connectedControl = label;

        this.GUIList.push(line);
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
                            <SettingsButton/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}