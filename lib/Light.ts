import { vec3, vec4 } from "gl-matrix";

export class Light {
    private position: vec3;
    private ambient: vec4;
    private diffuse: vec4;
    private specular: vec4;
    constructor(public id: string) {
        this.id = id;
        this.position = [0, 0, 0];

        this.ambient = [0, 0, 0, 0];
        this.diffuse = [0, 0, 0, 0];
        this.specular = [0, 0, 0, 0];
    };

    setPosition(position: vec3) {
        this.position = position.slice(0) as vec3;
    };

    setDiffuse(diffuse: vec4) {
        this.diffuse = diffuse.slice(0) as vec4;
    };

    setAmbient(ambient: vec4) {
        this.ambient = ambient.slice(0) as vec4;
    };

    setSpecular(specular: vec4) {
        this.specular = specular.slice(0) as vec4;
    };

    setProperty(property, value) {
        this[property] = value;
    };
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
        return this.list.reduce((result: Array<Light>, light: Light) => {
            result = result.concat(light[type]);
            return result;
        }, []);
    };

    get(index: string) {
        return this.list.find(light => light.id === index);
    };
}
