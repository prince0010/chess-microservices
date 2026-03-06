import { CHANGE_PASSWORD } from "./mutations"
import { useMutation } from "@apollo/client/react"

export const useChangePassword = () =>
  useMutation<Document & any>(CHANGE_PASSWORD)
