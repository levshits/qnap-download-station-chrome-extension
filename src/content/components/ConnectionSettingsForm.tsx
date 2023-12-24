import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Group, Button, TextInput, Stack } from "@mantine/core";
import { IconSquareRoundedPlus, IconTrashX } from "@tabler/icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { QnapConnectionString } from "../../common/Models";
import {useEffect} from "react";
import {i18n} from "webextension-polyfill";

export type ConnectionSettingsFormProps = {
  model?: QnapConnectionString;
  onSubmit: (data: QnapConnectionString) => void | Promise<void>;
};

const schema = yup.object().shape({
  username: yup.string().required(i18n.getMessage('UsernameIsRequiredError')),
  password: yup.string().required(i18n.getMessage('PasswordIsRequiredError')),
  url: yup.string().url().required(i18n.getMessage('UrlIsRequiredError')),
  folders: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(i18n.getMessage('FolderNameIsRequiredError')),
        tempFolder: yup
          .string()
          .required(i18n.getMessage('TempFolderIsRequiredError')),
        moveFolder: yup
          .string()
          .required(i18n.getMessage('TargetFolderIsRequiredError')),
      })
    )
    .required(i18n.getMessage('FoldersIsRequiredError')),
});

export function ConnectionSettingsForm({
  model,
  onSubmit,
}: ConnectionSettingsFormProps) {
  const { handleSubmit,
      reset,
      control,
      formState: {isDirty}
  } = useForm<QnapConnectionString>({
    defaultValues: model,
    resolver: yupResolver(schema),
  });

  useEffect(()=> {
      reset(model);
  }, [model])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "folders",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
      <Stack gap="sm" p="md">
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              label="Download Station URL:"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              label="Username:"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              label="Password:"
              error={fieldState.error?.message}
              type="password"
              {...field}
            />
          )}
        />

        {fields.map((item, index) => (
          <Stack key={item.id} gap="sm">
            <Controller
              name={`folders.${index}.name`}
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label="Folder name:"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name={`folders.${index}.tempFolder`}
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label="Temp folder path:"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name={`folders.${index}.moveFolder`}
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label="Target folder path:"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            {fields?.length > 1 && (
              <Button
                onClick={() => remove(index)}
                variant="outline"
                leftSection={<IconTrashX />}
              >
                Remove Folder
              </Button>
            )}
          </Stack>
        ))}
        <Button
          onClick={() => append({ name: "", tempFolder: "", moveFolder: "" })}
          leftSection={<IconSquareRoundedPlus />}>
          Add Folder
        </Button>
        {!!isDirty && <Group p="md" grow>
          <Button type="submit" variant="filled" size="md">
            Update
          </Button>
          <Button type="reset" variant="outline" size="md">
            Cancel
          </Button>
        </Group>}
      </Stack>
    </form>
  );
}
