/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
import axios, { AxiosError, AxiosInstance } from 'axios'
import { AppError } from '../utils/AppError'
import { storageAuthTokenGet, storageAuthTokenSave } from '../storage/storageAuthToken'

type SignOut = () => void

type ApiIsntanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

type PromiseType = {
  // tipagem para requisições que estão na fila
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

const api = axios.create({
  baseURL: 'http://192.168.0.7:3333',
}) as ApiIsntanceProps

let failedQueued: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid'
        ) {
          const { refresh_token } = await storageAuthTokenGet()
          if (!refresh_token) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config
          // acessa todas as configurações do erro de requisição

          if (isRefreshing) {
            // se estiver solicitando um novo token, retorna uma nova promisse
            // e paga a fila de requisições e da um push para dentro dela
            // inserindo os metodos onSuccess e onFailure
            return new Promise((resolve, reject) => {
              failedQueued.push({
                onSuccess: (token: string) => { 
                  originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                },
              })
            })
          }
          // como a variavel começa como false ela ela vai passar e ignorar o if e quando chegar aqui
          // a var fica true então será jogada para o if
          isRefreshing = true

          return new Promise(async (resolve,reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {refresh_token})
              await storageAuthTokenSave({token: data.token, refresh_token: data.refresh_token})
              if(originalRequestConfig.data){
                // verifica se existe algum dado sendo enviado na requisição 
                // se sim faz um parse nele 
                originalRequestConfig.data = JSON.parse(originalRequestConfig.data)
              }
              // atualiza o header da requisição dando ele como autorizado 
              originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}`}
              // atualizando o header das proximas requisições 
              api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
              
              // percorrendo a fila de requisições para cada requisição que existe la dentro e dando sucesso 
              // e passando para ele o novo token atualizado 
              failedQueued.forEach(request =>{
                request.onSuccess(data.token)
              })

              console.log('Token atualizado!')
              // reenviando e processando a requisição 
              resolve(api(originalRequestConfig))

            } catch (error:any) {
              // caso falhe percorre a fila de requisições, e pega e usa o metodo de erro para dizer que a requisição
              // falhou 
              failedQueued.forEach(request=>{
                request.onFailure(error)
              })
              signOut()
              reject(error)
            }finally{
              // se passou por aqui é porque o token já esta atualizado, então 
              // pôe o isRefreshing para false, e limpa a fila de requisições 
              isRefreshing = false
              failedQueued = []
            }
          })
        }
        signOut()
      }
      if (requestError.response && requestError.response.data) {
        // verifica se é um erro tratado ou não, so verifica se não for um erro relacionado ao token
        return Promise.reject(new AppError(requestError.response.data.message))
      } else {
        return Promise.reject(new AppError(requestError))
      }
    },
  )
  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
