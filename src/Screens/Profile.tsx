import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from 'native-base'
import { ScreenHeader } from '../components/ScreenHeader'
import { UserPhoto } from '../components/UserPhoto'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Input } from '../components/InputArea'
import { Button } from '../components/Button'
import * as ImagePiker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const photoSize = 33

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/Guilherme-silva-santos.png',
  )

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePiker.launchImageLibraryAsync({
        mediaTypes: ImagePiker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        // eslint-disable-next-line no-useless-return
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )
        // pega do file system a informação de tamanho da imagem

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
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
              source={{ uri: userPhoto }}
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

          <Input placeholder="Nome" bg="gray.600" />
          <Input placeholder="E-mail" bg="gray.600" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar Senha
          </Heading>
          <Input bg="gray.500" placeholder="Senha antiga" secureTextEntry />
          <Input bg="gray.500" placeholder="Nova Senha" secureTextEntry />
          <Input
            bg="gray.500"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  )
}