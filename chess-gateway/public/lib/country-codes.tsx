// @/components/ui/phone-input.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

const countryCodes = [
    { code: "+93", iso: "AF" },
    { code: "+355", iso: "AL" },
    { code: "+213", iso: "DZ" },
    { code: "+1-684", iso: "AS" },
    { code: "+376", iso: "AD" },
    { code: "+244", iso: "AO" },
    { code: "+1-264", iso: "AI" },
    { code: "+672", iso: "AQ" },
    { code: "+1-268", iso: "AG" },
    { code: "+54", iso: "AR" },
    { code: "+374", iso: "AM" },
    { code: "+297", iso: "AW" },
    { code: "+61", iso: "AU" },
    { code: "+43", iso: "AT" },
    { code: "+994", iso: "AZ" },
    { code: "+1-242", iso: "BS" },
    { code: "+973", iso: "BH" },
    { code: "+880", iso: "BD" },
    { code: "+1-246", iso: "BB" },
    { code: "+375", iso: "BY" },
    { code: "+32", iso: "BE" },
    { code: "+501", iso: "BZ" },
    { code: "+229", iso: "BJ" },
    { code: "+1-441", iso: "BM" },
    { code: "+975", iso: "BT" },
    { code: "+591", iso: "BO" },
    { code: "+387", iso: "BA" },
    { code: "+267", iso: "BW" },
    { code: "+55", iso: "BR" },
    { code: "+246", iso: "IO" },
    { code: "+1-284", iso: "VG" },
    { code: "+673", iso: "BN" },
    { code: "+359", iso: "BG" },
    { code: "+226", iso: "BF" },
    { code: "+257", iso: "BI" },
    { code: "+855", iso: "KH" },
    { code: "+237", iso: "CM" },
    { code: "+1", iso: "CA" },
    { code: "+238", iso: "CV" },
    { code: "+1-345", iso: "KY" },
    { code: "+236", iso: "CF" },
    { code: "+235", iso: "TD" },
    { code: "+56", iso: "CL" },
    { code: "+86", iso: "CN" },
    { code: "+61", iso: "CX" },
    { code: "+61", iso: "CC" },
    { code: "+57", iso: "CO" },
    { code: "+269", iso: "KM" },
    { code: "+682", iso: "CK" },
    { code: "+506", iso: "CR" },
    { code: "+385", iso: "HR" },
    { code: "+53", iso: "CU" },
    { code: "+599", iso: "CW" },
    { code: "+357", iso: "CY" },
    { code: "+420", iso: "CZ" },
    { code: "+243", iso: "CD" },
    { code: "+45", iso: "DK" },
    { code: "+253", iso: "DJ" },
    { code: "+1-767", iso: "DM" },
    { code: "+1-809", iso: "DO" },
    { code: "+670", iso: "TL" },
    { code: "+593", iso: "EC" },
    { code: "+20", iso: "EG" },
    { code: "+503", iso: "SV" },
    { code: "+240", iso: "GQ" },
    { code: "+291", iso: "ER" },
    { code: "+372", iso: "EE" },
    { code: "+251", iso: "ET" },
    { code: "+500", iso: "FK" },
    { code: "+298", iso: "FO" },
    { code: "+679", iso: "FJ" },
    { code: "+358", iso: "FI" },
    { code: "+33", iso: "FR" },
    { code: "+689", iso: "PF" },
    { code: "+241", iso: "GA" },
    { code: "+220", iso: "GM" },
    { code: "+995", iso: "GE" },
    { code: "+49", iso: "DE" },
    { code: "+233", iso: "GH" },
    { code: "+350", iso: "GI" },
    { code: "+30", iso: "GR" },
    { code: "+299", iso: "GL" },
    { code: "+1-473", iso: "GD" },
    { code: "+1-671", iso: "GU" },
    { code: "+502", iso: "GT" },
    { code: "+44-1481", iso: "GG" },
    { code: "+224", iso: "GN" },
    { code: "+245", iso: "GW" },
    { code: "+592", iso: "GY" },
    { code: "+509", iso: "HT" },
    { code: "+504", iso: "HN" },
    { code: "+852", iso: "HK" },
    { code: "+36", iso: "HU" },
    { code: "+354", iso: "IS" },
    { code: "+91", iso: "IN" },
    { code: "+62", iso: "ID" },
    { code: "+98", iso: "IR" },
    { code: "+964", iso: "IQ" },
    { code: "+353", iso: "IE" },
    { code: "+44-1624", iso: "IM" },
    { code: "+972", iso: "IL" },
    { code: "+39", iso: "IT" },
    { code: "+225", iso: "CI" },
    { code: "+1-876", iso: "JM" },
    { code: "+81", iso: "JP" },
    { code: "+44-1534", iso: "JE" },
    { code: "+962", iso: "JO" },
    { code: "+7", iso: "KZ" },
    { code: "+254", iso: "KE" },
    { code: "+686", iso: "KI" },
    { code: "+383", iso: "XK" },
    { code: "+965", iso: "KW" },
    { code: "+996", iso: "KG" },
    { code: "+856", iso: "LA" },
    { code: "+371", iso: "LV" },
    { code: "+961", iso: "LB" },
    { code: "+266", iso: "LS" },
    { code: "+231", iso: "LR" },
    { code: "+218", iso: "LY" },
    { code: "+423", iso: "LI" },
    { code: "+370", iso: "LT" },
    { code: "+352", iso: "LU" },
    { code: "+853", iso: "MO" },
    { code: "+389", iso: "MK" },
    { code: "+261", iso: "MG" },
    { code: "+265", iso: "MW" },
    { code: "+60", iso: "MY" },
    { code: "+960", iso: "MV" },
    { code: "+223", iso: "ML" },
    { code: "+356", iso: "MT" },
    { code: "+692", iso: "MH" },
    { code: "+222", iso: "MR" },
    { code: "+230", iso: "MU" },
    { code: "+262", iso: "YT" },
    { code: "+52", iso: "MX" },
    { code: "+691", iso: "FM" },
    { code: "+373", iso: "MD" },
    { code: "+377", iso: "MC" },
    { code: "+976", iso: "MN" },
    { code: "+382", iso: "ME" },
    { code: "+1-664", iso: "MS" },
    { code: "+212", iso: "MA" },
    { code: "+258", iso: "MZ" },
    { code: "+95", iso: "MM" },
    { code: "+264", iso: "NA" },
    { code: "+674", iso: "NR" },
    { code: "+977", iso: "NP" },
    { code: "+31", iso: "NL" },
    { code: "+599", iso: "AN" },
    { code: "+687", iso: "NC" },
    { code: "+64", iso: "NZ" },
    { code: "+505", iso: "NI" },
    { code: "+227", iso: "NE" },
    { code: "+234", iso: "NG" },
    { code: "+683", iso: "NU" },
    { code: "+850", iso: "KP" },
    { code: "+1-670", iso: "MP" },
    { code: "+47", iso: "NO" },
    { code: "+968", iso: "OM" },
    { code: "+92", iso: "PK" },
    { code: "+680", iso: "PW" },
    { code: "+970", iso: "PS" },
    { code: "+507", iso: "PA" },
    { code: "+675", iso: "PG" },
    { code: "+595", iso: "PY" },
    { code: "+51", iso: "PE" },
    { code: "+63", iso: "PH" },
    { code: "+64", iso: "PN" },
    { code: "+48", iso: "PL" },
    { code: "+351", iso: "PT" },
    { code: "+1-787", iso: "PR" },
    { code: "+974", iso: "QA" },
    { code: "+242", iso: "CG" },
    { code: "+262", iso: "RE" },
    { code: "+40", iso: "RO" },
    { code: "+7", iso: "RU" },
    { code: "+250", iso: "RW" },
    { code: "+590", iso: "BL" },
    { code: "+290", iso: "SH" },
    { code: "+1-869", iso: "KN" },
    { code: "+1-758", iso: "LC" },
    { code: "+590", iso: "MF" },
    { code: "+508", iso: "PM" },
    { code: "+1-784", iso: "VC" },
    { code: "+685", iso: "WS" },
    { code: "+378", iso: "SM" },
    { code: "+239", iso: "ST" },
    { code: "+966", iso: "SA" },
    { code: "+221", iso: "SN" },
    { code: "+381", iso: "RS" },
    { code: "+248", iso: "SC" },
    { code: "+232", iso: "SL" },
    { code: "+65", iso: "SG" },
    { code: "+1-721", iso: "SX" },
    { code: "+421", iso: "SK" },
    { code: "+386", iso: "SI" },
    { code: "+677", iso: "SB" },
    { code: "+252", iso: "SO" },
    { code: "+27", iso: "ZA" },
    { code: "+82", iso: "KR" },
    { code: "+211", iso: "SS" },
    { code: "+34", iso: "ES" },
    { code: "+94", iso: "LK" },
    { code: "+249", iso: "SD" },
    { code: "+597", iso: "SR" },
    { code: "+47", iso: "SJ" },
    { code: "+268", iso: "SZ" },
    { code: "+46", iso: "SE" },
    { code: "+41", iso: "CH" },
    { code: "+963", iso: "SY" },
    { code: "+886", iso: "TW" },
    { code: "+992", iso: "TJ" },
    { code: "+255", iso: "TZ" },
    { code: "+66", iso: "TH" },
    { code: "+228", iso: "TG" },
    { code: "+690", iso: "TK" },
    { code: "+676", iso: "TO" },
    { code: "+1-868", iso: "TT" },
    { code: "+216", iso: "TN" },
    { code: "+90", iso: "TR" },
    { code: "+993", iso: "TM" },
    { code: "+1-649", iso: "TC" },
    { code: "+688", iso: "TV" },
    { code: "+1-340", iso: "VI" },
    { code: "+256", iso: "UG" },
    { code: "+380", iso: "UA" },
    { code: "+971", iso: "AE" },
    { code: "+44", iso: "GB" },
    { code: "+1", iso: "US" },
    { code: "+598", iso: "UY" },
    { code: "+998", iso: "UZ" },
    { code: "+678", iso: "VU" },
    { code: "+379", iso: "VA" },
    { code: "+58", iso: "VE" },
    { code: "+84", iso: "VN" },
    { code: "+681", iso: "WF" },
    { code: "+212", iso: "EH" },
    { code: "+967", iso: "YE" },
    { code: "+260", iso: "ZM" },
    { code: "+263", iso: "ZW" }
];

