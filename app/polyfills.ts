import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'util'

const globalWithTextEncoding = globalThis as typeof globalThis & {
  TextEncoder?: typeof NodeTextEncoder
  TextDecoder?: typeof NodeTextDecoder
}

if (typeof globalWithTextEncoding.TextEncoder === 'undefined') {
  globalWithTextEncoding.TextEncoder = NodeTextEncoder
}

if (typeof globalWithTextEncoding.TextDecoder === 'undefined') {
  globalWithTextEncoding.TextDecoder = NodeTextDecoder
}
