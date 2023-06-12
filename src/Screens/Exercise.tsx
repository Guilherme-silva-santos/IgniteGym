import {
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '../routes/app.routes'

import BodySvg from '../assets/body.svg'
import SeriesSvg from '../assets/series.svg'
import RepetitionsSvg from '../assets/repetitions.svg'
import { Button } from '../components/Button'

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function HandleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack flex={1}>
      {/**
       * vstack abaixo pertence ao header da página de exercicios
       */}
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={HandleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            {/**
             * flexShrink={1} para que o texto nãop empurre o icone para fora
             * e sim quebre a linha quando for necessário
             */}
            Remada Unilateral
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        <VStack p={8}>
          <Image
            w="full"
            h={80}
            mb={3}
            resizeMode="cover" // quando a imagem for pequena para o espaço estipulado
            // para ela, a imagem vai se ajustar de forma automatica
            rounded="lg"
            source={{
              uri: 'https://blog.gsuplementos.com.br/wp-content/uploads/2022/09/Serrote-exercicio.jpg',
            }}
            alt="imagem do exercicio puxada unilateral"
          />
          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb={6}
              mt={5}
            >
              <HStack>
                <RepetitionsSvg />
                <Text color="gray.200" ml={2}>
                  3 Séries
                </Text>
              </HStack>
              <HStack>
                <SeriesSvg />
                <Text color="gray.200" ml={2}>
                  12 Repetições
                </Text>
              </HStack>
            </HStack>
            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
