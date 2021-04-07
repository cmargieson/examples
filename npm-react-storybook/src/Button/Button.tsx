import { FC } from "react";
import { Button as AntButton } from "antd";

export interface ButtonProps {
  /**
   * The background color to render
   */
  color?: string;

  /**
   * The label to render
   */
  label?: string;

  /**
   * Optional click handler
   */
   onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ color, label }) => (
  <AntButton style={{ backgroundColor: color }}>{label}</AntButton>
);
