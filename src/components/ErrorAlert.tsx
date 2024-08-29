import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AlertProps {
  alertTitle: string;
  alertDesc: string;
}

const ErrorAlert = ({ alertTitle, alertDesc }: AlertProps) => {
  return (
    <Alert variant={"destructive"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription>{alertDesc}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
