import { Input as NativeBaseInput, IInputProps } from 'native-base'

export function Input({ ...rest }: IInputProps) {
  // pega a tipagem direto do nativebase, e pega tudo o que vem dela
  return (
    <NativeBaseInput
      bg="gray.700"
      h={14} // height
      px={4} // padding
      borderWidth={0}
      fontSize="md"
      color="white"
      fontFamily="body"
      mb={4} // marginbotton
      placeholderTextColor="gray.300"
      _focus={{
        bg: 'gray.700',
        borderWidth: 1,
        borderColor: 'green.500',
      }}
      {...rest} // para que todas as props do input sejam disponibilizadas no componente, como por exemplo o
      // placeholder, rest sempre é a ultima prop
    />
  )
}
