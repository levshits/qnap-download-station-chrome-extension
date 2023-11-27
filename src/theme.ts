import { createTheme, mergeThemeOverrides, DEFAULT_THEME } from "@mantine/core";


export const theme = mergeThemeOverrides(DEFAULT_THEME, createTheme({
    defaultGradient: {
        from: 'orange',
        to: 'red',
        deg: 45,
      },
      primaryColor: 'lime',
      colors: {
        'lime': [
            "#f2fee6",
            "#e7f8d4",
            "#cdefab",
            "#b4e67e",
            "#9ede57",
            "#8fd940",
            "#87d731",
            "#73be23",
            "#65a91a",
            "#54920a"
          ],
      },
  }));