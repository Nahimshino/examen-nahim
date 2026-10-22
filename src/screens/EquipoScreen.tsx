import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import TarjetaMiembro from '../components/TarjetaMiembro'
import { useEquipo } from '../context/EquipoContext'
import { C } from '../tema'

export default function EquipoScreen() {
  const { equipo, cargandoEquipo, errorEquipo, cambiarRol, quitar, sembrar, cargarEquipo } = useEquipo()

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.titulo}>Mi equipo</Text>
      {cargandoEquipo && equipo.length === 0 && <View style={estilos.centro}><ActivityIndicator size="large" color={C.acento} /></View>}
      {!cargandoEquipo && errorEquipo !== '' && (
        <View style={estilos.centro}>
          <Text style={estilos.error}>{errorEquipo}</Text>
          <Pressable style={estilos.boton} onPress={cargarEquipo}><Text style={estilos.textoBoton}>Reintentar</Text></Pressable>
        </View>
      )}
      {!cargandoEquipo && errorEquipo === '' && equipo.length === 0 && (
        <View style={estilos.centro}>
          <Text style={estilos.vacio}>Tu equipo está vacío. Agrega Pokémon desde Explorar.</Text>
          <Pressable style={estilos.boton} onPress={sembrar}><Text style={estilos.textoBoton}>Cargar equipo de ejemplo</Text></Pressable>
        </View>
      )}
      {equipo.length > 0 && (
        <ScrollView contentContainerStyle={estilos.lista}>
            {equipo.map((m) => (
              <TarjetaMiembro key={m.id} miembro={m} onCambiarRol={cambiarRol} onQuitar={(mm) => quitar(mm.id)} />
            ))}
        </ScrollView>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  titulo: { color: C.texto, fontSize: 24, fontWeight: '800', paddingTop: 55, paddingHorizontal: 20, paddingBottom: 8 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  error: { color: C.error, textAlign: 'center' },
  vacio: { color: C.suave, textAlign: 'center' },
  boton: { borderWidth: 1.5, borderColor: C.acento, borderRadius: 10, minHeight: 44, paddingHorizontal: 20, justifyContent: 'center' },
  textoBoton: { color: C.acento, fontWeight: '700' },
  lista: { padding: 16, gap: 12 },
})
