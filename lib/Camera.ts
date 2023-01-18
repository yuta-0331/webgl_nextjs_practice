import { mat4, vec3, vec4 } from "gl-matrix";

type CameraType = {
    ORBITING_TYPE: string;
    TRACKING_TYPE: string
}

export class Camera {
    readonly position: vec3;
    private readonly focus: vec3;
    private home: vec3;
    readonly up: vec3;
    readonly right: vec3;
    readonly normal: vec3;
    private readonly matrix: mat4;
    private steps: number;
    private azimuth: number;
    private elevation: number;
    fov: number;
    minZ: number;
    maxZ: number;
    private type: string | undefined;
    static ORBITING_TYPE: string;
    static TRACKING_TYPE: string;
    private static TYPE: string;
    static TYPES: string[];

    constructor(type: string = Camera.ORBITING_TYPE) {
        this.position = vec3.create();
        this.focus = vec3.create();
        this.home = vec3.create();
        this.up = vec3.create();
        this.right = vec3.create();
        this.normal = vec3.create();
        this.matrix = mat4.create();

        this.steps = 0;
        this.azimuth = 0;
        this.elevation = 0;
        this.fov = 45;
        this.minZ = 0.1;
        this.maxZ = 10000;

        this.setType(type);
    };

    isOrbiting() {
        return this.type === Camera.ORBITING_TYPE;
    };
    isTracking() {
        return this.type === Camera.TRACKING_TYPE;
    };
    //カメラタイプの変更
    setType(type: string) {
        //Camera.TYPEにtypeが存在するかどうか
        ~Camera.TYPES.indexOf(type)
        ? this.type = type
        : console.error(`${type}はサポートされていません`)
    };

    //カメラの位置を元に戻す
    goHome(home: vec3) {
        if (home) {
            this.home = home;
        }
        this.setPosition(this.home);
        this.setAzimuth(0);
        this.setElevation(0);
    };

    //カメラの移動台
    dolly(stepIncrement: number) {
        const normal = vec3.create();
        const newPosition = vec3.create();
        vec3.normalize(normal, this.normal);

        const step = stepIncrement - this.steps;

        if (this.isTracking()) {
            newPosition[0] = this.position[0] - step * normal[0];
            newPosition[1] = this.position[1] - step * normal[1];
            newPosition[2] = this.position[2] - step * normal[2];
        } else {
            newPosition[0] = this.position[0];
            newPosition[1] = this.position[1];
            newPosition[2] = this.position[2] - step;
        }

        this.steps = stepIncrement;
        this.setPosition(newPosition);
    }
    //カメラの位置の変更
    setPosition(position: vec3) {
        vec3.copy(this.position, position);
        this.update();
    };
    //カメラのfocus変更
    setFocus(focus: vec3) {
        vec3.copy(this.focus, focus);
        this.update();
    }
    //カメラの方位を設定
    setAzimuth(azimuth: number) {
        this.changeAzimuth(azimuth - this.azimuth);
    };
    //カメラの方位の変更
    changeAzimuth(azimuth: number) {
        this.azimuth += azimuth;
        if(this.azimuth > 360 || this.azimuth < -360) {
            this.azimuth = this.azimuth % 360;
        }
        this.update();
    };
    //カメラの高度の設定
    setElevation(elevation: number) {
        this.changeElevation(elevation - this.elevation);
    };
    //カメラの高度の変更
    changeElevation(elevation: number) {
        this.elevation += elevation;
        if (this.elevation > 360 || this.elevation < -360) {
            this.elevation = this.elevation % 360;
        }
        this.update();
    };
    //カメラの向きを更新する
    calculateOrientation() {
        const right = vec4.create();
        vec4.set(right, 1, 0, 0, 0);
        vec4.transformMat4(right, right, this.matrix);
        vec3.copy(this.right, right as vec3);

        const up = vec4.create();
        vec4.set(up, 0, 1, 0, 0,);
        vec4.transformMat4(up, up, this.matrix);
        vec3.copy(this.up, up as vec3);

        const normal = vec4.create();
        vec4.set(normal, 0, 0, 1, 0);
        vec4.transformMat4(normal, normal, this.matrix);
        vec3.copy(this.normal, normal as vec3);
    };
    //カメラの値を更新する
    update() {
        mat4.identity(this.matrix);

        if (this.isTracking()) {
            mat4.translate(this.matrix, this.matrix, this.position);
            mat4.rotateY(this.matrix, this.matrix, this.azimuth * Math.PI / 180);
            mat4.rotateX(this.matrix, this.matrix, this.elevation * Math.PI / 180);
        } else {
            mat4.rotateY(this.matrix, this.matrix, this.azimuth * Math.PI / 180);
            mat4.rotateX(this.matrix, this.matrix, this.elevation * Math.PI / 180);
            mat4.translate(this.matrix, this.matrix, this.position);
        }

        if (this.isTracking()) {
            const position = vec4.create();
            vec4.set(position, 0, 0, 0, 1);
            vec4.transformMat4(position, position, this.matrix);
            vec3.copy(this.position, position as vec3);
        }

        this.calculateOrientation();
    };

    //ビュー行列
    getViewTransform() {
        const matrix = mat4.create();
        mat4.invert(matrix, this.matrix);//逆行列
        return matrix;
    };
}

Camera.TYPES = ['ORBITING_TYPE', 'TRACKING_TYPE'];
Camera.TYPES.forEach(type => Camera[type as keyof CameraType] = type);
