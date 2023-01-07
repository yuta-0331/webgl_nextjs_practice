#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vFinalColor;

void main(void) {
    if(uWireframe) {
        vFinalColor = uMaterialDiffuse;
    } else {
        vec3 Normal = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
        vec3 Light = normalize(-uLightPosition);
        float lamberTerm = dot(Normal, -Light);

        if(lamberTerm == 0.0) {
            lamberTerm = 0.01;
        }

        //ambient
        vec4 Ia = uLightAmbient;
        //diffuse
        vec4 Id = uMaterialDiffuse * uLightDiffuse * lamberTerm;

        vFinalColor = Ia + Id;
    }
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
