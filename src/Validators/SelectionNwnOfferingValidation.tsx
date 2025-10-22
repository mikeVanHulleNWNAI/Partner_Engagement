import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IdNameAndManagerIdNameType } from '../Types';
import { useEffect, useState } from 'react';

interface SelectionNwnOfferingValidationProps {
    label: string;
    value: IdNameAndManagerIdNameType;
    options: IdNameAndManagerIdNameType[]
    fullWidth?: boolean;
    onChange: (idNameType: IdNameAndManagerIdNameType) => void;
}

const SelectionNwnOfferingValidation: React.FC<SelectionNwnOfferingValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    onChange
}) => {

    const [selectedValue, setSelectedValue] = useState<IdNameAndManagerIdNameType>(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value])

    const getDisplayValue = (item: IdNameAndManagerIdNameType) => {
        return `${item.nwnOffering.name} - ${item.manager.name}`;
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
                        key={option.nwnOffering.id}
                    >
                        {getDisplayValue(option)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionNwnOfferingValidation;
