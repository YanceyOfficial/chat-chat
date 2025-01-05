import { MoonIcon } from '@heroicons/react/24/outline'
import { SunIcon } from '@heroicons/react/24/solid'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { Formik } from 'formik'
import { useAtom, useAtomValue } from 'jotai'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC } from 'react'
import HyperChatLogo from 'src/assets/images/logo.png'
import { SolidSettingsBrightnessIcon } from 'src/components/Icons'
import ImportAndExportDexie from 'src/components/ImportAndExportDexie'
import { useSettings, useTheme } from 'src/hooks'
import {
  customBotAvatarUrlAtom,
  settingsDialogVisibleAtom
} from 'src/stores/global'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings as SettingsParams } from 'src/types/settings'

const Settings: FC = () => {
  const [visible, setVisible] = useAtom(settingsDialogVisibleAtom)
  const customBotAvatarUrl = useAtomValue(customBotAvatarUrlAtom)
  const { settings, updateSettings } = useSettings()
  const { toggleTheme } = useTheme()

  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file && file.type.startsWith('image/') && settings) {
      const arrayBuffer = await file.arrayBuffer()
      const response = await window.electronAPI.saveFileToAppDataDir({
        arrayBuffer,
        filename: file.name
      })
      if (response.filename) {
        updateSettings({
          ...settings,
          assistantAvatarFilename: response.filename
        })
        enqueueSnackbar('Assistant avatar updated successfully.', {
          variant: 'success'
        })
      }
    }
  }

  if (!settings) return null

  return (
    <Dialog
      open={visible}
      onClose={() => setVisible(!visible)}
      maxWidth="md"
      fullWidth
    >
      <p className="px-6 py-4 text-xl font-bold dark:text-white">Settings</p>

      <Divider />

      <div className="no-scrollbar h-[calc(100vh_-_3.8125rem)] w-full overflow-y-scroll p-6">
        <Formik<SettingsParams>
          initialValues={settings}
          onSubmit={updateSettings}
        >
          {(formik) => (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="my-8"
            >
              <section className="flex flex-col gap-6">
                <header className="text-xl font-medium dark:text-white">
                  Account
                </header>

                <FormControl size="small">
                  <InputLabel id="company-select-label">Company</InputLabel>
                  <Select
                    className="w-80"
                    labelId="company-select-label"
                    id="company-select"
                    label="Company"
                    {...formik.getFieldProps('company')}
                  >
                    {Object.values(Companies).map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {formik.values.company === Companies.OpenAI && (
                  <>
                    <TextField
                      autoComplete="current-password"
                      required
                      id="openai-secret-key-input"
                      label="Secret Key"
                      size="small"
                      type="password"
                      helperText={
                        <span>
                          <strong>
                            Your secret key will only be stored in IndexedDB!
                          </strong>{' '}
                          Do not share it with others or expose it in any
                          client-side code.
                        </span>
                      }
                      className="w-160"
                      {...formik.getFieldProps('openaiSecretKey')}
                    />

                    <TextField
                      id="openai-organization-id-input"
                      label="Organization ID"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="For users who belong to multiple organizations, you can pass a header to specify which organization is used for an API request. Usage from these API requests will count against the specified organization's subscription quota."
                      {...formik.getFieldProps('openaiOrganizationId')}
                    />

                    <TextField
                      id="openai-author-name-input"
                      label="Name"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="The name of the author of this message. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters."
                      {...formik.getFieldProps('openaiAuthorName')}
                    />

                    <Button
                      variant="contained"
                      sx={{ width: 120 }}
                      onClick={() => updateSettings(formik.values)}
                    >
                      Save
                    </Button>
                  </>
                )}

                {formik.values.company === Companies.Anthropic && (
                  <>
                    <TextField
                      autoComplete="current-password"
                      required
                      id="anthropic-secret-key-input"
                      label="Secret Key"
                      size="small"
                      type="password"
                      helperText={
                        <span>
                          <strong>
                            Your secret key will only be stored in IndexedDB!
                          </strong>{' '}
                          Do not share it with others or expose it in any
                          client-side code.
                        </span>
                      }
                      className="w-160"
                      {...formik.getFieldProps('anthropicSecretKey')}
                    />

                    <Button
                      variant="contained"
                      sx={{ width: 120 }}
                      onClick={() => updateSettings(formik.values)}
                    >
                      Save
                    </Button>
                  </>
                )}

                {formik.values.company === Companies.Google && (
                  <>
                    <TextField
                      autoComplete="current-password"
                      required
                      id="google-secret-key-input"
                      label="Secret Key"
                      size="small"
                      type="password"
                      helperText={
                        <span>
                          <strong>
                            Your secret key will only be stored in IndexedDB!
                          </strong>{' '}
                          Do not share it with others or expose it in any
                          client-side code.
                        </span>
                      }
                      className="w-160"
                      {...formik.getFieldProps('googleSecretKey')}
                    />

                    <Button
                      variant="contained"
                      sx={{ width: 120 }}
                      onClick={() => updateSettings(formik.values)}
                    >
                      Save
                    </Button>
                  </>
                )}
              </section>
            </Box>
          )}
        </Formik>

        <Divider />

        <Formik<SettingsParams>
          initialValues={settings}
          onSubmit={updateSettings}
        >
          {(formik) => (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="my-8"
            >
              <section className="flex flex-col gap-6">
                <header className="text-xl font-medium dark:text-white">
                  Customization
                </header>

                <section>
                  <Typography variant="body1" className="dark:text-white">
                    Theme Mode
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="Theme Mode"
                    sx={{
                      marginTop: 1,
                      '& .Mui-selected': {
                        borderColor: '#615ef0'
                      },
                      '& .Mui-selected.MuiToggleButtonGroup-grouped': {
                        borderLeftColor: '#615ef0'
                      }
                    }}
                    value={formik.values.themeMode}
                    onChange={(_, newVal) => {
                      formik.setFieldValue('themeMode', newVal)
                      toggleTheme(newVal)
                    }}
                  >
                    <ToggleButton disableRipple value={ThemeMode.light}>
                      <SunIcon className="mr-2 h-6 w-6" /> Light
                    </ToggleButton>
                    <ToggleButton disableRipple value={ThemeMode.system}>
                      <SolidSettingsBrightnessIcon className="mr-2 h-6 w-6" />{' '}
                      System
                    </ToggleButton>
                    <ToggleButton disableRipple value={ThemeMode.dark}>
                      <MoonIcon className="mr-2 h-6 w-6" /> Dark
                    </ToggleButton>
                  </ToggleButtonGroup>
                </section>

                <section>
                  <Typography variant="body1" className="dark:text-white">
                    Assistant Avatar
                  </Typography>
                  <FormHelperText>
                    Upload your own assistant avatar for a better experience.
                    The avatar will be shown in chat box.
                  </FormHelperText>

                  <section className="mt-2 flex items-center">
                    <label className="cursor-pointer">
                      <Avatar
                        alt="assistant avatar"
                        src={
                          customBotAvatarUrl
                            ? customBotAvatarUrl
                            : HyperChatLogo
                        }
                        sx={{ width: 128, height: 128 }}
                      />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleUploadChange}
                      />
                    </label>
                  </section>
                </section>
              </section>
            </Box>
          )}
        </Formik>
        <Divider />
        <Box component="div" className="my-8">
          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium dark:text-white">
              Data Import and Export
            </header>
            <ImportAndExportDexie />
          </section>
        </Box>
      </div>
    </Dialog>
  )
}

export default Settings
