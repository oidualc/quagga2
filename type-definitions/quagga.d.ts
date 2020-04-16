// Type definitions for QuaggaJS v0.12.1 (2017-10-19)
// Project: http://serratus.github.io/quaggaJS/
// Definitions by: Cam Birch, Peter Horwood aka Madman Pierre, Dan Manastireanu <https://github.com/danmana>

// import SubImage from '../src/common/subImage';
// import ImageWrapper from '../src/common/image_wrapper';
// export { SubImage, ImageWrapper };

declare const Quagga: QuaggaJSStatic;
export default Quagga;

// TODO: fill this in from cv_utils#imageRef
export type ImageRef = {
    x: number,
    y: number,
}

export type SparseImageWrapper = { data: TypedArray | Array<number> | null, size: ImageRef };

export interface WrapperIndexMapping {
    x: Array<number>;
    y: Array<number>;
}
export interface moment {
    m00: number,
    m01: number,
    m10: number,
    m11: number,
    m02: number,
    m20: number,
    theta: number,
    rad: number,
    vec?: Array<number>
}

export interface ImageWrapper {
    data: TypedArray | Array<number>;
    size: XYSize;
    indexMapping?: WrapperIndexMapping;
    constructor(size: XYSize, data?: TypedArray | Array<number>, ArrayType?: TypedArrayConstructor | ArrayConstructor, initialize?: boolean): ImageWrapper;
    inImageWithBorder(imgRef: ImageRef, border: number): boolean;
    subImageAsCopy(imageWrapper: ImageWrapper, from: XYSize): ImageWrapper;
    get(x: number, y: number): number;
    getSafe(x: number, y: number): number;
    set(x: number, y: number, value: number): ImageWrapper;
    zeroBorder(): ImageWrapper;
    moments(labelcount: any): Array<moment>;
    getAsRGBA(scale?: number): Uint8ClampedArray;
    show(canvas: HTMLCanvasElement, scale?: number): void;
    overlay(canvas: HTMLCanvasElement, scale: number, from: XYSize): void;
}

export interface SubImage {
    I: ImageWrapper | SparseImageWrapper;
    data: ImageWrapper['data'];
    originalSize: ImageRef;
    from: ImageRef;
    size: ImageRef;
    constructor(from: ImageRef, size: ImageRef, I: SparseImageWrapper): SubImage;
    get(x: number, y: number): number;
    show(canvas: HTMLCanvasElement, scale: number): void;
    updateData(image: ImageWrapper): void;
    updateFrom(from: ImageRef): void;
}

export type XYSize = {
    x: number,
    y: number,
};

export type QuaggaImageData = Array<number>;

export interface QuaggaJSStatic {
    /**
     * This method initializes the library for a given
     * configuration config (see below) and invokes the callback when Quagga is
     * ready to start. The initialization process also requests for camera
     * access if real-time detection is configured.
     */
    init(
        config: QuaggaJSConfigObject,
        callback?: (err: any) => void
    ): void;

    init(
        config: QuaggaJSConfigObject,
        callback: (err: any) => void,
        imageWrapper: ImageWrapper,
    ): void;

    /**
     * When the library is initialized, the start()
     * method starts the video-stream and begins locating and decoding the
     * images.
     */
    start(): void;

    /**
     * If the decoder is currently running, after calling
     * stop() the decoder does not process any more images.
     * Additionally, if a camera-stream was requested upon initialization,
     * this operation also disconnects the camera.
     */
    stop(): void;

    /**
     * Pauses processing, but does not release any handlers
     */
    pause(): void;

    /**
     * This method registers a callback(data) function that is
     * called for each frame after the processing is done. The data object
     * contains detailed information about the success/failure of the operation.
     * The output varies, depending whether the detection and/or decoding were
     * successful or not.
     */
    onProcessed(callback: QuaggaJSResultCallbackFunction): void;

    /**
     * Removes a callback that was previously registered with @see onProcessed
     */
    offProcessed(callback?: QuaggaJSResultCallbackFunction): void;

    /**
     * Registers a callback(data) function which is triggered whenever a
     * barcode- pattern has been located and decoded successfully. The passed
     * data object contains information about the decoding process including the
     * detected code which can be obtained by calling data.codeResult.code.
     */
    onDetected(callback: QuaggaJSResultCallbackFunction): void;

    /**
     * Removes a callback that was previously registered with @see onDetected
     */
    offDetected(callback?: QuaggaJSResultCallbackFunction): void;

    ResultCollector: QuaggaJSResultCollector;
    registerResultCollector(resultCollector: QuaggaJSResultCollector): void;
    setReaders(readers: (QuaggaJSReaderConfig | string)[]): void;
    registerReader(name: string, reader: object): void;

