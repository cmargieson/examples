export interface Props {
 /**
   * The background color
   */
  color?: string;

  /**
   * The label
   */
  label?: string;
}

export const Button = (props: Props) => {
  const { color, label } = props;

  return <button style={{ backgroundColor: color }}>{label}</button>;
};
