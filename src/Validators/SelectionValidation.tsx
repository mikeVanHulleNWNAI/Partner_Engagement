import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IIdName } from '../Types';
import { useEffect, useState } from 'react';

interface SelectionValidationProps {
    label: string;
    value: IIdName;
    options: IIdName[]
    fullWidth?: boolean;
    disabled?: boolean;
    checkEmpty?: boolean;
    onChange?: (idNameType: IIdName) => void;
    onValid?: (valid: boolean) => void;

}

const SelectionValidation: React.FC<SelectionValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    disabled,
    checkEmpty,
    onChange,
    onValid,
}) => {
    const [error, setError] = useState('');

    // Validate whenever value or checkEmpty changes
    useEffect(() => {
        const errorMessage = (checkEmpty && value.name === "") ? "Must select a value" : "";
        setError(errorMessage);
        if (onValid) {
            onValid(errorMessage === "");
        }
    }, [value.name, checkEmpty, onValid]); // Only depend on primitives and stable callbacks

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selected = options.find(opt => opt.name === event.target.value);
        if (selected) {
            // Validate immediately
            const errorMessage = (checkEmpty && selected.name === "") ? "Must select a value" : "";
            setError(errorMessage);

            if (onChange) {
                onChange(selected);
            }
            if (onValid) {
                onValid(errorMessage === "");
            }
        }
    };

    return (
        <FormControl variant="standard" fullWidth={fullWidth} error={!!error}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value.name}
                onChange={handleChange}
                disabled={disabled}
            >
                {options.map((option) => (
                    <MenuItem value={option.name} key={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default SelectionValidation;
