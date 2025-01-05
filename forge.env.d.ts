/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  import { SFC, SVGProps } from 'react'

  export const ReactComponent: SFC<SVGProps<SVGSVGElement>>

  const src: string
  export default src
}

declare module '*.cur' {
  const src: string
  export default src
}
