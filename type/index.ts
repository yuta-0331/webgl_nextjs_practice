import { vec3 } from "gl-matrix";

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

//Modelの型指定
export interface ModelDataType {
    [key: string]: {
        paintAlias: string;
        partsCount: number;
        path: string;
    }
}

//sceneで使用するLightプロパティの型指定
export type LightPropType = {
    diffuse: Array<number>;
    Kd: Array<number>;
    ambient: Array<number>;
    Ka: Array<number>;
    specular: Array<number>;
    Ks: Array<number>;
    specularExponent: number;
    Ns: number;
    Ni: number,
    d: number;
    transparency: number;
    illum: number;
    ibo: WebGLBuffer | null;
    indices: Array<number>;
    vao: WebGLVertexArrayObject | null;
    vertices: Array<number>;
    scalars: number;
    textureCoords: Array<number>;
    image: any;
    texture: any;
    wireframe: boolean;
    visible:boolean;
}