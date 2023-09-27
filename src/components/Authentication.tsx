import { signOut, signIn } from "next-auth/react";
import { type SessionData } from "../types/next-auth";
import Button from "../ui/primitives/Button";

interface AuthProps extends SessionData {
  text: string;
  icon: string;
}

const Authentication: React.FC<AuthProps> = (props) => {
  const { sessionData } = props;

  return (
    <Button
      intent={sessionData ? "cancel" : "primary"}
      action={sessionData ? () => signOut() : () => signIn()}
      variant="rounded-full"
      icon={props.icon}
    >
      {!!props.text && props.text}
      {!props.text && (sessionData ? "Sign out" : "Sign in")}
    </Button>
  );
};

export default Authentication;
