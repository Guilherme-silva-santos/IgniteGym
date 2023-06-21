/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base'
import { HomeHeader } from '../components/HomeHeader'
import { Group } from '../components/Group'
import { ExerciseCard } from '../components/ExerciseCard'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import { ExerciseDTO } from '../dtos/ExerciseDTO'
import { Loading } from '../components/Loading'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const toast = useToast()
  const [groupSelected, setGroupSelected] = useState('antebraço')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExercisesDetails(exerciseId: string) {
    // esse id esta sendo recebido atraves do click do botão quando o user for entrar em um exercicio
    navigation.navigate('exercises', { exerciseId })
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      // coloca entre `` pois precisa acesar os exercicios do grupo selecionado
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios deste grupo. Tente novamente mais tarde'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  /**
   * serve para para perceber quando a home tera focu novamente
   * por exemplo caso o user vá para o histórico e volte para home
   * useCallback para que a função não sejaexecutada de forma desnecesaria
   * groupSelected para que toda vez que o grupo selecionado mudar o hook seja carregado
   */
  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxHeight={10}
        minHeight={10}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" marginBottom={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>
            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExercisesDetails(item.id)}
                // passando o id do exercício selecionado para o handleOpenExercisesDetails
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}
