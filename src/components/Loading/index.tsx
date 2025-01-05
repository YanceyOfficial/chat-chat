import Backdrop from '@mui/material/Backdrop'
import Typography from '@mui/material/Typography'
import { FC } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'

const Loading: FC = () => {
  return (
    <Backdrop
      className="fixed z-10 flex-col"
      sx={{ background: 'rgba(0, 0, 0, .9)' }}
      open
    >
      <img
        src={HyperChatLogo}
        alt=""
        className="mb-4 h-32 w-32 animate-bounce"
      />
      <Typography
        variant="h3"
        className="brand animate-wiggle text-6xl text-white"
      >
        Hyper Chat
      </Typography>
    </Backdrop>
  )
}

export default Loading
