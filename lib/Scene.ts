type Object = {
    diffuse: Array<number>;
    Kd: Array<number>;
    ambient: Array<number>;
    Ka: Array<number>;
    specular: Array<number>;
    Ks: Array<number>;
    specularExponent: number;
    Ns: number;
    d: number;
    transparency: number;
    illum: number;
    ibo: WebGLBuffer | null;
    indices: Array<number>;
    vao: WebGLVertexArrayObject | null;
}
interface Program extends WebGLProgram {
    aVertexPosition: number
}

export class Scene {
    constructor(
        private gl: WebGL2RenderingContext,
        private program: Program,
        private objects: []
    ) {
        this.gl = gl;
        this.program = program;
        this.objects = []
    }
    //非同期でファイルを読み込む
    private load(filename: string, alias: string, attributes: string) {
        return fetch(filename)
            .then(res => res.json())
            .then(object => {
                object.visible = true;
                object.alias = alias || object.alias;
                this.add(object, attributes);
            })
            .catch((err) => console.error(err));
    };

    private add(object: Object, attributes: string) {
        const { gl, program } = this;
        //デフォルト値の設定
        object.diffuse = object.diffuse || [1, 1, 1, 1];
        object.Kd = object.Kd || object.diffuse.slice(0, 3);
        object.ambient = object.ambient || [0.2, 0.2, 0.2, 1];
        object.Ka = object.Ka || object.ambient.slice(0, 3);
        object.specular = object.specular || [1, 1, 1, 1];
        object.Ks = object.Ks || object.specular.slice(0, 3);
        object.specularExponent = object.specularExponent || 0;
        object.Ns = object.Ns || object.specularExponent;
        object.d = object.d || 1;
        object.transparency = object.transparency || object.d;
        object.illum = object.illum || 1;

        //attributeが与えられている場合はマージする。
        Object.assign(object, attributes);

        //create & bind IBO
        object.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW)

        //create VAO
        object.vao = gl.createVertexArray();
        gl.bindVertexArray(object.vao);

        //positions
        if (program.aVertexPosition >= 0)
            }
}