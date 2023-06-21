/* eslint-disable react-hooks/exhaustive-deps */
import {
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
  useToast,
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '../routes/app.routes'

import BodySvg from '../assets/body.svg'
import SeriesSvg from '../assets/series.svg'
import RepetitionsSvg from '../assets/repetitions.svg'
import { Button } from '../components/Button'
import { AppError } from '../utils/AppError'
import { api } from '../services/api'
import { useEffect, useState } from 'react'
import { ExerciseDTO } from '../dtos/ExerciseDTO'
import { Loading } from '../components/Loading'

type RoutesParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [submittingRegister, setSubmittingRegister] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const route = useRoute()
  const toast = useToast()

  const { exerciseId } = route.params as RoutesParamsProps

  function HandleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes dos exercícios. Tente novamente mais tarde'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSubmittingRegister(true)

      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.500',
      })

      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível registrar exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setSubmittingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
    // foi usado o execiseid como dependencia para caso o id mudo seja buscado as informações
  }, [exerciseId])

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
          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            {/**
             * flexShrink={1} para que o texto nãop empurre o icone para fora
             * e sim quebre a linha quando for necessário
             */}
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack p={8}>
            <Box rounded="lg" mb={3} overflow="hidden">
              <Image
                w="full"
                h={80}
                mb={3}
                resizeMode="cover" // quando a imagem for pequena para o espaço estipulado
                // para ela, a imagem vai se ajustar de forma automatica
                rounded="lg"
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt="imagem do exercicio puxada unilateral"
              />
            </Box>
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
                    {exercise.series} Séries
                  </Text>
                </HStack>
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.repetitions} Repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                title="Marcar como realizado"
                isLoading={submittingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}
