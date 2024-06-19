import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  FormInstance,
  Upload,
  UploadFile,
  UploadProps,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { normFile } from "../../../Utils/normFile";

type Props = {
  form: FormInstance;
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
};

const { useToken } = theme;

const extractFilename = (url: string) => {
  const splitted = url.split("/");
  return splitted[splitted.length - 1];
};

const BulkImageUploadAntd = ({ form, setImagesToDelete }: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const max = 9;

  const imagelistRef = Form.useWatch("bg_images", form);

  useEffect(() => {
    if (imagelistRef) {
      setFileList(imagelistRef);
    }
  }, [imagelistRef]);

  const { token } = useToken();

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setImagesToDelete((prev) => [...prev, extractFilename(file.url || "")]);
    },
    beforeUpload: () => {
      return false;
    },
    fileList: fileList,
    listType: "picture-card",
    onChange: handleChange,
    multiple: true,
    maxCount: max,
  };

  return (
    <Form.Item
      style={{ marginBottom: 0 }}
      name={"bg_images"}
      getValueFromEvent={normFile}
    >
      <Upload {...props}>
        {max > fileList.length ? (
          <button style={{ border: 0, background: "none" }} type="button">
            <UploadOutlined
              style={{
                color: token.colorPrimary,
                fontSize: 18,
              }}
            />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        ) : null}
      </Upload>
    </Form.Item>
    // <div className=" tw-grid tw-grid-cols-3 tw-gap-2">

    //   {/* {Array.from(Array(max)).map((_, i) => {
    //     const namePath = `bg_image_${i + 1}`;
    //     return (
    //       <div
    //         key={`bg_image_${i + 1}`}
    //         className={`${
    //           filteredImagefList.length + 1 > i ? "tw-block" : "tw-hidden"
    //         }`}
    //       >
    //         <Form.Item
    //           style={{ marginBottom: 0 }}
    //           name={namePath}
    //           // label={`Image ${i + 1}`}
    //           getValueFromEvent={normFile}
    //         >
    //           <UploadAntd
    //             form={form}
    //             name={namePath}
    //             imageURL={imageRefList[i]}
    //           />
    //         </Form.Item>
    //       </div>
    //     );
    //   })} */}
    // </div>
  );
};

export default BulkImageUploadAntd;
