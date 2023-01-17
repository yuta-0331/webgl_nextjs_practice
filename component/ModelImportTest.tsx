import fragment_shader from '../shader/testFrag.glsl';
import vertex_shader from '../shader/testVer.glsl';
import { useEffect, useRef } from "react";
import {LightPositions, ModelDataType, ProgramProps} from "../type";
import { Scene } from "../lib/Scene";
import { Program } from "../lib/Program";
import { Clock } from "../lib/Clock";
import { Camera } from "../lib/Camera";
import { Controls } from "../lib/Controls";
import { Transforms } from "../lib/Transforms";
import {Light, LightsManager} from "../lib/Light";

const ModelImportTest = () => {
    let canvas: HTMLCanvasElement,
        gl: WebGL2RenderingContext,
        program: ProgramProps,
        scene: Scene,
        clock: Clock,
        camera: Camera,
        transforms: Transforms,
        lights: LightsManager,
        lightPositions: LightPositions,
        clearColor: [number, number, number] = [0.9, 0.9, 0.9],
        modelData: ModelDataType,
        selectedModel

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
        //programの設定
        program = new Program(
            gl, vertex_shader, fragment_shader
        ).initProgram(attributes, uniforms);

        //scene, clock, camera, control, transform, lightの設定
        scene = new Scene(gl, program);
        clock = new Clock();
        camera = new Camera(Camera.ORBITING_TYPE);
        new Controls(camera, canvas);
        transforms = new Transforms(gl, program, camera, canvas);
        lights = new LightsManager();
        //シーン内の個々のライトのポジション
        lightPositions = {
            farLeft: [-5, 5, -5],
            farRight: [5, 5, -5],
            nearLeft: [-5, 5, 5],
            nearRight: [5, 5, 5]
        };

        Object.keys(lightPositions).forEach(key => {
            const light = new Light(key);
            light.setPosition(lightPositions[key as keyof LightPositions]);
            light.setDiffuse([0.4, 0.4, 0.4, 1]);
            light.setSpecular([0.8, 0.8, 0.8, 1]);
            lights.add(light);
        });

        gl.uniform3fv(program.uLightPosition, lights.getArray('position'));
        gl.uniform3fv(program.uLd, lights.getArray('diffuse'));
        gl.uniform3fv(program.uLs, lights.getArray('specular'));

        gl.uniform3fv(program.uKa, [1, 1, 1]);
        gl.uniform3fv(program.uKd, [1, 1, 1]);
        gl.uniform3fv(program.uKs, [1, 1, 1]);
        gl.uniform1f(program.uNs, 1);
        gl.uniform1f(program.uNi, 1);

        modelData = {
            'macbook': {
                paintAlias: 'macbook',
                partsCount: 6,
                path: '../model/macbook/part'
            },
        };
    }

    function goHome() {
        camera.goHome([0, 0.5, 5]);
        camera.setFocus([0, 0, 0]);
        camera.setAzimuth(25);
        camera.setElevation(-10);
    }

    function loadModel(model: string) {
        scene.objects = [];
        const { path, partsCount, paintAlias } = modelData[model];
        scene.loadByParts(path, partsCount, paintAlias);
        selectedModel = model;
    }

    function load() {
        goHome();
        loadModel('macbook');
    }

    function draw() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        transforms.updatePerspective();


    }
    useEffect(() => {
        configure();
    }, []);
    return (
        <>
            <canvas className='webgl-canvas' ref={canvasRef}></canvas>
        </>
    );
};

export default ModelImportTest;