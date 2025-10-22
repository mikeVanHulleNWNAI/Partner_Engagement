import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { IdNameAndManagerIdNameType } from '../Types';
import { useState } from 'react';

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

    const handleClick = (idNameAndManagerType: IdNameAndManagerIdNameType) => {
        setSelectedValue(idNameAndManagerType);
        onChange(idNameAndManagerType);
    }

    return (
        <FormControl variant="standard">
            <InputLabel>{label}</InputLabel>
            <Select
                type="text"
                value={selectedValue.nwnOffering.name + " - " + selectedValue.manager.name}
                fullWidth={fullWidth}
            >
                {options.map((option) => (
                    <MenuItem
                        value={option.nwnOffering.name + " - " + option.manager.name}
                        onClick={() => handleClick(option)}
                    >
                        {option.nwnOffering.name + " - " + option.manager.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionNwnOfferingValidation;
