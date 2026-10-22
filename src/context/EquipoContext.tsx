import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { escucharSesion, registrarUsuario, entrarUsuario, salirUsuario } from '../services/authService'
import { obtenerEquipo, agregarMiembro, actualizarRol, quitarMiembro, sembrarEquipo } from '../services/equipoService'
import type { MiembroEquipo, PokemonDetalle, Rol, UsuarioActual } from '../types'

const CLAVE_CACHE = '@equipo_cache'

async function guardarCache(lista: MiembroEquipo[]): Promise<void> {
  await AsyncStorage.setItem(CLAVE_CACHE, JSON.stringify(lista))
}

// Si la caché está dañada (por ejemplo, de una versión anterior), se descarta y se sigue con Firestore.
async function leerCache(): Promise<MiembroEquipo[]> {
  const crudo = await AsyncStorage.getItem(CLAVE_CACHE)
  if (!crudo) return []
  try {
    const datos = JSON.parse(crudo)
    return Array.isArray(datos) ? datos : []
  } catch {
    await AsyncStorage.removeItem(CLAVE_CACHE)
    return []
  }
}

interface ValorContexto {
  usuario: UsuarioActual | null
  cargandoAuth: boolean
  equipo: MiembroEquipo[]
  cargandoEquipo: boolean
  errorEquipo: string
  registrar: (email: string, contrasena: string) => Promise<void>
  entrar: (email: string, contrasena: string) => Promise<void>
  salir: () => Promise<void>
  cargarEquipo: () => Promise<void>
  agregar: (pokemon: PokemonDetalle) => Promise<'agregado' | 'duplicado'>
  quitar: (id: string) => Promise<void>
  cambiarRol: (id: string, rol: Rol) => Promise<void>
  sembrar: () => Promise<void>
}

const EquipoContext = createContext<ValorContexto | null>(null)

export function EquipoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([])
  const [cargandoEquipo, setCargandoEquipo] = useState(false)
  const [errorEquipo, setErrorEquipo] = useState('')

  // Una sola suscripción a la sesión de Firebase; la función de limpieza la cancela al desmontar.
  useEffect(() => {
    const cancelar = escucharSesion((u) => {
      setUsuario(u ? { uid: u.uid, email: u.email ?? '' } : null)
      if (!u) setEquipo([])
      setCargandoAuth(false)
    })
    return cancelar
  }, [])

  // Al haber usuario: primero se muestra la caché y luego se pide el equipo a Firestore.
  useEffect(() => {
    if (!usuario) return
    async function iniciar() {
      const cache = await leerCache()
      setEquipo(cache)
      await cargarEquipo()
    }
    iniciar()
  }, [usuario?.uid])

  function uidActual(): string {
    if (!usuario) throw new Error('No hay sesión')
    return usuario.uid
  }

  async function cargarEquipo(): Promise<void> {
    setCargandoEquipo(true)
    setErrorEquipo('')
    try {
      const datos = await obtenerEquipo(uidActual())
      setEquipo(datos)
      await guardarCache(datos)
    } catch (e) {
      setErrorEquipo('No se pudo cargar tu equipo. Revisa tu conexión y las reglas de Firestore.')
    } finally {
      setCargandoEquipo(false)
    }
  }

  async function agregar(pokemon: PokemonDetalle): Promise<'agregado' | 'duplicado'> {
    if (equipo.some((m) => m.pokemonId === pokemon.id)) return 'duplicado'
    const nuevo = await agregarMiembro(uidActual(), pokemon)
    const lista = [...equipo, nuevo]
    setEquipo(lista)
    await guardarCache(lista)
    return 'agregado'
  }

  async function quitar(id: string): Promise<void> {
    await quitarMiembro(uidActual(), id)
    const lista = equipo.filter((m) => m.id !== id)
    setEquipo(lista)
    await guardarCache(lista)
  }

  async function cambiarRol(id: string, rol: Rol): Promise<void> {
    const miembro = equipo.find((m) => m.id === id)
    if (!miembro) return
    await actualizarRol(uidActual(), id, rol)
    const lista = equipo.map((m) => (m.id === id ? { ...m, rol } : m))
    setEquipo(lista)
    await guardarCache(lista)
  }

  async function sembrar(): Promise<void> {
    await sembrarEquipo(uidActual())
    await cargarEquipo()
  }

  async function registrar(email: string, contrasena: string): Promise<void> {
    await registrarUsuario(email, contrasena)
  }

  async function entrar(email: string, contrasena: string): Promise<void> {
    await entrarUsuario(email, contrasena)
  }

  async function salir(): Promise<void> {
    await salirUsuario()
  }

  return (
    <EquipoContext.Provider
      value={{ usuario, cargandoAuth, equipo, cargandoEquipo, errorEquipo, registrar, entrar, salir, cargarEquipo, agregar, quitar, cambiarRol, sembrar }}
    >
      {children}
    </EquipoContext.Provider>
  )
}

export function useEquipo(): ValorContexto {
  const valor = useContext(EquipoContext)
  if (!valor) throw new Error('useEquipo debe usarse dentro de EquipoProvider')
  return valor
}
