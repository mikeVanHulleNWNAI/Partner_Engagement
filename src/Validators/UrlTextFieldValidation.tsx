import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

interface UrlTextFieldValidationProps {
    label: string;
    urlValue: string;
    canBeEmpty?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onValid?: (valid: boolean) => void;
    fullWidth?: boolean;
}

const UrlTextFieldValidation: React.FC<UrlTextFieldValidationProps> = ({
    label,
    urlValue,
    canBeEmpty,
    onChange,
    onValid,
    fullWidth
}) => {
    const [error, setError] = useState('');

    useEffect(() => {
        checkUrl(urlValue);
    }, [urlValue]);

    const validateUrl = (value: string) => {
        if (canBeEmpty) {
            if (value && !isValidUrl(value))
                return 'Invalid URL format';
        } else {
            if (!value)
                return 'URL is required';
            if (!isValidUrl(value)) {
                return 'Invalid URL format';
            }
        }
        return '';
    };

    function checkUrl(newValue: string) {
        // If the user has already touched the field, show real-time feedback
        const errorMessage = validateUrl(newValue);
        setError(errorMessage);
        if (onValid)
            onValid(errorMessage === "");
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        checkUrl(e.target.value);
        // proprogate the change up to the parent
        if (onChange)
            onChange(e);
    };

    return (
        <TextField
            label={label}
            error={!!error}
            helperText={error}
            type="text"
            value={urlValue}
            onChange={handleChange}
            fullWidth={fullWidth}
        />
    );
}

export default UrlTextFieldValidation;
