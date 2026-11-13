import { version as pkgVersion } from '../../package.json'

// Annotated so the emitted .d.ts is `string` and does not import package.json itself.
const version: string = pkgVersion

export default version
