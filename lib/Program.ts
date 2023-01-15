import { ProgramProps } from "../type";

export class Program {
    private readonly program: ProgramProps;
    constructor(
        private gl: WebGL2RenderingContext,
        private vs: string,
        private fs: string,
    ) {
        this.gl = gl;
        this.program = gl.createProgram() as ProgramProps;

        if (!(vs && fs)) {
            console.error('shaderが存在しません');
        }
        //init vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, vs);
        gl.compileShader(vertexShader);
        //init fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, fs)
        gl.compileShader(fragmentShader);
        //attach program
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('shaderを初期化できません');
        }
        this.useProgram();
    };
    useProgram() {
        this.gl.useProgram(this.program);
    };
    load(attributes: Array<string>, uniforms: Array<string>) {
        this.useProgram();
        attributes.forEach((attribute: string) => {
            this.program[attribute as keyof ProgramProps] = this.gl.getAttribLocation(this.program, attribute);
        });
        uniforms.forEach((uniform: string) => {
            this.program[uniform as keyof ProgramProps] = this.gl.getUniformLocation(this.program, uniform) as any;
        });

    }
}