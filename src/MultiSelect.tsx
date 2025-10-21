import { useEffect, useState } from 'react';
import { Box, Paper, Chip, Typography, MenuItem, ClickAwayListener } from '@mui/material';
import { Check, ChevronDown } from 'lucide-react';

type Props = {
  options: string[],
  selectedOptions: string[],
  onChange: (data: string[]) => void
}

const MultiSelect = ({options, selectedOptions, onChange} : Props) => {
    const [selected, setSelected] = useState(selectedOptions);
    const [prevSelected, setPrevSelected] = useState(selectedOptions);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // determine if prevSelected is not equal to selected
        let notEqual = false;
        if (prevSelected.length !== selected.length) 
            notEqual = true;
        else {
            for(let i = 0; i < prevSelected.length; i++) {
                if (prevSelected[i] !== selected[i]) {
                    notEqual = true;
                    break;
                }
            }
        }

        // if the arrays are not equal, then do the onChange callback
        if (notEqual) {
            // copy the array
            setPrevSelected(selected);
            // indicate that a change was made
            onChange(selected);
        }
    }, [onChange, selected, prevSelected])

    const toggleOption = (option: string) => {
        setSelected(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const removeOption = (option: string) => {
        setSelected(prev => prev.filter(item => item !== option));
    };

    const handleClickAway = () => {
        setIsOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }}>
                {/* Main select box */}
                <Box
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        backgroundColor: 'background.paper',
                        border: 1,
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        cursor: 'pointer',
                        minHeight: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'border-color 0.2s',
                        '&:hover': {
                            borderColor: 'grey.400',
                        },
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1, 
                            flex: 1 
                        }}
                    >
                        {selected.length === 0 ? (
                            <Typography sx={{ color: 'text.disabled' }}>
                                Select protocols...
                            </Typography>
                        ) : (
                            selected.map(item => (
                                <Chip
                                    key={item}
                                    label={item}
                                    size="small"
                                    onDelete={(e) => {
                                        e.stopPropagation();
                                        removeOption(item);
                                    }}
                                    sx={{
                                        backgroundColor: 'primary.light',
                                        color: 'primary.dark',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'primary.dark',
                                            '&:hover': {
                                                color: 'primary.main',
                                            },
                                        },
                                    }}
                                />
                            ))
                        )}
                    </Box>
                    <ChevronDown
                        style={{
                            width: 20,
                            height: 20,
                            color: '#9ca3af',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                        }}
                    />
                </Box>

                {/* Dropdown */}
                {isOpen && (
                    <Paper
                        sx={{
                            position: 'absolute',
                            zIndex: 10,
                            width: '100%',
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: 3,
                            maxHeight: 300,
                            overflowY: 'auto',
                        }}
                    >
                        {options.map(option => (
                            <MenuItem
                                key={option}
                                onClick={() => toggleOption(option)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 2,
                                    py: 1,
                                }}
                            >
                                <Typography sx={{ color: 'text.primary' }}>
                                    {option}
                                </Typography>
                                {selected.includes(option) && (
                                    <Check style={{ width: 20, height: 20, color: '#2563eb' }} />
                                )}
                            </MenuItem>
                        ))}
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}

export default MultiSelect;