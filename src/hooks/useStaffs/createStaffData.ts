import { API } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { createStaff } from "../../graphql/mutations";
import { CreateStaffInput, CreateStaffMutation, Staff } from "../../API";

export default async function createStaffData(input: CreateStaffInput) {
  const response = (await API.graphql({
    query: createStaff,
    variables: { input },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  })) as GraphQLResult<CreateStaffMutation>;

  if (response.errors) {
    throw new Error(response.errors[0].message);
  }

  if (!response.data?.createStaff) {
    throw new Error("Failed to create staff");
  }

  const staff: Staff = response.data.createStaff;
  return staff;
}
