import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { Form, Formik } from 'formik'
import { useAtomValue } from 'jotai'
import { FC } from 'react'
import configurations from 'src/configurations'
import { useDB } from 'src/hooks'
import { configurationAtom } from 'src/stores/conversation'
import { companyAtom } from 'src/stores/global'
import { Configuration as IConfiguration } from 'src/types/conversation'
import Divider from '../Divider'
import InputSlider from '../InputSlider'

const Configuration: FC = () => {
  const company = useAtomValue(companyAtom)
  const configuration = useAtomValue(configurationAtom)
  const { updateOneById } = useDB('configurations')
  const availableModels = configurations[company]?.models

  const updateConfiguration = async (configuration: IConfiguration) => {
    await updateOneById(configuration.company, configuration)
  }

  return (
    <section className="w-87.75">
      <section className="flex h-22 items-center justify-between pl-6">
        <span className="text-xl font-bold dark:text-dark-text">
          Configuration
        </span>
      </section>

      <Divider />

      <Formik<IConfiguration>
        initialValues={configuration}
        enableReinitialize // Reset `initialValues` if it changed.
        onSubmit={(values) => updateConfiguration(values)}
      >
        {(formik) => {
          const maxOutput = availableModels?.find(
            (availableModel) => availableModel.modelName === formik.values.model
          )?.maxOutput

          return (
            <Form
              onSubmit={formik.handleSubmit}
              className="no-scrollbar h-[calc(100vh_-_7.5625rem)] overflow-y-scroll p-6"
            >
              <FormControl size="small" sx={{ marginBottom: 4 }} fullWidth>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  fullWidth
                  labelId="model-select-label"
                  id="model-select"
                  label="Model"
                  {...formik.getFieldProps('model')}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model.modelName} value={model.modelName}>
                      {model.modelName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                id="system-message"
                label="System Message"
                multiline
                rows={5}
                placeholder="Eg: You are an AI assistant that helps people find information."
                {...formik.getFieldProps('systemMessage')}
              />

              <InputSlider
                title="Max response"
                tooltipTitle={`Set a limit on the number of tokens per model response. The API supports a maximum of ${maxOutput} tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.`}
                min={1}
                max={maxOutput}
                step={1}
                defaultValue={maxOutput}
                setFieldValue={(value: number) =>
                  formik.setFieldValue('maxResponse', value)
                }
              />

              <InputSlider
                title="Temperature"
                tooltipTitle="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both."
                min={0}
                max={2}
                step={0.01}
                defaultValue={configuration.temperature}
                setFieldValue={(value: number) =>
                  formik.setFieldValue('temperature', value)
                }
              />

              <Tooltip
                title="Make responses stop at a desired point, such as the end of a sentence or list. Specify up to four sequences where the model will stop generating further tokens in a response. The returned text will not contain the stop sequence."
                placement="top"
              >
                <FormControl size="small" fullWidth>
                  <Autocomplete
                    multiple
                    id="stop"
                    options={[]}
                    value={formik.values.stop}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          key={index}
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Stop sequences"
                        placeholder="Enter sequence and press Tab"
                      />
                    )}
                    onChange={(_, value) => formik.setFieldValue('stop', value)}
                  />
                </FormControl>
              </Tooltip>

              <InputSlider
                title="Top P"
                tooltipTitle="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both."
                min={0}
                max={1}
                step={0.01}
                defaultValue={configuration.topP}
                setFieldValue={(value: number) =>
                  formik.setFieldValue('topP', value)
                }
              />
              <InputSlider
                title="Frequency penalty"
                tooltipTitle="Reduce the chance of repeating a token proportionally based on how often it has appeared in the text so far. This decreases the likelihood of repeating the exact same text in a response."
                min={-2}
                max={2}
                step={0.01}
                defaultValue={configuration.frequencyPenalty}
                setFieldValue={(value: number) =>
                  formik.setFieldValue('frequencyPenalty', value)
                }
              />
              <InputSlider
                title="Presence penalty"
                tooltipTitle="Reduce the chance of repeating any token that has appeared in the text at all so far. This increases the likelihood of introducing new topics in a response."
                min={0}
                max={2}
                step={0.01}
                defaultValue={configuration.presencePenalty}
                setFieldValue={(value: number) =>
                  formik.setFieldValue('presencePenalty', value)
                }
              />
              <Button variant="contained" fullWidth type="submit">
                Submit
              </Button>
            </Form>
          )
        }}
      </Formik>
    </section>
  )
}

export default Configuration
