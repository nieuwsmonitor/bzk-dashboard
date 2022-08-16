import { Header, Icon, Popup } from "semantic-ui-react";

interface InfoHeaderProps {
  text: string;
  info: string;
}

export function InfoHeader({ text, info }: InfoHeaderProps) {
  return (
    <Header as="h2">
      {text}
      <Popup
        content={info}
        trigger={
          <Icon
            name="info circle"
            size="tiny"
            style={{ fontSize: "20px", cursor: "pointer", color: "#2a7189" }}
          ></Icon>
        }
        on="click"
      />
    </Header>
  );
}
