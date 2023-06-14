/* eslint-disable jsx-a11y/alt-text */
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '../routes/auth.routes'

import { Input } from '../components/InputArea'
import { Button } from '../components/Button'

import BackgroundImg from '../assets/background.png'
import LogoSvg from '../assets/logo.svg'

import { useForm, Controller } from 'react-hook-form'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../hooks/useAuth'
import { AppError } from '../utils/AppError'
import { useState } from 'react'

type FormDataProps = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o E-mail').email('E-mail inválido'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve conter pelo meno 6 digítos'),
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  /**
   * passa para o useRoutes a tipagem das rotas da aplicação
   * para que seja possivel utilizar ambas as tipagens dependendo do contexto
   */
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  })

  function handleNewAccount() {
    navigation.navigate('signUp')
    // passa a rota que o user deve ser direcionado ao clicar o botão
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      // faz uma verificação se o erro que aconteceu pertence ao apperror ou seja se é um erro tratado
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi passível entrar, tente novamente mais tartde '

      setIsLoading(false)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando "
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a Conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            // a propriedade isloading é nativa do botão do nativebase e para dentro dela foi pasada
            // o estado de isloading que toda vez que o botão for clicado o estado é alterado para truw
            isLoading={isLoading}
          />
        </Center>
        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não possui conta ?
          </Text>
          <Button
            title="Criar Conta"
            variant={'outline'}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
