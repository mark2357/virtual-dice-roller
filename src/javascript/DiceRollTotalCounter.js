import * as BABYLON from '@babylonjs/core';
import getSidesFromMesh from './helpers/getDiceSidesFromMesh';

export default class DiceRollTotalCounter {

    /**
     * @param {function} getDiceArray 
     * @param {function} getCurrentDiceRollNumber
     * @param {function} onCountFinished 
     */
    constructor(getDiceArray, onCountFinished, ) {
        this.getDiceArray = getDiceArray;
        this.onCountFinished = onCountFinished;

        // this.diceNotMovingCounter = 0;
        this.diceCheckInterval = null;
    }

    /**
     * @description
     * should be called when the class needs to be destroyed, used to cleanup interval
     */
    dispose = () => {
        this._clearDiceCheckInterval();
    }

    /**
     * @description
     * starts running interval to check if the dice have finished rolling
     */
    startChecking = () => {
        this._startDiceCheckInterval();
    }

    /**
     * @description
     * starts running interval to check if the dice have finished rolling
     */
    stopChecking = () => {
        this._clearDiceCheckInterval();
    }

    /**
     * @description
     * creates interval that checks if all the dice have finished rolling
     */
    _startDiceCheckInterval = () => {
        this._clearDiceCheckInterval();
        this.diceCheckInterval = setInterval(() => {

            const diceArray = this.getDiceArray();
            let allDiceFinishedRolling = true;

            diceArray.forEach((mesh) => {
                if (mesh.physicsImpostor.physicsBody.getAngularVelocity().length() > 0.1 || mesh.physicsImpostor.physicsBody.getAngularVelocity().length() > 0.1) {
                    allDiceFinishedRolling = false;
                }
            });

            if (allDiceFinishedRolling === true) {
                this._clearDiceCheckInterval();
                const diceTotalArray = this._determineDiceRoll();
                this.onCountFinished(diceTotalArray);
            }
        }, 200);
    }

    /**
     * @description
     * clears the interval
     */
    _clearDiceCheckInterval = () => {
        if (this.diceCheckInterval !== null) {
            clearInterval(this.diceCheckInterval)
            this.diceCheckInterval = null;
        }
    }

