import React, { CSSProperties } from "react";
import BootstrapButton from "react-bootstrap/Button";

type Kind =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "light"
  | "dark"
  | "link";

type ButtonType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | "link"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-dark"
  | "outline-light";

export interface ButtonProps {
  /**
   * Button variant.
   *
   * @default "primary"
   */
  kind?: Kind;

  /**
   * For a lighter touch, Buttons also come in outline-* variants with no
   * background color.
   *
   * @default false
   */
  outlined?: boolean;

  /**
   * Spans the full width of the Button parent.
   *
   * @default false
   */
  block?: boolean;

  /**
   * Disables the Button, preventing mouse events.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Specifies a large or small button.
   *
   * @default undefined
   */
  size?: "small" | "large";

  /**
   * Handles the on click event for a button
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  /**
   * The children to render
   *
   * @default undefined
   */
  label?: string;
}

/**
 * Primary UI component for user interaction
 */

export const Button = (props: ButtonProps) => {
  const { kind, outlined, block, disabled, size, label } = props;

  // Outlined
  let variant = kind as string;
  if (outlined) {
    variant = `outline-${kind}`;
  }

  // Size
  function getButtonSize(size: string | undefined): "sm" | "lg" | undefined {
    if (size === "small") {
      return "sm";
    }
    if (size === "large") {
      return "lg";
    }
    return undefined;
  }

  return (
    <BootstrapButton
      variant={variant as ButtonType}
      block={block}
      disabled={disabled}
      size={getButtonSize(size)}
    >
      {label}
    </BootstrapButton>
  );
};
