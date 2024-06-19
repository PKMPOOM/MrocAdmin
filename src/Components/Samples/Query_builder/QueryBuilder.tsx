import { QueryBuilderAntD } from "@react-querybuilder/antd";
import { theme } from "antd";
import QueryBuilder, { RuleGroupType, formatQuery } from "react-querybuilder";
import { useQueryBuilderStore } from "./QueryBuilderStore";
import { CustomCascaderField, CustomValueEditor } from "./SubComp";
import "./querybuilder.style.css";
const { useToken } = theme;

// interface customFieled extends Field {}

type ICQueryBuilderProps = {
  state: {
    Query: RuleGroupType;
    setQuery: React.Dispatch<React.SetStateAction<RuleGroupType>>;
  };
};

const ICQueryBuilder = ({ state }: ICQueryBuilderProps) => {
  const { token } = useToken();
  const fullQueryOptions = useQueryBuilderStore(
    (state) => state.fullQueryOptions
  );

  const { Query, setQuery } = state;

  return (
    <div className=" tw-flex tw-flex-col tw-gap-3">
      <div
        style={{
          border: `1px solid ${token.colorPrimaryBorder}`,
        }}
        className="  tw-p-3 tw-rounded-md tw-flex tw-flex-col tw-gap-2"
      >
        <p className=" tw-font-semibold">Sample Query</p>
        <p className=" tw-bg-red-50/30 tw-text-red-700 tw-rounded-lg tw-p-1">
          SQL:
          {formatQuery(Query, "sql") === "(1 = 1)"
            ? "No Query Found!"
            : formatQuery(Query, "sql")}
        </p>
        <div className=" tw-bg-red-50/30 tw-text-red-700 tw-rounded-lg tw-p-1">
          JSON:
          <pre>{formatQuery(Query, "json")}</pre>
          {/* <pre>{JSON.stringify(formatQuery(Query, "json"), null, 2)}</pre> */}
        </div>
      </div>

      <QueryBuilderAntD>
        <QueryBuilder
          fields={fullQueryOptions}
          query={Query}
          controlElements={{
            // operatorSelector: (props) => OperatorByIncomingType(props),
            fieldSelector: CustomCascaderField,
            valueEditor: CustomValueEditor,
          }}
          onQueryChange={(e) => {
            setQuery(e);
          }}
        />
      </QueryBuilderAntD>
    </div>
  );
};

export default ICQueryBuilder;
