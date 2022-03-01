export declare function encodeB64(arraybuffer: ArrayBuffer): string;
export declare function decodeB64(base64: string): ArrayBuffer;
export declare function xorCrypto(binaryData: ArrayBuffer, key: ArrayBuffer): ArrayBuffer;
export declare const utf8Encoder: TextEncoder;
export declare const utf8Decoder: TextDecoder;
export declare function xorDecryptB64EncodedUtf8(b64: string): string;
export declare function xorEncryptStringUtf8B64(text: string, key?: ArrayBuffer): string;
