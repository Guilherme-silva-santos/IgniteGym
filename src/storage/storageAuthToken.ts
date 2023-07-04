import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_STORAGE } from './storageConfig'

type storageAuthTokenProps = {
  token: string
  refresh_token: string
}

export async function storageAuthTokenSave({
  token,
  refresh_token,
}: storageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refresh_token }),
  )
  // fução que armazena o token do user dentro da chave
  // sempre lembrando que o asyncStorage é baseado em chave e valor
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)
  // buscando o token de dentro da chave

  const { token, refresh_token }: storageAuthTokenProps = response
    ? JSON.parse(response)
    : {}

  return { token, refresh_token }
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
