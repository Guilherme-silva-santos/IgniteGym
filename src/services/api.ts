import axios from 'axios'
import { AppError } from '../utils/AppError'

const api = axios.create({
  baseURL: 'http://192.168.0.7:3333',
})

api.interceptors.response.use(
  // como o primeiro parametro é se tudo der certo então se der certo so retorna a resposta
  (response) => response,
  // já no segundo parametro que é o erro, vai ser feita a verificação se é um erro ja tratado pelo
  // back-end ou se é um erro interno que não foi tratado
  (error) => {
    // verifica se dentro do erro tem uma resposta e além da resposta se tem um data que seria a mensagem
    // que ja foi tratada pelo back-end como a menssagem de e-mail em uso
    if (error.response && error.response.data) {
      // se houver a mensagem então retorna ela como uma promisse rejeitada ou seja vai retornar a mensagem para o user
      // e transformar a mensagem no padrão do AppError e dentro do app error passa a mensagem que vem de dentro
      // do back-end
      return Promise.reject(new AppError(error.response.data.message))
    } else {
      // se não existir uma mensagem já tratada pelo back-end então exibe uma mensagem "alternativa"
      return Promise.reject(new AppError(error))
    }
  },
)

export { api }
