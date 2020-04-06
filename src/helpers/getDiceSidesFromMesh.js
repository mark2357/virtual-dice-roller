import * as BABYLON from '@babylonjs/core';
/**
 * @description
 * uses the tag of mesh to determine what type of dice it is
 * @param {BABYLON.Mesh} mesh
 * @returns {number | null} 
 */
const getDiceSidesFromMesh = (mesh) => {
    const tags = BABYLON.Tags.GetTags(mesh);
    switch (tags) {
        case 'D4':
            return 4;
        case 'D6':
            return 6;
        case 'D8':
            return 8;
        case 'D10':
            return 10;
        case 'D12':
            return 12;
        case 'D20':
            return 20;
    }
    return null;
}

export default getDiceSidesFromMesh;