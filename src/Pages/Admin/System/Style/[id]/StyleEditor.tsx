import { EyeOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  ColorPicker,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Select,
  Typography,
  UploadFile,
  theme,
} from "antd";
import type { Color } from "antd/es/color-picker";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ErrorFallback from "../../../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import BulkImageUploadAntd from "../../../../../Components/Global/Utils/BulkImageUploadAntd";
import { UploadAntd } from "../../../../../Components/Global/Utils/UploadAntd";
import ThemeCardContainer from "../../../../../Components/Style/ThemeCard";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { availableFontList, useTheme } from "../../../../../Store/useTheme";
import { normFile } from "../../../../../Utils/normFile";
import { createTheme, getStyleData, updateTheme } from "../api";

const { Title, Text } = Typography;
const { useToken } = theme;

type formSchema = {
  primary_color: string | Color;
  text_color: string | Color;
  container_color: string | Color;
  nav_type: string;
  login_background_type: string;
  daterange: any;
  // logo stuff
  main_logo: any;
  user_side_logo: any;
  favicon: any;
  // background image list
  bg_images: UploadFile<RcFile>[];
  // fonts
  font_style: string;
  font_size: number;
};

const StyleEditor = () => {
  const [setColorThemeToken] = useTheme((state) => [state.setColorThemeToken]);
  const { id } = useParams();
  const isCreateNew = id === "New";
  const {
    data: themeData,
    error,
    isLoading,
    mutate: refetch,
  } = getStyleData(id);

  const [form] = Form.useForm<formSchema>();
  const [Loading, setLoading] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const { notificationApi, Axios } = useAuth();
  const formData = new FormData();
  const { token } = useToken();

  useEffect(() => {
    if (themeData && !isCreateNew) {
      // set field from fetched data
      form.setFieldsValue({
        primary_color: themeData.colorPrimary,
        container_color: themeData.colorBgContainer,
        text_color: themeData.colorText,
        nav_type: themeData.userNavType,
        daterange: [themeData.start, themeData.end],
        login_background_type: themeData.loginTemplate,
        user_side_logo: themeData.userlogo,
        favicon: themeData.favicon,
        main_logo: themeData.logo,
        font_size: themeData.fontSize ?? 14,
        font_style: themeData.fontStyle ?? "Roboto",
        bg_images: themeData.loginBackgroundImage.map((url) => ({
          uid: uuidv4(),
          name: "image.name",
          status: "done",
          url: url,
          thumbUrl: url,
        })),

        // bg_images: testimage,
      });
    } else {
      // set default theme data
      form.setFieldsValue({
        primary_color: token.colorPrimary,
        container_color: token.colorBgContainer,
        text_color: token.colorText,
        nav_type: "hamburger",
        daterange: [],
        user_side_logo: undefined,
        login_background_type: "carousel",
        favicon: undefined,
        main_logo: undefined,
        font_size: 14,
        font_style: "Roboto",
      });
    }
  }, [themeData]);

  const mainLogoRef = Form.useWatch("main_logo", form);
  const userLogoRef = Form.useWatch("user_side_logo", form);
  const faviconRef = Form.useWatch("favicon", form);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Theme Data" retryFn={refetch} />
    );
  }

  const onPreview = () => {
    const colorPrimary = form.getFieldValue("primary_color");
    const colorText = form.getFieldValue("text_color");
    const colorBgContainer = form.getFieldValue("container_color");
    const fontFamily = form.getFieldValue("font_style");
    const fontSize = form.getFieldValue("font_size");

    setColorThemeToken({
      colorPrimary:
        typeof colorPrimary === "string"
          ? colorPrimary
          : colorPrimary.toHexString(),
      colorText:
        typeof colorText === "string" ? colorText : colorText.toHexString(),
      colorBgContainer:
        typeof colorBgContainer === "string"
          ? colorBgContainer
          : colorBgContainer.toHexString(),
      fontFamily: fontFamily,
      fontSize: fontSize,
    });
  };

  const onResetPreview = () => {
    if (themeData && !isCreateNew) {
      // set field from fetched data
      form.resetFields();
      setColorThemeToken({
        colorPrimary: themeData.colorPrimary,
        colorText: themeData.colorText,
        colorBgContainer: themeData.colorBgContainer,
        fontFamily: themeData.fontStyle,
        fontSize: themeData.fontSize,
      });
    }
  };

  const onFinish = async (values: formSchema) => {
    const { main_logo, user_side_logo, favicon, bg_images, ...postBody } = {
      ...values,
      primary_color:
        typeof values.primary_color === "string"
          ? values.primary_color
          : values.primary_color?.toHexString(),
      text_color:
        typeof values.text_color === "string"
          ? values.text_color
          : values.text_color?.toHexString(),
      container_color:
        typeof values.container_color === "string"
          ? values.container_color
          : values.container_color?.toHexString,
    };

    const imageList = Object.fromEntries(
      Object.entries({
        main_logo,
        user_side_logo,
        favicon,
      }).filter(
        ([_, value]) => value !== undefined && typeof value !== "string"
      )
    );

    const haveImageToUpload =
      Object.keys(imageList).length > 0 ||
      bg_images?.filter((i) => i.originFileObj).length > 0;

    // append formData
    Object.entries(imageList).forEach(([key, value]) => {
      formData.append(key, value[0].originFileObj);
    });
    if (bg_images?.length > 0) {
      bg_images.forEach((image, index) => {
        if (image.originFileObj) {
          formData.append(`bg_image_${index + 1}`, image.originFileObj);
        }
      });
    }
    if (imagesToDelete.length > 0) {
      formData.append(`image_to_delete`, imagesToDelete.join(","));
    }

    try {
      setLoading(true);
      if (isCreateNew) {
        const { themeID } = await createTheme(postBody);
        if (haveImageToUpload) {
          await Axios.post(`/style/${themeID}/upload_images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        notificationApi.success({
          message: "Success",
          description: "Theme created successfully",
        });
      } else {
        await updateTheme(id, postBody);
        if (haveImageToUpload) {
          await Axios.post(`/style/${id}/upload_images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }
      window.location.href = "/admin/system/style";
      setImagesToDelete([]);
      setLoading(false);
    } catch (error) {
      notificationApi.error({
        message: "Error ",
        description: "Error creating theme",
      });
      setLoading(false);
    }
  };

  return (
    <div className="  tw-max-w-[1500px] ">
      <Breadcrumb
        style={{
          marginBottom: "24px",
        }}
        items={[
          {
            title: (
              <Link to={"/admin/system/style"}>
                <div className=" tw-flex tw-gap-2 tw-items-center ">
                  <HomeOutlined />
                  <span>Style</span>
                </div>
              </Link>
            ),
          },
          {
            title: isCreateNew
              ? "Create New Style"
              : `Theme ID: ${themeData?.key}`,
          },
        ]}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          primary_color: themeData?.colorPrimary,
          container_color: themeData?.colorBgContainer,
          text_color: themeData?.colorText,
          nav_type: themeData?.userNavType,
          daterange: [themeData?.start, themeData?.end],
          login_background_type: themeData?.loginTemplate,
          user_side_logo: themeData?.userlogo,
          favicon: themeData?.favicon,
          main_logo: themeData?.logo,
          font_size: themeData?.fontSize ?? 14,
          font_style: themeData?.fontStyle ?? "Roboto",
          bg_images: themeData?.loginBackgroundImage.map((url) => ({
            uid: uuidv4(),
            name: "image.name",
            status: "done",
            url: url,
            thumbUrl: url,
          })),
        }}
      >
        <div className="tw-flex tw-flex-row tw-items-baseline tw-justify-between ">
          <div className="tw-flex tw-flex-row tw-items-baseline tw-gap-4 ">
            <Title level={3}>
              {isCreateNew ? "Create New Style" : `Theme ID: ${themeData?.key}`}
            </Title>
            {themeData?.default && (
              <Text type="secondary">(Current Theme)</Text>
            )}
          </div>
          <div className=" tw-flex tw-gap-2 tw-items-center">
            <div
              style={{
                border: `1px solid ${token.colorBorder}`,
                backgroundColor: token.colorBgBase,
              }}
              className=" tw-flex tw-p-2 tw-rounded-lg tw-ml-4 tw-gap-2"
            >
              <Button type="dashed" onClick={onResetPreview}>
                Reset
              </Button>
              <Button
                onClick={() => {
                  onPreview();
                }}
                icon={<EyeOutlined />}
              >
                Preview
              </Button>
            </div>

            <div
              style={{
                border: `1px solid ${token.colorPrimaryBorder}`,
                backgroundColor: token.colorPrimaryBg,
              }}
              className=" tw-flex tw-p-2 tw-rounded-lg "
            >
              <Button
                loading={Loading}
                htmlType="submit"
                type="primary"
                icon={isCreateNew ? <PlusOutlined /> : undefined}
              >
                {isCreateNew ? "Create New Style" : `Update Theme`}
              </Button>
            </div>
          </div>
        </div>

        <div className=" tw-grid tw-grid-cols-3 tw-gap-6">
          <div>
            <div className=" tw-grid tw-grid-cols-3 tw-gap-2">
              <Form.Item<formSchema>
                rules={[
                  {
                    required: true,
                    message: "Please upload user side logo",
                  },
                ]}
                name="user_side_logo"
                label="User side logo"
                getValueFromEvent={normFile}
              >
                <UploadAntd
                  form={form}
                  name={"user_side_logo"}
                  imageURL={userLogoRef}
                />
              </Form.Item>
              <Form.Item<formSchema>
                rules={[
                  {
                    required: true,
                    message: "Please upload main logo",
                  },
                ]}
                name="main_logo"
                label="Main logo"
                getValueFromEvent={normFile}
              >
                <UploadAntd
                  form={form}
                  name={"main_logo"}
                  imageURL={mainLogoRef}
                />
              </Form.Item>
              <Form.Item<formSchema>
                rules={[
                  {
                    required: true,
                    message: "Please upload favicon",
                  },
                ]}
                name="favicon"
                label="Favicon"
                getValueFromEvent={normFile}
              >
                <UploadAntd
                  form={form}
                  name={"favicon"}
                  imageURL={faviconRef}
                />
              </Form.Item>
            </div>
            <div className="  ">
              <div className=" tw-flex tw-items-baseline tw-gap-2">
                <Title level={4}>Background Images</Title>
                <p className=" tw-text-slate-400">(optional)</p>
              </div>
              <BulkImageUploadAntd
                form={form}
                setImagesToDelete={setImagesToDelete}
              />
            </div>
          </div>
          <div className="tw-flex tw-flex-col tw-grid-cols-3 tw-col-span-2 tw-gap-2  ">
            <div className=" ">
              <Form.Item<formSchema>
                style={{
                  width: "100%",
                }}
                name="daterange"
                label="Date range"
              >
                <DatePicker.RangePicker
                  style={{
                    width: "70%",
                  }}
                />
              </Form.Item>
            </div>
            <Divider
              style={{
                marginBottom: 8,
                marginTop: 8,
              }}
              orientation="left"
            >
              <Title level={5}>Colors</Title>
            </Divider>

            <div className=" tw-grid tw-grid-cols-2 tw-gap-2 ">
              <div className=" tw-flex tw-flex-col tw-gap-4">
                <ThemeCardContainer name="Main color">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="primary_color"
                  >
                    <ColorPicker showText format="hex" />
                  </Form.Item>
                </ThemeCardContainer>
                <ThemeCardContainer name="Text color">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="text_color"
                  >
                    <ColorPicker showText format="hex" />
                  </Form.Item>
                </ThemeCardContainer>
                <ThemeCardContainer name="Container color">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="container_color"
                  >
                    <ColorPicker showText format="hex" />
                  </Form.Item>
                </ThemeCardContainer>
              </div>
              <div className=" tw-flex tw-flex-col tw-gap-4">
                <ThemeCardContainer name="Navigation type">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="nav_type"
                  >
                    <Select
                      options={[
                        {
                          label: "Hamburger",
                          value: "hamburger",
                        },
                        {
                          label: "Default",
                          value: "default",
                        },
                      ]}
                    />
                  </Form.Item>
                </ThemeCardContainer>
                <ThemeCardContainer name="Login background typte">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="login_background_type"
                  >
                    <Select
                      options={[
                        {
                          label: "Carousel",
                          value: "carousel",
                        },
                        {
                          label: "Background",
                          value: "background",
                        },
                        {
                          label: "Banner",
                          value: "banner",
                        },
                      ]}
                    />
                  </Form.Item>
                </ThemeCardContainer>
              </div>
            </div>
            <Divider
              style={{
                marginBottom: 8,
                marginTop: 8,
              }}
              orientation="left"
            >
              <Title level={5}>Fonts</Title>
            </Divider>
            <div className="tw-grid tw-grid-cols-2 tw-gap-2 ">
              <div className=" tw-flex tw-flex-col tw-gap-4">
                <ThemeCardContainer name="Font style">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="font_style"
                  >
                    <Select>
                      {availableFontList.map((font) => (
                        <Select.Option key={font} value={font} label={font}>
                          <p
                            style={{
                              fontFamily: font,
                            }}
                          >
                            {font.replaceAll("Variable", "")}
                          </p>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </ThemeCardContainer>
              </div>
              <div className=" tw-flex tw-flex-col tw-gap-4">
                <ThemeCardContainer name="Font size">
                  <Form.Item<formSchema>
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}
                    name="font_size"
                  >
                    <InputNumber max={32} />
                  </Form.Item>
                </ThemeCardContainer>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default StyleEditor;
