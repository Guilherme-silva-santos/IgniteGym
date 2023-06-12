import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  // pega a tipagem direto do nativebase, e pega tudo o que vem dela

  const invalid = !!errorMessage || isInvalid
  // o input será invalido caso houver uma mensagem de erro ou se eu invalida-lo atraves da prop
  // já presente no input do nativebase

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14} // height
        px={4} // padding
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest} // para que todas as props do input sejam disponibilizadas no componente, como por exemplo o
        // placeholder, rest sempre é a ultima prop
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}
