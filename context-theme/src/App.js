import React from "react";

import { withTheme } from "./Theme";

const styles = (theme) => ({
  title: {
    color: theme.COLORS.PRIMARY,
    size: theme.SIZES.FONT,
  },
  section: {
    background: theme.COLORS.BACKGROUND,
  },
});

const App = ({ styles }) => (
  <section style={styles.section}>
    <h1 style={styles.title}>Hello World!</h1>
  </section>
);

export default withTheme(App, styles);
