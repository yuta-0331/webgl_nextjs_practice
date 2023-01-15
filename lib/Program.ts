import { ProgramProps } from "../type";

export class Program {
    private readonly program: ProgramProps;
    constructor(
        private gl: WebGL2RenderingContext,
        private readonly vs: string,
        private readonly fs: string,
    ) {
        this.gl = gl;
        this.program = gl.createProgram() as ProgramProps;
        this.vs = vs;
        this.fs = fs;
    };
    initProgram(attributes: Array<string>, uniforms: Array<string>) {
        const { gl, vs, fs, program } = this;
        //vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, vs);
        gl.compileShader(vertexShader);
        //fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, fs);
        gl.compileShader(fragmentShader);
        //attach program
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('shaderを初期化できません')
        }

        this.useProgram();

        this.load(attributes, uniforms);

        return program;
    };
    useProgram() {
        this.gl.useProgram(this.program);
    };
    load(attributes: Array<string>, uniforms: Array<string>) {
        this.setAttribLocation(attributes);
        this.setUniformLocation(uniforms);
    };
    setAttribLocation(attributes: Array<string>) {
        attributes.forEach((attribute: string) => {
            this.program[attribute as keyof ProgramProps] = this.gl.getAttribLocation(this.program, attribute);
        });
    };
    setUniformLocation(uniforms: Array<string>) {
        uniforms.forEach((uniform: string) => {
            this.program[uniform as keyof ProgramProps] = this.gl.getUniformLocation(this.program, uniform) as any;
        });
    };
}