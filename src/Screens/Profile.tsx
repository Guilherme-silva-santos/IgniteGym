/* eslint-disable no-useless-catch */
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from 'native-base'

import { api } from '../services/api'

import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { ScreenHeader } from '../components/ScreenHeader'
import { Input } from '../components/InputArea'
import { Button } from '../components/Button'
import { UserPhoto } from '../components/UserPhoto'
import { AppError } from '../utils/AppError'

import * as ImagePiker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { Controller, useForm } from 'react-hook-form'

import { useAuth } from '../hooks/useAuth'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import defaultUserPhotoImg from '../assets/userPhotoDefault.png'

const photoSize = 33

type FormDataProps = {
  email: string
  name: string
  password: string
  old_password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha deve conter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    // verifica se o confirm_password é uma referencia ao password
    .oneOf([yup.ref('password')], 'a confirmação de senha não confere')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => value || null),
    }),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      // habilitando para quer o user acessa a foto na galeria do dispositivo
      const photoSelected = await ImagePiker.launchImageLibraryAsync({
        mediaTypes: ImagePiker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      // caso o user tenha selecionado alguma foto,verifica se tem uma uri e pega as informações da foto
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )
        // pega do file system a informação de tamanho da imagem

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 10) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 10MB',
            placement: 'top',
            bgColor: 'red.500',
          })
        }
        // setUserPhoto(photoSelected.assets[0].uri)

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        // vai cortar o nome da imagem até onde possui um . e exibir o que vem depois
        const photoFile = {
          // define as informações que a imagem pecisa ter
          // o nome da imagem será o nome de usuário mais a extensão do arquivo
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // tipo da imagem mais a extensão
        } as any

        const userPhotoUploadForm = new FormData()

        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)
        console.log(userUpdated)

        toast.show({
          title: 'Avatar alterado com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setUpdating(true)

      const userUpdated = user
      // aqui estão os dados do user
      userUpdated.name = data.name
      // pegando os novos dados do user

      await api.put('/users', data)

      await updateUserProfile(userUpdated)
      // e para a função que faz o put do user recebe os dados do usuário atualizado

      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados do usuário tente novamente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={photoSize}
              h={photoSize}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size={photoSize}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              // desestrutura o field pegando o value e o onchange
              // onchenge vai monitorar a mudança do input
              // value para definir o conteudo do input quando as informações dele forem carregadas
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Alterar Senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.500"
                placeholder="Senha antiga"
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.500"
                placeholder="Nova Senha"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.500"
                placeholder="Confirme a nova senha"
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={updating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
