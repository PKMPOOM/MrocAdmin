import { RetweetOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, FormInstance, Upload, UploadProps, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { cn } from "~/src/lib/utils";
const { useToken } = theme;
const { Dragger } = Upload;

interface ImageInput {
  imageData?: any;
}

type ImageInputProps = {
  value?: ImageInput;
  onChange?: (value: ImageInput) => void;
  form: FormInstance<any>;
  name: string;
  imageURL?: string;
  disabled?: boolean;
  customUploadProps?: UploadProps;
} & React.ComponentProps<"div">;

export const UploadAntd = ({
  value = {},
  onChange,
  form,
  name,
  imageURL,
  disabled,
  customUploadProps,
  className,
  ...restProps
}: ImageInputProps) => {
  const { accessToken } = useAuth();
  const { token } = useToken();

  const [ImageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const formItemName = name.toLowerCase().replaceAll(" ", "_");

  useEffect(() => {
    if (imageURL) {
      setImageUrl(imageURL);
    }
  }, [imageURL]);

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    customRequest(options) {
      setImageUrl(URL.createObjectURL(options.file as File));
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    showUploadList: false,
  };

  const overrideProps = useMemo(
    () => Object.assign({}, props, customUploadProps),
    [customUploadProps, props]
  );

  const resetUploadField = () => {
    form.setFieldsValue({
      [formItemName]: undefined,
    });
    setImageUrl(undefined);
  };

  return (
    <div {...restProps} className={cn(className, "tw-w-full")}>
      <Dragger
        disabled={disabled}
        {...overrideProps}
        style={{
          position: "relative",
        }}
        onChange={(changedValue) => {
          // where tf is this coming from?
          onChange?.({
            ...value,
            ...changedValue,
          });
        }}
      >
        <div className="tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-h-24  ">
          {ImageUrl ? (
            <img
              style={{
                position: "absolute",
                objectFit: "cover",
                height: "100%",
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
              }}
              src={ImageUrl}
            />
          ) : (
            <div>
              <UploadOutlined
                style={{ color: token.colorPrimary, fontSize: 24 }}
              />
              <p
                style={{
                  color: token.colorText,
                  fontSize: 12,
                }}
              >
                Upload
              </p>
            </div>
          )}
        </div>
      </Dragger>
      <Button
        style={{ position: "absolute", bottom: 8, right: 8 }}
        onClick={resetUploadField}
        icon={<RetweetOutlined />}
      />
    </div>
  );
};
