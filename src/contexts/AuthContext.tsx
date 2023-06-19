/* eslint-disable no-useless-catch */
import { ReactNode, createContext, useEffect, useState } from 'react'
import { UserDTO } from '../dtos/UserDTO'
import { api } from '../services/api'
import {
  storageUserRemove,
  storageUserGet,
  storageUserSave,
} from '../storage/storageUser'
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '../storage/storageAuthToken'

export type AuthContextDataProps = {
  // o contexto vai receber um user do tipo userDto
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

// criando o contexto e dentro dos () é necessario passar o valor inicial do contexto
export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // cria um componente que contem o provider de ira englobar a aplicação inteira

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  // define que o conteudo inicial do estado é vazio
  // usou o fragment para dizer que mesmo o user começando como um objeto vazio ele possui uma tipagem
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  // serve para mostrar que está sendo feita aguma manipulação no storage do dispositivo
  // estado que verifica se user ainda esta sendo buscado

  async function UserAndTokenUpdate(userData: UserDTO, token: string) {
    // função que atualiza o token do user no cabeçalho da requisição
    // e armazena as informaç~çoes do user no estado
    api.defaults.headers.common.Athorization = `Bearer ${token}`
    // com o tipo do token que é bearer e passando o token par ele

    setUser(userData)
    // apos salvar as informações do user atualiza o estado de user
  }

  async function UserAndTokenStorageSave(userData: UserDTO, token: string) {
    // função que salva as informações no dispositivo do user
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      // salvando o user dentro do storage
      await storageAuthTokenSave(token)
      // salvando o token do user dentro do storage
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      /**
       *  envia o email e a senha digitado no form de signin para dentro das sessões do banco de dados
       *  e verifica se ja existe um user com esses dados e se houver altera o estado com os dados do
       *  user que ja esta criado.
       *  foi usando o async pois a solicitação para o back-end é feita de forma asincrona por padrão
       */
      const { data } = await api.post('/sessions', { email, password })
      if (data.user && data.token) {
        // armazena od dados do user no dispositivo
        await UserAndTokenStorageSave(data.user, data.token)
        // atualiza tanto o estado quanto o cabeçalho que estão presentes nessa função
        UserAndTokenUpdate(data.user, data.token)
        // chama a função que armazena o token e o user, pega dela o token e o user
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageUserRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadingUserData() {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (token && userLogged) {
        /**
         * verifica se o user esta autenticado atraves das informações salvas dentro do dispositivo
         * do ususario
         * e então so atualiza o estado e incluir o token de volta no cabeçalho
         */
        UserAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadingUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingUserStorageData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
