import { useEffect, useState } from 'react';
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
        if (prevSelected.length != selected.length) 
            notEqual = true;
        else {
            for(let i = 0; i < prevSelected.length; i++) {
                if (prevSelected[i] != selected[i]) {
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

    return (
        <div className="relative">
            {/* Main select box */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 cursor-pointer hover:border-gray-400 transition-colors min-h-[42px] flex items-center justify-between"
            >
                <div className="flex flex-wrap gap-2 flex-1">
                    {selected.length === 0 ? (
                        <span className="text-gray-400">Select protocols...</span>
                    ) : (
                        selected.map(item => (
                            <span
                                key={item}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                            >
                                {item}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(item);
                                    }}
                                    className="hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {options.map(option => (
                        <div
                            key={option}
                            onClick={() => toggleOption(option)}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                            <span className="text-gray-700">{option}</span>
                            {selected.includes(option) && (
                                <Check className="w-5 h-5 text-blue-600" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelect;