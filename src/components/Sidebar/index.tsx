import { Cog6ToothIcon as Cog6ToothIconOutline } from '@heroicons/react/24/outline'
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import { useAtom, useAtomValue } from 'jotai'
import { FC } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'
import companies from 'src/shared/companies'
import { configurationAtom } from 'src/stores/conversation'
import {
  companyAtom,
  settingsAtom,
  settingsDialogVisibleAtom
} from 'src/stores/global'
import Avatar from '../Avatar'
import Divider from '../Divider'
import Loading from '../Loading'

const Sidebar: FC = () => {
  const [company, setCompany] = useAtom(companyAtom)
  const settings = useAtomValue(settingsAtom)
  const configuration = useAtomValue(configurationAtom)
  const [visible, setVisible] = useAtom(settingsDialogVisibleAtom)

  if (!settings || !configuration) return <Loading />

  return (
    <section className="no-scrollbar flex h-screen w-22 min-w-22 flex-col items-center justify-between overflow-y-scroll p-4 shadow-sidebar dark:shadow-dark-sidebar">
      <div className="flex flex-col items-center">
        <Avatar size="xs" src={HyperChatLogo} />
        <section className="mt-12 w-full">
          <div className="mb-6 flex flex-col items-center gap-6">
            {companies.map(({ name, logo: Logo }) => {
              const isCurrentCompany = name === company
              return (
                <div
                  key={name}
                  onClick={() => {
                    window.localStorage.setItem('$$hyperchat-company', name)
                    setCompany(name)
                  }}
                >
                  <Logo
                    className={`${!isCurrentCompany && 'grayscale'} h-6 w-6`}
                  />
                </div>
              )
            })}
          </div>
          <Divider />
          <div
            className="my-6 flex justify-center"
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <Cog6ToothIconSolid
                className={'h-6 w-6 cursor-pointer text-black dark:text-white'}
              />
            ) : (
              <Cog6ToothIconOutline
                className={'h-6 w-6 cursor-pointer text-black dark:text-white'}
              />
            )}
          </div>
        </section>
      </div>
    </section>
  )
}

export default Sidebar
