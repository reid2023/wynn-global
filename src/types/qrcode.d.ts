declare module 'qrcode' {
  interface QRCodeToCanvasOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    type?: string;
    rendererOpts?: {
      quality?: number;
    };
  }

  export function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<void>;

  export function toDataURL(text: string, options?: QRCodeToCanvasOptions): Promise<string>;

  export function toString(text: string, options?: QRCodeToCanvasOptions): Promise<string>;
}
