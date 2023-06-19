// Centraliza onde os dados do user serão armazenados

import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserDTO } from '../dtos/UserDTO'
import { USER_STORAGE } from './storageConfig'

// lembrando que o asyncStorage é assincrono, necessita de uma resposta
export async function storageUserSave(user: UserDTO) {
  // função recebe como parametro um user que sera do tipo userDTO
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
  // o asyncstorage é baseado em chave e valor por isso usou a chave e passou o valor que deve ser armazenado
  // fala que a chave que armazenara o user sera USER_STORAGE
}

// metodo que busca as informações do user dentro do storage
export async function storageUserGet() {
  // usando o metodo get para pegar o user de dentro do storage
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  // diz que o user recebido é do tipo userDto, e faz uma verificação
  // se houver dados do user requisitado dentro do storage transforma ela para objeto
  // caso contrario retorna um objeto vazio
  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE)
}
