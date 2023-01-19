import { vec3, vec4 } from "gl-matrix";

export class Light {
    private position: vec3;
    private ambient: vec3;
    private diffuse: vec3;
    private specular: vec3;
    constructor(public id: string) {
        this.id = id;
        this.position = [0, 0, 0];

        this.ambient = [0, 0, 0];
        this.diffuse = [0, 0, 0];
        this.specular = [0, 0, 0];
    };

    setPosition(position: vec3) {
        this.position = position.slice(0) as vec3;
    };

    setDiffuse(diffuse: vec3) {
        this.diffuse = diffuse.slice(0) as vec3;
    };

    setAmbient(ambient: vec3) {
        this.ambient = ambient.slice(0) as vec3;
    };

    setSpecular(specular: vec3) {
        this.specular = specular.slice(0) as vec3;
    };

    setProperty(property, value) {
        this[property] = value;
    };
}
type LightProps = {
    key: 'position' | 'diffuse' | 'specular' | 'ambient'
}
export class LightsManager {
    private readonly list: Array<Light>;
    constructor() {
        this.list = [];
    };

    add(light: Light) {
       this.list.push(light)
    };

    getArray(type: 'position' | 'diffuse' | 'specular' | 'ambient') {
        return this.list.reduce((result, light: Light) => {
            result = result.concat(light[type]);
            return result;
        }, []);
    };

    get(index: string) {
        return this.list.find(light => light.id === index);
    };
}
