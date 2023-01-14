export interface Program extends WebGLProgram {
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
}