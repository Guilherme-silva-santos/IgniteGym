/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react'
import { Heading, VStack, SectionList, Text, useToast } from 'native-base'

import { ScreenHeader } from '../components/ScreenHeader'
import { HistoryCard } from '../components/HistoryCard'
import { AppError } from '../utils/AppError'
import { api } from '../services/api'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryByDayDTO } from '../dtos/HistoryByDayDTO'

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o histórico. Tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * serve para para perceber quando a home tera focu novamente
   * por exemplo caso o user vá para o histórico e volte para home
   * useCallback para que a função não seja executada de forma desnecesaria
   * só quando for preciso buscar as informações
   * groupSelected para que toda vez que o grupo selecionado mudar o hook seja carregado
   */
  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda.{'\n'} Vamos Treinar hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