// Create a Set to get unique country codes
const uniqueCountryCodes = Array.from(
    new Map(countryCodes.map(item => [item.code, item])).values()
);

interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    value = '',
    onChange,
    placeholder = "Phone number",
    disabled = false
}) => {
    const [selectedCode, setSelectedCode] = useState<string>('+63'); // Default to Philippines
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value) {
            // Try to extract country code and number
            const matchedCode = uniqueCountryCodes.find(code =>
                value.startsWith(code.code)
            );

            if (matchedCode) {
                setSelectedCode(matchedCode.code);
                setPhoneNumber(value.slice(matchedCode.code.length));
            } else {
                // Default to Philippines if no match
                setPhoneNumber(value);
            }
        }
    }, [value]);

    useEffect(() => {
        if (open && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
        if (!open) {
            setSearchTerm('');
        }
    }, [open]);

    const handleCodeChange = (code: string) => {
        setSelectedCode(code);
        setOpen(false);
        if (onChange) {
            onChange(`${code}${phoneNumber}`);
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers, spaces, and hyphens
        const number = e.target.value.replace(/[^\d\s-]/g, '');
        setPhoneNumber(number);
        if (onChange) {
            onChange(`${selectedCode}${number}`);
        }
    };

    // Filter country codes based on search term
    const filteredCountryCodes = uniqueCountryCodes.filter(({ code, iso }) => {
        const searchLower = searchTerm.toLowerCase();
        return code.toLowerCase().includes(searchLower) ||
            iso.toLowerCase().includes(searchLower);
    });

    return (
        <div className="flex gap-2">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setOpen(!open)}
                    className={`flex items-center justify-between w-[50px] px-2 py-[6.8px] text-sm border rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    disabled={disabled}
                >
                    <span className="font-mono">{selectedCode}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <div className="absolute z-50 mt-1 w-[280px] bg-white border rounded-md shadow-lg">
                            {/* Search input */}
                            <div className="p-2 border-b">
                                <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-white">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search code or ISO..."
                                        className="flex-1 outline-none text-sm bg-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchTerm('');
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[260px] overflow-y-auto">
                                {filteredCountryCodes.length > 0 ? (
                                    filteredCountryCodes.map(({ code, iso }) => (
                                        <button
                                            key={`${code}-${iso}`}
                                            type="button"
                                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${selectedCode === code ? 'bg-blue-50 text-blue-600' : ''
                                                }`}
                                            onClick={() => handleCodeChange(code)}
                                        >
                                            <span className="font-mono">{code}</span>
                                            <span className="text-xs text-gray-500">{iso}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        No matching codes found
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Input
                type="tel"
                value={phoneNumber}
                onChange={handleNumberChange}
                placeholder={placeholder}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={disabled}
            />
        </div>
    );
};