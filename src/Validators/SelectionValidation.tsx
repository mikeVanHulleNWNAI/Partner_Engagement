import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IIdName } from '../Types';
import { useEffect, useState } from 'react';

interface SelectionValidationProps {
    label: string;
    value: IIdName;
    options: IIdName[]
    fullWidth?: boolean;
    disabled?: boolean;
    onChange?: (idNameType: IIdName) => void;
}

const SelectionValidation: React.FC<SelectionValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    disabled,
    onChange
}) => {

    const [selectedValue, setSelectedValue] = useState<IIdName>(value);

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
                disabled={disabled}
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
