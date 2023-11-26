import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { QnapConnectionString } from "../../common/Models";
import { Box, Button, Form, FormField, TextInput } from "grommet";
import { Add, Trash } from "grommet-icons";

export type ConnectionSettingsFormProps = {
  model?: QnapConnectionString;
  onSubmit: (data: QnapConnectionString) => void | Promise<void>;
};

const schema = yup.object().shape({
  username: yup.string().required("Username is a required field"),
  password: yup.string().required("Password is a required field"),
  url: yup.string().url().required("Url is a required field"),
  folders: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Folder Name is a required field"),
        tempFolder: yup
          .string()
          .required("Temp Folder Path is a required field"),
        moveFolder: yup
          .string()
          .required("Target Folder Path is a required field"),
      })
    )
    .required("Folders is a required field"),
});

export function ConnectionSettingsForm({
  model,
  onSubmit,
}: ConnectionSettingsFormProps) {
  const { handleSubmit, reset, control } = useForm<QnapConnectionString>({
    defaultValues: model,
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "folders",
  });

  return (
    <Box pad="medium">
      <Form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Download Station URL:"
              htmlFor={field.name}
              name={field.name}
              error={fieldState.error?.message}
            >
              <TextInput required={true} {...field} />
            </FormField>
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Username:"
              htmlFor={field.name}
              name={field.name}
              error={fieldState.error?.message}
            >
              <TextInput required={true} {...field} />
            </FormField>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Password:"
              htmlFor={field.name}
              name={field.name}
              error={fieldState.error?.message}
            >
              <TextInput required={true} type="password" {...field} />
            </FormField>
          )}
        />
        <Button
          icon={<Add />}
          label="Add Folder"
          plain
          hoverIndicator
          onClick={() => append({ name: "", tempFolder: "", moveFolder: "" })}
        />
        {fields.map((item, index) => (
          <Box key={item.id}>
            <Controller
              name={`folders.${index}.name`}
              control={control}
              render={({ field, fieldState }) => (
                <FormField
                  label="Folder name:"
                  htmlFor={field.name}
                  name={field.name}
                  error={fieldState.error?.message}
                >
                  <TextInput required={true} {...field} />
                </FormField>
              )}
            />
            <Controller
              name={`folders.${index}.tempFolder`}
              control={control}
              render={({ field, fieldState }) => (
                <FormField
                  label="Temp folder path:"
                  htmlFor={field.name}
                  name={field.name}
                  error={fieldState.error?.message}
                >
                  <TextInput required={true} {...field} />
                </FormField>
              )}
            />
            <Controller
              name={`folders.${index}.moveFolder`}
              control={control}
              render={({ field, fieldState }) => (
                <FormField
                  label="Target folder path:"
                  htmlFor={field.name}
                  name={field.name}
                  error={fieldState.error?.message}
                >
                  <TextInput required={true} {...field} />
                </FormField>
              )}
            />
            {fields?.length > 1 && (
              <Button
                icon={<Trash />}
                label="Remove"
                plain
                hoverIndicator
                onClick={() => remove(index)}
              />
            )}
          </Box>
        ))}

        <Box direction="row" margin={{ top: "medium" }}>
          <Button type="submit" label="Update" primary />
          <Button type="reset" label="Cancel" />
        </Box>
      </Form>
    </Box>
  );
}
