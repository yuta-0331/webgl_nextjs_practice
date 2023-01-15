import fragment_shader from '../shader/testFrag.glsl';
import vertex_shader from '../shader/testVer.glsl';
import { useEffect, useRef } from "react";
import { ProgramProps } from "../type";

const ModelImportTest = () => {
    let gl: WebGL2RenderingContext,
        program: ProgramProps,
        scene,
        clock,
        camera,
        transform,
        lights,
        lightPosition,
        clearColor: [number, number, number] = [0.9, 0.9, 0.9];

    function configure() {
        //canvasの設定
        const canvasRef = useRef(null);
        function getContext() {
            const canvas = canvasRef.current as unknown as HTMLCanvasElement;
            return canvas.getContext('webgl2');
        }
        gl = getContext() as WebGL2RenderingContext;
        gl.clearColor(...clearColor, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        //vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, vertex_shader);
        gl.compileShader(vertexShader);
        //fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, fragment_shader);
        gl.compileShader(fragmentShader);

        //program
        program = gl.createProgram() as ProgramProps;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Could not initialize shader');
        }
        gl.useProgram(program);

        //attribute, uniformのprogramへの配置を配列で処理
        const attributes = [
            'aVertexPosition',
            'aVertexNormal',
            'aVertexColor'
        ];
        const uniforms = [
            'uProjectionMatrix',
            'uModelViewMatrix',
            'uNormalMatrix',
            'uLightPosition',
            'uWireframe',
            'uLd',
            'uLs',
            'uKa',
            'uKd',
            'uKs',
            'uNs',
            'uD',
        ];
        attributes.forEach((attribute: string) => {
            program[attribute as keyof ProgramProps] = gl.getAttribLocation(program, attribute);
        });
        uniforms.forEach((uniform: string) => {
            program[uniform as keyof ProgramProps] = gl.getUniformLocation(program, uniform) as any;
        });

    }
    return (
        <>test</>
    )
}

export default ModelImportTest;