import { vec3 } from "gl-matrix";

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
    uLd: WebGLUniformLocation | null;
    uLs: WebGLUniformLocation | null;
    uKa: WebGLUniformLocation | null;
    uKd: WebGLUniformLocation | null;
    uKc: WebGLUniformLocation | null;
    uKs: WebGLUniformLocation | null;
    uNs: WebGLUniformLocation | null;
    uNi: WebGLUniformLocation | null;
}

export type LightPositions = {
    farLeft: vec3;
    farRight: vec3;
    nearLeft: vec3;
    nearRight: vec3;
};

export interface ModelDataType {
    [key: string]: {
        paintAlias: string;
        partsCount: number;
        path: string;
    }
}