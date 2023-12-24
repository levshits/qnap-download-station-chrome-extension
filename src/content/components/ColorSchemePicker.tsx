import {ActionIcon, useComputedColorScheme, useMantineColorScheme} from "@mantine/core";
import {i18n} from "webextension-polyfill";
import {IconMoon, IconSun} from "@tabler/icons-react";

export function ColorSchemePicker() {
    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });

    return (
        <ActionIcon
            onClick={() =>
                setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="xl"
            aria-label={i18n.getMessage("themeSwitchLabel")}
        >
            <IconSun
                stroke={1.5}
                display={computedColorScheme === "light" ? "none" : "block"}
            />
            <IconMoon
                stroke={1.5}
                display={computedColorScheme === "dark" ? "none" : "block"}
            />
        </ActionIcon>
    );
}