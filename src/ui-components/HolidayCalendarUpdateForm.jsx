/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getHolidayCalendar } from "../graphql/queries";
import { updateHolidayCalendar } from "../graphql/mutations";
const client = generateClient();
export default function HolidayCalendarUpdateForm(props) {
  const {
    id: idProp,
    holidayCalendar: holidayCalendarModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    holidayDate: "",
    name: "",
  };
  const [holidayDate, setHolidayDate] = React.useState(
    initialValues.holidayDate
  );
  const [name, setName] = React.useState(initialValues.name);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = holidayCalendarRecord
      ? { ...initialValues, ...holidayCalendarRecord }
      : initialValues;
    setHolidayDate(cleanValues.holidayDate);
    setName(cleanValues.name);
    setErrors({});
  };
  const [holidayCalendarRecord, setHolidayCalendarRecord] = React.useState(
    holidayCalendarModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getHolidayCalendar.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getHolidayCalendar
        : holidayCalendarModelProp;
      setHolidayCalendarRecord(record);
    };
    queryData();
  }, [idProp, holidayCalendarModelProp]);
  React.useEffect(resetStateValues, [holidayCalendarRecord]);
  const validations = {
    holidayDate: [{ type: "Required" }],
    name: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          holidayDate,
          name,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateHolidayCalendar.replaceAll("__typename", ""),
            variables: {
              input: {
                id: holidayCalendarRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "HolidayCalendarUpdateForm")}
      {...rest}
    >
      <TextField
        label="Holiday date"
        isRequired={true}
        isReadOnly={false}
        value={holidayDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              holidayDate: value,
              name,
            };
            const result = onChange(modelFields);
            value = result?.holidayDate ?? value;
          }
          if (errors.holidayDate?.hasError) {
            runValidationTasks("holidayDate", value);
          }
          setHolidayDate(value);
        }}
        onBlur={() => runValidationTasks("holidayDate", holidayDate)}
        errorMessage={errors.holidayDate?.errorMessage}
        hasError={errors.holidayDate?.hasError}
        {...getOverrideProps(overrides, "holidayDate")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              holidayDate,
              name: value,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || holidayCalendarModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || holidayCalendarModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
