import {Tag} from "antd";
import styled from "@emotion/styled";
const {CheckableTag} = Tag;
export const StyledTag = styled(CheckableTag)`
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #000;
  padding: 4px 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  ${({ theme }) => `
    &&&:hover {
      background-color: ${theme.token.colorPrimary};
      color: ${theme.token.colorTextLightSolid};
      transform: translateY(-2px);
      box-shadow: 0 3px 6px ${theme.token.colorPrimaryShadow || "rgba(0,0,0,0.15)"};
    }

    &&&:active {
      transform: translateY(0px);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }

    &&&:focus-visible {
      outline: 2px solid ${theme.token.colorPrimary};
      outline-offset: 3px;
    }
    &&&.ant-tag-checkable-checked {
      background-color: ${theme.token.colorPrimary};
      color: ${theme.token.colorTextLightSolid};
      transform: translateY(-2px);
      box-shadow: 0 3px 6px ${theme.token.colorPrimaryShadow || "rgba(0,0,0,0.15)"};                              
    }
  `}
`;