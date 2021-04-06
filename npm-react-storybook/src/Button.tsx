export interface Props {
  /**
   * The label to render
   */
  label?: string;
}

export const Button = (props: Props) => {
  const { label } = props;

  return <button style={{ backgroundColor: "pink" }}>{label}</button>;
};
