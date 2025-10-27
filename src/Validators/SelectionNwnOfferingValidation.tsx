import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IIdNameAndManager } from '../Types';
import { useEffect, useState } from 'react';

interface SelectionNwnOfferingValidationProps {
    label: string;
    value: IIdNameAndManager;
    options: IIdNameAndManager[]
    fullWidth?: boolean;
    onChange: (idNameType: IIdNameAndManager) => void;
}

const SelectionNwnOfferingValidation: React.FC<SelectionNwnOfferingValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    onChange
}) => {

    const [selectedValue, setSelectedValue] = useState<IIdNameAndManager>(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value])

    const getDisplayValue = (item: IIdNameAndManager) => {
        return `${item.name} - ${item.manager.name}`;
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selected = options.find(
            opt => getDisplayValue(opt) === event.target.value
        );
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
                value={getDisplayValue(selectedValue)}
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem
                        value={getDisplayValue(option)}
                        key={option.id}
                    >
                        {getDisplayValue(option)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionNwnOfferingValidation;
