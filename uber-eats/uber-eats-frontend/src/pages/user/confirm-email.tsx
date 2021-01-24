import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: useData, refetch } = useMe();
  const history = useHistory();

  const onCompleted = async ({ verifyEmail: { ok } }: verifyEmail) => {
    if (ok && useData?.me.id) {
      await refetch();
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    { onCompleted }
  );

  useEffect(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, code] = window.location.href.split("code=");
      verifyEmail({ variables: { input: { code } } });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
