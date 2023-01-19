import { LightPropType, ProgramProps } from "../type";
import { Utils } from "./Utils";
import { Texture } from "./Texture";


export class Scene {
    objects: Array<Object>
    constructor(
        private gl: WebGL2RenderingContext,
        private program: ProgramProps,
    ) {
        this.gl = gl;
        this.program = program;
        this.objects = []
    };

    //JSONのデータを受け取る
    loadObject(modelObj) {
        Object.keys(modelObj).forEach(key => {
            modelObj[key].visible = true;
            this.add(modelObj[key])
        });
    }
    // //非同期でファイルを読み込む
    // async load(filename: string, alias: string, attributes: string | null = null) {
    //     return await fetch(filename)
    //         .then(res => res.json())
    //         .then(object => {
    //             object.visible = true;
    //             object.alias = alias || object.alias;
    //             this.add(object, attributes);
    //         })
    //         .catch((err) => console.error(err));
    // };
    //
    // loadByParts(path: string, count: number, alias: string) {
    //     for (let i = 1; i <= count; i++) {
    //         const part = `${path}${i}.json`;
    //         this.load(part, alias);
    //     }
    // };

    add(object: LightPropType, attributes: string | null = null) {
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

        //IBO
        object.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW)

        //create VAO
        object.vao = gl.createVertexArray();
        gl.bindVertexArray(object.vao);

        //VBO
        if (program.aVertexPosition >= 0) {
            const vertexBufferObject: WebGLBuffer | null = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW)
            gl.enableVertexAttribArray(program.aVertexPosition);
            gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        }

        //Normals
        if (program.aVertexNormal >= 0) {
            const normalBufferObject: WebGLBuffer | null = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
                new Utils().calculateNormals(object.vertices, object.indices)
            ), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexNormal);
            gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        }

        //color scalars
        if (object.scalars && program.aVertexColor >= 0) {
            const colorBufferObject: WebGLBuffer | null = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.scalars), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexColor);
            gl.vertexAttribPointer(program.aVertexColor, 4, gl.FLOAT, false, 0, 0);
        }

        //textures coordinates
        if (object.textureCoords && program.aVertexTextureCoords >= 0) {
            const textureBufferObject: WebGLBuffer | null = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.textureCoords), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexTextureCoords);
            gl.vertexAttribPointer(program.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
        }

        //tangents
        if (program.aVertexTangent >= 0) {
            const tangentBufferObject: WebGLBuffer | null = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tangentBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
                new Utils().calculateTangents(object.vertices, object.textureCoords, object.indices)
            ), gl.STATIC_DRAW
            );
            gl.enableVertexAttribArray(program.aVertexTangent);
            gl.vertexAttribPointer(program.aVertexTangent, 3, gl.FLOAT, false, 0, 0);
        }

        //image texture
        if (object.image) {
            object.texture = new Texture(gl, object.image)
        }
        //objectsリストにプッシュする
        this.objects.push(object);

        //clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };

    //シーン内の全アイテムを走査する
    traverse(callback: Function) {
        for (let i = 0; i < this.objects.length; i++) {
            //何らかの値が帰ってきた時点でbreak
            if(callback(this.objects[i], i) !== undefined) break;
        }
    }
}