    /**
     * In contrast to the calls described
     * above, this method does not rely on getUserMedia and operates on a single
     * image instead. The provided callback is the same as in onDetected and
     * contains the result data object.
     */
    decodeSingle(
        config: QuaggaJSConfigObject,
        resultCallback?: QuaggaJSResultCallbackFunction
    ): Promise<QuaggaJSResultObject>;

    /**
     * Constructs used for debugging purposes
     */
    ImageDebug: {
        drawPath: QuaggaJSDebugDrawPath;
        drawRect: QuaggaJSDebugDrawRect;
    };
    ImageWrapper: ImageWrapper;

    /**
     * an object Quagga uses for drawing and processing, useful for calling code
     * when debugging
     */
    canvas: {
        ctx: {
            image: CanvasRenderingContext2D;
            overlay: CanvasRenderingContext2D
        };
        dom: {
            image: HTMLCanvasElement;
            overlay: HTMLCanvasElement
        }
    };

    CameraAccess: QuaggaJSCameraAccess;
}


/**
 * Used for accessing information about the active stream track and available video devices.
 */
export interface QuaggaJSCameraAccess {
    request(video: HTMLVideoElement, videoConstraints: MediaTrackConstraintsWithDeprecated): Promise<void>;

    release(): void;

    enumerateVideoDevices(): Promise<MediaDeviceInfo[]>;

    getActiveStreamLabel(): string;

    getActiveTrack(): MediaStreamTrack;
}

/**
 * Called whenever an item is detected or a process step has been completed.
 */
export interface QuaggaJSResultCallbackFunction {
    (
        data: QuaggaJSResultObject
    ): void;
}

/**
 * Called to draw debugging path. The path is an array of array of 2 numbers.
 * The def.x specifies element in the sub array is the x, and similary the def.y
 * defines the y.
 * typical values 0, 1, 'x', 'y'
 */
export interface QuaggaJSDebugDrawPath {
    (
        path: any[],
        def: QuaggaJSxyDef,
        ctx: CanvasRenderingContext2D,
        style: QuaggaJSStyle
    ): void
}

/**
 * Called to draw debugging Rectangle
 */
export interface QuaggaJSDebugDrawRect {
    (
        pos: any[],
        size: QuaggaJSRectSize,
        ctx: CanvasRenderingContext2D,
        style: QuaggaJSStyle
    ): void
}

/**
 * an object with an x and a y value, the x and y specify which element in
 * another array is the x or y value.
 * typical values 0, 1, 'x', 'y'
 */
// TODO: remove QuaggaJSxyDef from global type-defs (it's only used in image_debug, i think, which has a local definition)
export interface QuaggaJSxyDef {
    x: any;
    y: any;
}

/**
 * an object with an x and a y value
 */
export interface QuaggaJSxy {
    x: number;
    y: number;
}

/**
 * an object with a pair of x and a y values.
 * Used for giving a htiml canvas context.strokeRect function it's x, y, width
 * and height values.
 */
export interface QuaggaJSRectSize {
    pos: QuaggaJSxy;
    size: QuaggaJSxy;
}

/**
 * an object with the styles, color can actually be a color, a gradient or a
 * pattern (see defintions for context.strokeStyle. But is most commonly a
 * colour.
 */
export interface QuaggaJSStyle {
    color: string;

    /* http://www.w3schools.com/tags/canvas_linewidth.asp */
    lineWidth: number;
}

/**
 * Pass when creating a ResultCollector
 */
export interface QuaggaJSResultCollector {
    /**
     * keep track of the image producing this result
     */
    capture?: boolean;

    /**
     * maximum number of results to store
     */
    capacity?: number;

    /**
     * a list of codes that should not be recorded. This is effectively a list
     * of filters that return false.
     */
    blacklist?: Array<QuaggaJSCodeResult>;

    /**
     * passed a QuaggaJSCodeResult, return true if you want this to be stored,
     * false if you don't. Note: The black list is effectively a list of filters
     * that return false. So if you only want to store results that are ean_13,
     * you would say return codeResult.format==="ean_13"
     */
    filter?: QuaggaJSResultCollectorFilterFunction;

    /*
     * a static function that returns you a ResultCollector
     */
    create?(param: QuaggaJSResultCollector): QuaggaJSResultCollector;

    getResults?(): QuaggaJSCodeResult[];
}

/**
 * used for ResultCollector blacklists and filters
 */
export interface QuaggaJSCodeResult {
    code?: string;
    format?: string;
}

/**
 * Called to filter which Results to collect in ResultCollector
 */
export interface QuaggaJSResultCollectorFilterFunction {
    (
        data: QuaggaJSCodeResult
    ): boolean;
}

/**
 * The callbacks passed into onProcessed, onDetected and decodeSingle receive a
 * data object upon execution. The data object contains the following
 * information. Depending on the success, some fields may be undefined or just
 * empty.
 */
