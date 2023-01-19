import {vec3, vec4} from "gl-matrix";

//programに配置するプロパティ(uniform, attribute)の型
export interface ProgramProps extends WebGLProgram {
    aVertexPosition: number;
    aVertexNormal: number;
    aVertexColor: number;
    aVertexTextureCoords: number;
    aVertexTangent: number;
    uProjectionMatrix: WebGLUniformLocation | null;
    uModelViewMatrix: WebGLUniformLocation | null;
    uShininess: WebGLUniformLocation | null;
    uNormalMatrix: WebGLUniformLocation | null;
    uMaterialAmbient: WebGLUniformLocation | null;
    uMaterialDiffuse: WebGLUniformLocation | null;
    uMaterialSpecular: WebGLUniformLocation | null;
    uLightDirection: WebGLUniformLocation | null;
    uLightAmbient: WebGLUniformLocation | null;
    uLightDiffuse: WebGLUniformLocation | null;
    uLightSpecular: WebGLUniformLocation | null;
    uLightPosition: WebGLUniformLocation | null;
    uWireframe: WebGLUniformLocation | null;
    uLd: WebGLUniformLocation | null;
    uLs: WebGLUniformLocation | null;
    uKa: WebGLUniformLocation | null;
    uKd: WebGLUniformLocation | null;
    uKc: WebGLUniformLocation | null;
    uKs: WebGLUniformLocation | null;
    uNs: WebGLUniformLocation | null;
    uNi: WebGLUniformLocation | null;
    uD: WebGLUniformLocation | null;
}

export type LightPositions = {
    farLeft: vec3;
    farRight: vec3;
    nearLeft: vec3;
    nearRight: vec3;
};

//Modelをインポートする際に使用するオブジェクトの型指定
export interface ModelDataType {
    [key: string]: {
        paintAlias: string;
        partsCount: number;
        modelPath: string;
    }
}

//sceneで使用するLightプロパティの型指定
export type ModelDetailedDataType = {
    Ka: vec3;
    Kd: vec3;
    Ks: vec3;
    Ni: number;
    Ns: number;
    alias: string;
    ambient: vec4;
    d: number;
    diffuse: vec4;
    ibo: WebGLBuffer | null;
    illum: number;
    indices: Array<number>;
    specular: vec4;
    specularExponent: number;
    transparency: number;
    vao: WebGLVertexArrayObject | null;
    vertices: Array<number>;
    visible: boolean;
    scalars: number;
    textureCoords: Array<number>;
    image: any;
    texture: any;
    wireframe: boolean;
}


//読み込んだJSONファイルを格納するオブジェクトの型指定
export type StoringLoadedJsonType = {
    [key: string]: ModelDetailedDataType;
}