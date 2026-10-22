import { useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import SelectorRol from './SelectorRol'
import { ETIQUETA_ROL } from '../types'
import type { MiembroEquipo, Rol } from '../types'
import { C } from '../tema'

interface Props {
  miembro: MiembroEquipo
  onCambiarRol: (id: string, rol: Rol) => void
  onQuitar: (miembro: MiembroEquipo) => void
}

export default function TarjetaMiembro({ miembro, onCambiarRol, onQuitar }: Props) {
  const [expandido, setExpandido] = useState(false)

  return (
    <View style={estilos.tarjeta}>
      <Pressable style={estilos.cabecera} onPress={() => setExpandido((v) => !v)}>
        {miembro.sprite ? <Image source={{ uri: miembro.sprite }} style={estilos.imagen} /> : <Text style={estilos.placeholder}>❔</Text>}
        <View style={{ flex: 1 }}>
          <Text style={estilos.nombre}>{miembro.nombre}</Text>
          <Text style={estilos.rol}>{ETIQUETA_ROL[miembro.rol]}</Text>
        </View>
        <Text style={estilos.flecha}>{expandido ? '▲' : '▼'}</Text>
      </Pressable>

      {expandido && (
        <View>
          <Text style={estilos.tipos}>Tipos: {miembro.tipos.join(', ')}</Text>
          <SelectorRol actual={miembro.rol} onElegir={(rol) => onCambiarRol(miembro.id, rol)} />
          <Pressable onPress={() => onQuitar(miembro)} style={estilos.botonQuitar}>
            <Text style={estilos.textoQuitar}>Quitar</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: C.tarjeta, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.borde },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  imagen: { width: 56, height: 56 },
  placeholder: { width: 56, textAlign: 'center', fontSize: 28 },
  nombre: { color: C.texto, fontSize: 17, fontWeight: '700', textTransform: 'capitalize' },
  rol: { color: C.suave, fontSize: 13, marginTop: 2 },
  flecha: { color: C.suave, fontSize: 14, paddingHorizontal: 6 },
  tipos: { color: C.suave, fontSize: 13, marginTop: 10 },
  botonQuitar: { height: 28, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#7f1d1d', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 12 },
  textoQuitar: { color: '#fecaca', fontWeight: '700' },
})
