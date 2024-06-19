import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Pagination,
  Radio,
  Typography,
} from "antd";
import React, { useState } from "react";
import {
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Title } = Typography;

type LinksType = {
  pkLink: number;
  name: string;
  code: string;
  createDate: Date;
  registeredUser: number;
  fkReferralLink: number;
  url: string;
};

const separatorChoices = [
  {
    label: "New Line Windows",
    value: "Windows",
  },
  {
    label: "New Line OSX",
    value: "OSX",
  },
  {
    label: "Comma",
    value: "Comma",
  },
  {
    label: "Semicolon",
    value: "Semicolon",
  },
  {
    label: "Pipe",
    value: "Pipe",
  },
];
const Invite_User_current_Community = React.memo(() => {
  const [NewLinkModalOpen, setNewLinkModalOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [SearchKey, setSearchKey] = useState("");

  const { data: linksList } = useQuery<LinksType[]>({
    queryKey: ["referal link", Page, SearchKey],
    queryFn: async ({ queryKey }) => {
      const page = queryKey[1] as number; // Extract the page from the queryKey
      const baseURL = "https://6444ca2cb80f57f581ab3707.mockapi.io";
      const endpoint = "/test2";
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      params.append("search", SearchKey);
      const url = `${baseURL}${endpoint}?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="tw-flex tw-gap-4 tw-h-[calc(100vh-400px)]">
      <div className="tw-w-2/4 tw-flex tw-flex-col tw-gap-2 tw-items-start">
        <Title level={5}>Link invitation</Title>
        <div className="tw-flex tw-gap-2 tw-w-full">
          <Input.Search
            onChange={(e) => {
              if (e.target.value === "") {
                setSearchKey("");
              }
            }}
            onSearch={(e) => {
              setSearchKey(e);
            }}
            placeholder="Search"
            allowClear
          />
          <Button
            ghost
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setNewLinkModalOpen(true);
            }}
          >
            New link
          </Button>
        </div>
        <div className="tw-flex tw-flex-col tw-w-full tw-my-4">
          {linksList &&
            linksList.map((items) => (
              <div
                key={items.code}
                className="tw-flex tw-flex-col tw-gap-1 tw-w-full"
              >
                <p>{items.name}</p>
                <div className="tw-flex tw-gap-2 ">
                  <Input value={items.url} />
                  <div className="tw-flex tw-gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(items.url);
                      }}
                      type="dashed"
                      icon={<CopyOutlined />}
                    />
                    <Button type="dashed" icon={<FacebookOutlined />} />
                    <Button type="dashed" icon={<TwitterOutlined />} />
                    <Button danger type="primary" icon={<DeleteOutlined />} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Pagination
          defaultCurrent={1}
          total={50} // should change to SELECT COUNTE from sql db
          pageSize={10}
          onChange={handlePageChange}
        />
      </div>
      <Divider type="vertical" style={{ height: "100%" }} />
      <div className="tw-w-2/4">
        <div className="tw-flex tw-flex-col tw-gap-2 tw-items-start">
          <Title level={5}>Email invitation</Title>
          <div className="tw-flex tw-w-full tw-bg-red-50">
            <Input.TextArea autoSize={{ minRows: 20, maxRows: 20 }} />
          </div>
          {/* stat */}
          <div className="tw-flex tw-gap-4 tw-mt-4">
            <div className="tw-flex tw-items-center tw-gap-2 ">
              <div className="tw-flex tw-gap-1 tw-items-center tw-rounded tw-transition-all tw-duration-150">
                <div className="tw-w-4 tw-h-4 tw-bg-black tw-rounded-full" />
                Success
              </div>
            </div>
            <div className="tw-flex tw-items-center tw-gap-2 ">
              <div className="tw-flex tw-gap-1 tw-items-center tw-rounded tw-transition-all tw-duration-150">
                <div className="tw-w-4 tw-h-4 tw-bg-red-500 tw-rounded-full" />
                Invalid email
              </div>
            </div>
            <div className="tw-flex tw-items-center tw-gap-1 ">
              <div className="tw-flex tw-gap-2 tw-items-center tw-p-1 tw-rounded tw-transition-all tw-duration-150">
                <div className="tw-w-4 tw-h-4 tw-bg-orange-400 tw-rounded-full" />
                Existing user
              </div>
            </div>
          </div>
          {/* stat end */}
          <div>
            <Radio.Group defaultValue={separatorChoices[0].value}>
              {separatorChoices.map((items) => (
                <Radio value={items.value}>{items.label}</Radio>
              ))}
            </Radio.Group>
          </div>
          <div className="tw-flex tw-gap-2 tw-items-start tw-my-4">
            <Checkbox />
            <p className="tw-text-xs tw-text-slate-800">
              By checking this box you are indicating that the contact
              information and/or other personal information contained in the
              uploaded records was obtained lawfully and with the appropriate
              consent of the individuals contained in the records, in accordance
              with any and all regulations applicable.
            </p>
          </div>
          <Button style={{ paddingInline: "50px" }} type="primary">
            Invite
          </Button>
        </div>
      </div>

      {/* =============== Modal =============== */}
      <Modal
        open={NewLinkModalOpen}
        okText="Create link"
        onCancel={() => {
          setNewLinkModalOpen(false);
        }}
      >
        <div className="tw-flex tw-flex-col tw-gap-2">
          <p>Link name</p>
          <Input placeholder="Link name" />
        </div>
      </Modal>
    </div>
  );
});

export default Invite_User_current_Community;
