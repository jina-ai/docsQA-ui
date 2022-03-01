/* eslint-disable @typescript-eslint/no-magic-numbers */

import { randomUint8Array } from './random';

/* eslint-disable no-bitwise */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// Use a lookup table to find the index.
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

export function encodeB64(arraybuffer: ArrayBuffer) {
    const bytes = new Uint8Array(arraybuffer);
    let i;
    const len = bytes.length;
    let base64 = '';
    const b64Arr = [];

    for (i = 0; i < len; i += 3) {
        b64Arr.push(chars[bytes[i] >> 2]);
        b64Arr.push(chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]);
        b64Arr.push(chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]);
        b64Arr.push(chars[bytes[i + 2] & 63]);
    }

    base64 = b64Arr.join('');

    if (len % 3 === 2) {
        base64 = `${base64.substring(0, base64.length - 1)}=`;
    } else if (len % 3 === 1) {
        base64 = `${base64.substring(0, base64.length - 2)}==`;
    }

    return base64;
}

export function decodeB64(base64: string) {
    let bufferLength = base64.length * 0.75;
    const len = base64.length;
    let i;
    let p = 0;
    let encoded1;
    let encoded2;
    let encoded3;
    let encoded4;

    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }

    const arraybuffer = new ArrayBuffer(bufferLength);
    const bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
}

function roundKey(key: Uint8Array, i: number) {
    return key[Math.floor(i % key.length)];
}


export function xorCrypto(binaryData: ArrayBuffer, key: ArrayBuffer) {
    const mapped = new ArrayBuffer(binaryData.byteLength);
    const keyView = new Uint8Array(key);
    const dataView = new Uint8Array(binaryData);
    const mappedView = new Uint8Array(mapped);

    for (const [i, v] of dataView.entries()) {
        mappedView[i] = v ^ roundKey(keyView, i);
    }

    return mapped;
}

export const utf8Encoder = new TextEncoder();
export const utf8Decoder = new TextDecoder('utf-8');

const KEY_LENGTH = 6;

export function xorDecryptB64EncodedUtf8(b64: string) {
    const decoded = decodeB64(b64);
    const cKey = decoded.slice(0, KEY_LENGTH);
    const decrypted = xorCrypto(decoded.slice(KEY_LENGTH), cKey);

    return utf8Decoder.decode(decrypted);
}

export function xorEncryptStringUtf8B64(text: string, key?: ArrayBuffer) {
    const cKey = key?.slice(0, KEY_LENGTH) || randomUint8Array(KEY_LENGTH).buffer;
    const encoded = utf8Encoder.encode(text);
    const encrypted = xorCrypto(encoded.buffer, cKey);
    const joint = new Uint8Array(cKey.byteLength + encrypted.byteLength);
    joint.set(new Uint8Array(cKey), 0);
    joint.set(new Uint8Array(encrypted), cKey.byteLength);

    return encodeB64(joint.buffer);
}
