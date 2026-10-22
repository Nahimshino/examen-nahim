const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Firebase JS SDK: usar la build de React Native de @firebase/auth
// (evita "Component auth has not been registered yet")
config.resolver.sourceExts.push('cjs')

// Los "exports" de package.json se desactivan solo para Firebase.
// React Native 0.88 (SDK 58) los necesita para sus propios módulos internos.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('firebase') || moduleName.startsWith('@firebase/')) {
    return context.resolveRequest({ ...context, unstable_enablePackageExports: false }, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
