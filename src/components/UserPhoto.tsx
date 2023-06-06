import { Image, IImageProps } from 'native-base'

type Props = IImageProps & {
  size: number
}
// cria uma tipagem e adiciona ela as tipagens parões do componente de image

export function UserPhoto({ size, ...rest }: Props) {
  // passa para imagem todo o resto das props do componente image
  // e passa o tamanho e a altura como o size que pode ser colocado de forma dinamica
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={2}
      borderColor="gray.400"
      {...rest}
    />
  )
}
