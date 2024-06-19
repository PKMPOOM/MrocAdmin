import { Button, Result } from "antd";
import { Link } from "react-router-dom";

type Props = {
  errorTitle: string;
  errorDescription?: string;
  retryFn?: () => void;
};

const ErrorFallback = ({
  retryFn,
  errorTitle: errorTitle,
  errorDescription: errorMessage,
}: Props) => {
  const defaultErrorMessage =
    "We apologize for the inconvenience, but an error occurred while attempting to load the requested data.";

  return (
    <div className="tw-w-full  tw-justify-center tw-h-full tw-flex  ">
      <Result
        status="error"
        title={errorTitle}
        subTitle={errorMessage ?? defaultErrorMessage}
        extra={
          <>
            <Link to={"/"}>
              <Button type="primary" key="console">
                Back to Dashboard
              </Button>
            </Link>

            {retryFn && (
              <Button onClick={() => retryFn()} key="retry">
                Retry
              </Button>
            )}
          </>
        }
      ></Result>
    </div>
  );
};

export default ErrorFallback;
