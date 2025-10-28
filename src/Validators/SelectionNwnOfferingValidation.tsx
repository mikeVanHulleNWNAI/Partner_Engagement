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
    console.log("Entering SelectionNwnOfferingValidate with " + selectedValue.id + ", " + selectedValue.name);

    useEffect(() => {
        setSelectedValue(value);
    }, [value])

    const getDisplayValue = (item: IIdNameAndManager) => {
        // Add null check for manager
        return item.manager ? `${item.name} - ${item.manager.name}` : item.name;
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selected = options.find(
            opt => opt.id === event.target.value // Use ID instead of display value
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
                value={selectedValue.id || ''} // Use ID as value with fallback
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem
                        value={option.id} // Use ID as value
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