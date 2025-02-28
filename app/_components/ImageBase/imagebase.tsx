/* eslint-disable jsx-a11y/alt-text */
import { BASE_PREFIX_FOR_APP } from '@/constants'
import Image from 'next/image'

//const BASE_PREFIX_FOR_APP = '/DigitalUnity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageBase = ({ src, ...rest }: any) => {
  const finalProps = {
    src: `${BASE_PREFIX_FOR_APP}/${src}`,
    ...rest,
    // loader: ({ src, width, quality } {
    //         const urlQuery = `?url=/images${src}`
    //             return `/${BASE_PREFIX_FOR_APP}/images${urlQuery}&w=${width}&q=${quality ?? 75}`
    //         })
  }

  return <Image src={''} alt={''} {...finalProps} />
}
export default ImageBase
