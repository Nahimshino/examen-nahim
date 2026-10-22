import { View, Text, Pressable, StyleSheet } from 'react-native'
import { ETIQUETA_ROL } from '../types'
import type { Rol } from '../types'
import { C } from '../tema'

const ROLES: Rol[] = ['titular', 'reserva', 'banca']

interface Props {
  actual: Rol
  onElegir: (rol: Rol) => void
}

export default function SelectorRol({ actual, onElegir }: Props) {
  return (
    <View style={estilos.fila}>
      {ROLES.map((r, i) => (
        <Pressable key={i} style={[estilos.chip, actual === r && estilos.chipActivo]} onPress={() => onElegir(r)}>
          <Text style={[estilos.texto, actual === r && estilos.textoActivo]}>{ETIQUETA_ROL[r]}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 10 },
  chip: { paddingHorizontal: 12, minHeight: 44, borderRadius: 999, backgroundColor: C.fondo, borderWidth: 1, borderColor: C.borde, justifyContent: 'center' },
  chipActivo: { backgroundColor: C.acento, borderColor: C.acento },
  texto: { color: C.suave, fontWeight: '600', fontSize: 13 },
  textoActivo: { color: '#0b1120' },
})
