import { PasswordInput } from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';

interface ComponentProps {
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export function AuthenticationForm({ setAuthenticated }: ComponentProps) {
    const [password, setPassword] = useState('');

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    return (
        <PasswordInput
            label="Enter admin password"
            description="Get access to the admin portal"
            placeholder="Password"
            value={password}
            onChange={(event) => {
                setPassword(event.currentTarget.value);
                if (event.currentTarget.value === adminPassword) {
                    localStorage.setItem('authenticated', 'true');
                    setAuthenticated(true);
                }
            }}
        />
    );
}