    /**
     * @description
     * returns the vector from the origin to the dice face when the dice is not rotated
     * @param {number} numberOfSides
     */
    _getDiceVectors = (numberOfSides) => {
        switch (numberOfSides) {
            case 4:
                return [
                    new BABYLON.Vector3(0, 1, 0), // 1
                    new BABYLON.Vector3(0.942809787621217, -0.33333122320844, 0), // 2
                    new BABYLON.Vector3(-0.471406335280299, -0.333332242474174, -0.816495978670279), // 3
                    new BABYLON.Vector3(-0.471406335280299, -0.333332242474174, 0.816495978670279), // 4
                ];
            case 6:
                return [
                    new BABYLON.Vector3(1, 0, 0), // 1
                    new BABYLON.Vector3(0, 0, -1), // 2
                    new BABYLON.Vector3(-1, 0, 0), // 3
                    new BABYLON.Vector3(0, 0, 1), // 4
                    new BABYLON.Vector3(0, 1, 0), // 5
                    new BABYLON.Vector3(0, -1, 0), // 6
                ];
            case 8:
                return [
                    new BABYLON.Vector3(0.577350269189626, 0.577350269189626, 0.577350269189626), // 1
                    new BABYLON.Vector3(-0.577350269189626, 0.577350269189626, 0.577350269189626), // 2
                    new BABYLON.Vector3(-0.577350269189626, 0.577350269189626, -0.577350269189626), // 3
                    new BABYLON.Vector3(0.577350269189626, 0.577350269189626, -0.577350269189626), // 4
                    new BABYLON.Vector3(0.577350269189626, -0.577350269189626, 0.577350269189626), // 5
                    new BABYLON.Vector3(-0.577350269189626, -0.577350269189626, 0.577350269189626), // 6
                    new BABYLON.Vector3(-0.577350269189626, -0.577350269189626, -0.577350269189626), // 7
                    new BABYLON.Vector3(0.577350269189626, -0.577350269189626, -0.577350269189626), // 8
                ];
            case 10:
                return [
                    new BABYLON.Vector3(0.833803484136018, 0.4810163582461, -0.270915139743606), // 1
                    new BABYLON.Vector3(0, 0.481018571127908, -0.876710404997036), // 2
                    new BABYLON.Vector3(-0.833803484136018, 0.4810163582461, -0.270915139743606), // 3
                    new BABYLON.Vector3(-0.515315211470258, 0.481017412381491, 0.709276026532109), // 4
                    new BABYLON.Vector3(0.515324240067808, 0.48101436521024, 0.70927153337768), // 5
                    new BABYLON.Vector3(-0.562205395731159, -0.291781198738347, -0.77381446424423), // 6
                    new BABYLON.Vector3(0.562205395731159, -0.291781198738347, -0.77381446424423), // 7
                    new BABYLON.Vector3(0.909670723310727, -0.291782433877515, 0.295570949911951), // 8
                    new BABYLON.Vector3(0, -0.291783682947941, 0.956484334615751), // 9
                    new BABYLON.Vector3(-0.909670723310727, -0.291782433877515, 0.295570949911951), // 10
                ];
            case 12:
                return [
                    new BABYLON.Vector3(0, 0.999550919603819, -0.029965966014134), // 1
                    new BABYLON.Vector3(0.85064906896158, 0.45529595652381, 0.262872123755764), // 2
                    new BABYLON.Vector3(0, 0.473812357949999, 0.88062582829137), // 3
                    new BABYLON.Vector3(-0.85064906896158, 0.45529595652381, 0.262872123755764), // 4
                    new BABYLON.Vector3(-0.525731648474041, 0.425329049453631, -0.736682722400654), // 5
                    new BABYLON.Vector3(0.525731648474041, 0.425329049453631, -0.736682722400654), // 6
                    new BABYLON.Vector3(0.850651581371668, -0.455297301250086, -0.262861664348891), // 7
                    new BABYLON.Vector3(0.525731648474041, -0.425329049453631, 0.736682722400654), // 8
                    new BABYLON.Vector3(-0.525731648474041, -0.425329049453631, 0.736682722400654), // 9
                    new BABYLON.Vector3(-0.850651581371668, -0.455297301250086, -0.262861664348891), // 10
                    new BABYLON.Vector3(0, -0.473817046129814, -0.880623305844683), // 11
                    new BABYLON.Vector3(0, -0.99955059309622, 0.029976855088473), // 12
                ];

            case 20:
                return [
                    new BABYLON.Vector3(0.577354199209377, 0.745902378742218, 0.332102047632953), // 1
                    new BABYLON.Vector3(0.577349965370622, -0.332099612270878, 0.745906740159971), // 2
                    new BABYLON.Vector3(0.577354199209377, 0.332102047632953, -0.745902378742218), // 3
                    new BABYLON.Vector3(0.577356084253365, -0.74590481409091, -0.33209330058227), // 4
                    new BABYLON.Vector3(-0.577347644983709, 0.745906612599643, 0.33210393269561), // 5
                    new BABYLON.Vector3(-0.577343411144954, -0.332101497292066, 0.745910973980056), // 6
                    new BABYLON.Vector3(-0.577347644983709, 0.33210393269561, -0.745906612599643), // 7
                    new BABYLON.Vector3(-0.577349530027697, -0.745909047989806, -0.332095185607587), // 8
                    new BABYLON.Vector3(0.356823658071827, 0.334772260770405, 0.872126372986686), // 9
                    new BABYLON.Vector3(-0.356815078559659, 0.334773435143922, 0.872129432386273), // 10
                    new BABYLON.Vector3(0.356830951443999, -0.334769272010459, -0.872124536181134), // 11
                    new BABYLON.Vector3(-0.356822371807639, -0.3347704464215, -0.872127595699345), // 12
                    new BABYLON.Vector3(0.934173734093561, 0.333121550036584, -0.127865035998578), // 13
                    new BABYLON.Vector3(0.934174444638251, -0.333111972171182, 0.127884795738356), // 14
                    new BABYLON.Vector3(-0.934171230610148, 0.333127668971408, -0.12786738468428), // 15
                    new BABYLON.Vector3(-0.934171941179038, -0.333118090939384, 0.127887144790588), // 16
                    new BABYLON.Vector3(0, 0.999998635941301, -0.001651671541446), // 17
                    new BABYLON.Vector3(0, 0.744250553975622, -0.667900526206545), // 18
                    new BABYLON.Vector3(0, -0.744245666947025, 0.667905971775911), // 19
                    new BABYLON.Vector3(0, -0.999998619703116, 0.001661502892689), // 20
                ];
        }
    }

    /**
    * @description
    * determines the roll of each dice
    * @returns {Array<number>}
    */
    _determineDiceRoll = () => {
        const diceArray = this.getDiceArray();
        let resultArray = [];
        //for each dice
        diceArray.forEach((mesh) => {

            let rotationMatrix = new BABYLON.Matrix();
            mesh.rotationQuaternion.toRotationMatrix(rotationMatrix);

            const diceSides = getSidesFromMesh(mesh);
            if (diceSides != null) {

                //get dice vectors for current dice
                let diceSideVectors = this._getDiceVectors(diceSides);

                let diceRoll = -1
                let currentHighestValue = -1;
                // checks which roll is closest to the current roll
                for (let i = 0; i < diceSideVectors.length; i++) {
                    let transformedVector = BABYLON.Vector3.TransformCoordinates(diceSideVectors[i], rotationMatrix);
                    let dotProduct = BABYLON.Vector3.Dot(transformedVector, BABYLON.Vector3.Up());
                    if (currentHighestValue < dotProduct) {
                        diceRoll = i + 1;
                        currentHighestValue = dotProduct;
                    }
                }
                resultArray.push(diceRoll);
            }
            else console.error('could not get dice sides from mesh with name: ${mesh}');
        });
        return resultArray;
    }
}