export interface QuaggaJSResultObject {
    codeResult: QuaggaJSResultObject_CodeResult;
    barcodes?: Array<QuaggaJSResultObject>
    line: {
        x: number;
        y: number;
    }[];
    angle: number;
    pattern: number[];
    box: number[][];
    boxes: number[][][];
    frame?: string;
}

export interface QuaggaJSResultObject_CodeResult {
    code: string | null;
    start: number;
    end: number;
    codeset: number;
    startInfo: {
        error: number;
        code: number;
        start: number;
        end: number;
    };
    decodedCodes: {
        error?: number;
        code: number;
        start: number;
        end: number;
    }[];

    endInfo: {
        error: number;
        code: number;
        start: number;
        end: number;
    };
    direction: number;
    format: string;
}

export type InputStreamType = 'VideoStream' | 'ImageStream' | 'LiveStream';

export interface QuaggaJSConfigObject {
    /**
     * The image path to load from, or a data url
     * Ex: '/test/fixtures/code_128/image-001.jpg'
     * or: 'data:image/jpg;base64,' + data
     */
    src?: string;

    inputStream?: {
        /**
         * @default "Live"
         */
        name?: string;

        /**
         * @default "LiveStream"
         */
        type?: InputStreamType;

        target?: Element | string,

        constraints?: MediaTrackConstraints;

        /**
         * defines rectangle of the detection/localization area. Useful when you
         * KNOW that certain parts of the image will not contain a barcode, also
         * useful when you have multiple barcodes in a row and you want to make
         * sure that only a code in, say the middle quarter is read not codes
         * above or below
         */
        area?: {
            /**
             * @default "0%", set this and bottom to 25% if you only want to
             * read a 'line' that is in the middle quarter
             */
            top?: string;

            /**
             * @default "0%"
             */
            right?: string;

            /**
             * @default "0%"
             */
            left?: string;

            /**
             * @default "0%", set this and top to 50% if you only want to read a
             * 'line' that is in the middle half
             */
            bottom?: string;
        };

        singleChannel?: boolean;
        size?: number;
        sequence?: boolean;
    };

    /**
     * @default false
     */
    debug?: boolean;

    /**
     * @default true
     */
    locate?: boolean;

    /**
     * @default 4
     */
    numOfWorkers?: number;

    /**
     * This top-level property controls the scan-frequency of the video-stream.
     * It’s optional and defines the maximum number of scans per second.
     * This renders useful for cases where the scan-session is long-running and
     * resources such as CPU power are of concern.
     */
    frequency?: number;

    decoder?: {
        /**
         * @default [ "code_128_reader" ]
         */
        readers?: (QuaggaJSReaderConfig | string)[];

        debug?: {
            /**
             * @default false
             */
            drawBoundingBox?: boolean;

            /**
             * @default false
             */
            showFrequency?: boolean;

            /**
             * @default false
             */
            drawScanline?: boolean;

            /**
             * @default false
             */
            showPattern?: boolean;
        };

        /**
         * The multiple property tells the decoder if it should continue decoding after finding a valid barcode.
         * If multiple is set to true, the results will be returned as an array of result objects.
         * Each object in the array will have a box, and may have a codeResult
         * depending on the success of decoding the individual box.
         */
        multiple?: boolean;
    };

    locator?: {
        /**
         * @default true
         */
        halfSample?: boolean;

        /**
         * @default "medium"
         * Available values: x-small, small, medium, large, x-large
         */
        patchSize?: string;

        debug?: {
            /**
             * @default false
             */
            showCanvas?: boolean;

            /**
             * @default false
             */
            showPatches?: boolean;

            /**
             * @default false
             */
            showFoundPatches?: boolean;

            /**
             * @default false
             */
            showSkeleton?: boolean;

            /**
             * @default false
             */
            showLabels?: boolean;

            /**
             * @default false
             */
            showPatchLabels?: boolean;

            /**
             * @default false
             */
            showRemainingPatchLabels?: boolean;

            boxFromPatches?: {
                /**
                 * @default false
                 */
                showTransformed?: boolean;

                /**
                 * @default false
                 */
                showTransformedBox?: boolean;

                /**
                 * @default false
                 */
                showBB?: boolean;
            };
        }
    };
}

export interface QuaggaJSReaderConfig {
    format: string;
    config: {
        supplements: string[];
    }
}

export interface MediaTrackConstraintsWithDeprecated extends MediaTrackConstraints {
    minAspectRatio?: number;
    facing?: string;
}

export interface QuaggaBuildEnvironment {
    development?: boolean;
    node?: boolean;
}

export type TypedArrayConstructor =
    Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor;

export type TypedArray =
    Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array;
