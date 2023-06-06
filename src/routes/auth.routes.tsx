import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { SignIn } from '../Screens/Signin'
import { SignUp } from '../Screens/SignUp'

type AuthRoutes = {
  signIn: undefined
  // como no signIn não tera nenhum parametro passado para rota ele será undefined
  signUp: undefined
}

/**
  * tipagem que será reutilizada quando for preciso utilizar as rotas, então quando for utilizar a rota
    juntamente com ela será utilizada a tipagem para rota que estiver sendo ultilizada, seja ela rotas de autenticação
    ou rotas da aplicação.

    AuthNavigatorRoutesProps será atribuido a ela o valor das NativeStackNavigationProp já nativas do stackNavigatio
    e ela recebe o conteúdo das rotas da aplicação em si AuthRoutes

    propriedades das rotas de navegação de autenticação 
  */
export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()
// com o <AuthRoutes> mostra o nome das rotas quando forem chamadas na screen

// eslint-disable-next-line no-redeclare
export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  )
}
