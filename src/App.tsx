import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import './App.css';
import { AppLayout } from './pages/AppLayout';

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <ModalsProvider>
                <AppLayout />
            </ModalsProvider>
        </MantineProvider>
    );
}

// eslint-disable-next-line import/no-default-export
export default App;
