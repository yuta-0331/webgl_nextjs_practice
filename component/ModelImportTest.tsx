import fragment_shader from '../shader/testFrag.glsl';
import vertex_shader from '../shader/testVer.glsl';
import { useEffect, useRef } from "react";
import { ProgramProps } from "../type";
import {Scene} from "../lib/Scene";
import {Program} from "../lib/Program";
import {Clock} from "../lib/Clock";
import {Camera} from "../lib/Camera";
import {Controls} from "../lib/Controls";

const ModelImportTest = () => {
    let canvas: HTMLCanvasElement,
        gl: WebGL2RenderingContext,
        program: ProgramProps,
        scene: Scene,
        clock: Clock,
        camera: Camera,
        transform,
        lights,
        lightPosition,
        clearColor: [number, number, number] = [0.9, 0.9, 0.9];

    //canvasの設定
    const canvasRef = useRef(null);
    function getContext() {
        canvas = canvasRef.current as unknown as HTMLCanvasElement;
        return canvas.getContext('webgl2');
    }

    function configure() {
        gl = getContext() as WebGL2RenderingContext;
        gl.clearColor(...clearColor, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
        program = new Program(
            gl, vertex_shader, fragment_shader
        ).initProgram(attributes, uniforms);

        scene = new Scene(gl, program);
        clock = new Clock();
        camera = new Camera(Camera.ORBITING_TYPE);
        new Controls(camera, canvas)
    }
    useEffect(() => {
        configure();
    }, []);
    return (
        <>
            <canvas className='webgl-canvas' ref={canvasRef}></canvas>
        </>
    )
}

export default ModelImportTest;