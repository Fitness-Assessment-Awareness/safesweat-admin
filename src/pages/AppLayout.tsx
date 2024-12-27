import { AppShell, Box, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconRun, IconStretching } from '@tabler/icons-react';
import { useState } from 'react';
import { AuthenticationForm } from '../components/authentication/AuthenticationForm';
import { EducationalResourceWrapper } from '../components/education/EducationalResourceWrapper';
import { NavItem } from '../components/navigation/NavItem';
import { WorkoutPlanWrapper } from '../components/workout/WorkoutPlanWrapper';

export function AppLayout() {
    const [opened, { toggle }] = useDisclosure();
    const [active, setActive] = useState(0);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated') === 'true');

    const navItems = [
        {
            Icon: IconStretching,
            label: 'Workout Plan',
        },
        {
            Icon: IconBook,
            label: 'Educational Resources',
        },
    ];

    if (!authenticated) {
        return (
            <Box
                w={'40%'}
                mt={'xl'}
                mx={'auto'}
            >
                <AuthenticationForm setAuthenticated={setAuthenticated} />
            </Box>
        );
    }

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group
                    h="100%"
                    px="md"
                >
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                        style={{ outline: 'none' }}
                    />
                    <>
                        <IconRun size={24} />
                        <h5>Safesweat Admin Portal</h5>
                    </>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                {navItems.map((item, index) => (
                    <NavItem
                        key={index}
                        {...item}
                        active={index === active}
                        onClick={() => setActive(index)}
                    />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>
                {active === 0 && <WorkoutPlanWrapper />}
                {active === 1 && <EducationalResourceWrapper />}
            </AppShell.Main>
        </AppShell>
    );
}
