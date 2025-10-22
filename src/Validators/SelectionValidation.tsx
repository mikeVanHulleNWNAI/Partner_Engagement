import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface SelectionValidationProps {
    label: string;
    value: string;
    options: { id: string; name: string }[]
    fullWidth?: boolean;
    onChange: (event: SelectChangeEvent<string>) => void;
}

const SelectionValidation: React.FC<SelectionValidationProps> = ({
    label,
    value,
    options,
    fullWidth,
    onChange
}) => {

    return (
        <FormControl variant="standard">
            <InputLabel>{label}</InputLabel>
            <Select
                type="text"
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.name}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectionValidation;
