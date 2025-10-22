import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IdNameType } from '../Types';
import { useEffect, useState } from 'react';

interface SelectionValidationProps {
    label: string;
    value: IdNameType;
    options: IdNameType[]
    fullWidth?: boolean;
    onChange?: (idNameType: IdNameType) => void;
}

const SelectionValidation: React.FC<SelectionValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    onChange
}) => {

    const [selectedValue, setSelectedValue] = useState<IdNameType>(value);

    useEffect(() => {
       setSelectedValue(value);
    }, [value])

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selected = options.find(opt => opt.name === event.target.value);
        if (selected) {
            setSelectedValue(selected);
            if (onChange)
                onChange(selected);
        }
    }

    return (
        <FormControl variant="standard" fullWidth={fullWidth}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={selectedValue.name}
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem
                        value={option.name}
                        key={option.id}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionValidation;
