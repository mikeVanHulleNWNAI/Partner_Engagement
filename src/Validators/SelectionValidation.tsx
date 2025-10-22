import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { IdNameType } from '../Types';
import { useState } from 'react';

interface SelectionValidationProps {
    label: string;
    value: IdNameType;
    options: IdNameType[]
    fullWidth?: boolean;
    onChange: (idNameType: IdNameType) => void;
}

const SelectionValidation: React.FC<SelectionValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    onChange
}) => {

    const [selectedValue, setSelectedValue] = useState<IdNameType>(value);

    const handleClick = (idNameType: IdNameType) => {
        setSelectedValue(idNameType);
        onChange(idNameType);
    }

    return (
        <FormControl variant="standard">
            <InputLabel>{label}</InputLabel>
            <Select
                type="text"
                value={selectedValue.name}
                fullWidth={fullWidth}
            >
                {options.map((option) => (
                    <MenuItem
                        value={option.name}
                        onClick={() => handleClick(option)}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionValidation;
