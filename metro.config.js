const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Firebase JS SDK: usar la build de React Native de @firebase/auth
// (evita "Component auth has not been registered yet")
config.resolver.sourceExts.push('cjs')
config.resolver.unstable_enablePackageExports = false

module.exports = config
