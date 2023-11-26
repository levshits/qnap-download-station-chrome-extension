import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from "grommet/utils";

export const theme = deepMerge(hpe, {
    global: {
      font: {
        family: "Roboto",
        size: "14px",
        height: "20px",
      },
    },
  });