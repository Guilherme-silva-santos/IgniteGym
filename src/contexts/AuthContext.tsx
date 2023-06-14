import { ReactNode, createContext, useState } from 'react'
import { UserDTO } from '../dtos/UserDTO'
import { api } from '../services/api'

export type AuthContextDataProps = {
  // o contexto vai receber um user do tipo userDto
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
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

  async function signIn(email: string, password: string) {
    /**
     * sempre que for lidar com requisições e bom envolver por um bloco trycatch
     */
    // eslint-disable-next-line no-useless-catch
    try {
      /**
       *  envia o email e a senha digitado no form de signin para dentro das sessões do banco de dados
       *  e verifica se ja existe um user com esses dados e se houver altera o estado com os dados do
       *  user que ja esta criado.
       *  foi usando o async pois a solicitação para o back-end é feita de forma asincrona por padrão
       */
      const { data } = await api.post('/sessions', { email, password })

      /**
       * como quando é feito a requisição o conteudo do estado é alterado
       * quando o estado for utilizado para fazer o direcionamento para dentro da aplicação
       * ele só faz um comparação para ver se o user existe la dentro.
       */

      if (data.user) {
        setUser(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
