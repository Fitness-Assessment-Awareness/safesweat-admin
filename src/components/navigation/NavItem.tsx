import { NavLink } from '@mantine/core';
import { Icon, IconChevronRight, IconProps } from '@tabler/icons-react';

type ComponentProps = {
    Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    label: string;
    active: boolean;
    onClick: VoidFunction;
};

export function NavItem({ Icon, label, active, onClick }: ComponentProps) {
    return (
        <NavLink
            active={active}
            label={label}
            rightSection={
                active && (
                    <IconChevronRight
                        size="1rem"
                        stroke={1.5}
                    />
                )
            }
            leftSection={
                <Icon
                    size="1rem"
                    stroke={1.5}
                />
            }
            color="grape"
            variant="subtle"
            onClick={onClick}
        />
    );
}
