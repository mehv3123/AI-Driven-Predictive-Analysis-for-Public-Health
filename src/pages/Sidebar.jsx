import React, { Fragment } from 'react';
import { ChevronDown, MapPin, AlertCircle, Check, Clock, FileText, Phone } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

const ALL_OPTION = { value: 'all', label: 'All' };

const countries = [
    ALL_OPTION,
    { value: 'United States', label: 'United States' },
    { value: 'India', label: 'India' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Brazil', label: 'Brazil' }
];

const states = {
    all: [ALL_OPTION],
    'United States': [ALL_OPTION, { value: 'California', label: 'California' }, { value: 'Texas', label: 'Texas' }, { value: 'Florida', label: 'Florida' }, { value: 'New York', label: 'New York' }],
    'India': [ALL_OPTION, { value: 'Maharashtra', label: 'Maharashtra' }, { value: 'Gujarat', label: 'Gujarat' }, { value: 'Karnataka', label: 'Karnataka' }, { value: 'West Bengal', label: 'West Bengal' }],
    'United Kingdom': [ALL_OPTION, { value: 'England', label: 'England' }, { value: 'Scotland', label: 'Scotland' }, { value: 'Wales', label: 'Wales' }, { value: 'Northern Ireland', label: 'Northern Ireland' }],
    'Canada': [ALL_OPTION, { value: 'Ontario', label: 'Ontario' }, { value: 'British Columbia', label: 'British Columbia' }, { value: 'Quebec', label: 'Quebec' }, { value: 'Alberta', label: 'Alberta' }],
    'Australia': [ALL_OPTION, { value: 'New South Wales', label: 'New South Wales' }, { value: 'Victoria', label: 'Victoria' }, { value: 'Queensland', label: 'Queensland' }, { value: 'Western Australia', label: 'Western Australia' }],
    'Germany': [ALL_OPTION, { value: 'Bavaria', label: 'Bavaria' }, { value: 'Berlin', label: 'Berlin' }, { value: 'Hesse', label: 'Hesse' }, { value: 'Hamburg', label: 'Hamburg' }],
    'Japan': [ALL_OPTION, { value: 'Tokyo', label: 'Tokyo' }, { value: 'Osaka', label: 'Osaka' }, { value: 'Kanagawa', label: 'Kanagawa' }, { value: 'Aichi', label: 'Aichi' }],
    'Brazil': [ALL_OPTION, { value: 'São Paulo', label: 'São Paulo' }, { value: 'Rio de Janeiro', label: 'Rio de Janeiro' }, { value: 'Bahia', label: 'Bahia' }, { value: 'Paraná', label: 'Paraná' }]
};

const cities = {
    all: [ALL_OPTION],
    'California': [ALL_OPTION, { value: 'Los Angeles', label: 'Los Angeles' }, { value: 'San Francisco', label: 'San Francisco' }, { value: 'San Diego', label: 'San Diego' }, { value: 'Sacramento', label: 'Sacramento' }],
    'Texas': [ALL_OPTION, { value: 'Houston', label: 'Houston' }, { value: 'Dallas', label: 'Dallas' }, { value: 'Austin', label: 'Austin' }, { value: 'San Antonio', label: 'San Antonio' }],
    'Florida': [ALL_OPTION, { value: 'Miami', label: 'Miami' }, { value: 'Orlando', label: 'Orlando' }, { value: 'Tampa', label: 'Tampa' }, { value: 'Jacksonville', label: 'Jacksonville' }],
    'New York': [ALL_OPTION, { value: 'New York City', label: 'New York City' }, { value: 'Buffalo', label: 'Buffalo' }, { value: 'Rochester', label: 'Rochester' }, { value: 'Syracuse', label: 'Syracuse' }],
    'Maharashtra': [ALL_OPTION, { value: 'Mumbai', label: 'Mumbai' }, { value: 'Pune', label: 'Pune' }, { value: 'Nagpur', label: 'Nagpur' }, { value: 'Nashik', label: 'Nashik' }],
    'Gujarat': [ALL_OPTION, { value: 'Ahmedabad', label: 'Ahmedabad' }, { value: 'Surat', label: 'Surat' }, { value: 'Vadodara', label: 'Vadodara' }, { value: 'Rajkot', label: 'Rajkot' }],
    'Karnataka': [ALL_OPTION, { value: 'Bengaluru', label: 'Bengaluru' }, { value: 'Mysuru', label: 'Mysuru' }, { value: 'Mangaluru', label: 'Mangaluru' }, { value: 'Hubli', label: 'Hubli' }],
    'West Bengal': [ALL_OPTION, { value: 'Kolkata', label: 'Kolkata' }, { value: 'Howrah', label: 'Howrah' }, { value: 'Durgapur', label: 'Durgapur' }, { value: 'Siliguri', label: 'Siliguri' }],
    'England': [ALL_OPTION, { value: 'London', label: 'London' }, { value: 'Manchester', label: 'Manchester' }, { value: 'Birmingham', label: 'Birmingham' }, { value: 'Liverpool', label: 'Liverpool' }],
    'Scotland': [ALL_OPTION, { value: 'Edinburgh', label: 'Edinburgh' }, { value: 'Glasgow', label: 'Glasgow' }, { value: 'Aberdeen', label: 'Aberdeen' }, { value: 'Dundee', label: 'Dundee' }],
    'Wales': [ALL_OPTION, { value: 'Cardiff', label: 'Cardiff' }, { value: 'Swansea', label: 'Swansea' }, { value: 'Newport', label: 'Newport' }, { value: 'Wrexham', label: 'Wrexham' }],
    'Northern Ireland': [ALL_OPTION, { value: 'Belfast', label: 'Belfast' }, { value: 'Londonderry', label: 'Londonderry' }, { value: 'Lisburn', label: 'Lisburn' }, { value: 'Newry', label: 'Newry' }],
    'Ontario': [ALL_OPTION, { value: 'Toronto', label: 'Toronto' }, { value: 'Ottawa', label: 'Ottawa' }, { value: 'Hamilton', label: 'Hamilton' }, { value: 'London', label: 'London' }],
    'British Columbia': [ALL_OPTION, { value: 'Vancouver', label: 'Vancouver' }, { value: 'Victoria', label: 'Victoria' }, { value: 'Kelowna', label: 'Kelowna' }, { value: 'Surrey', label: 'Surrey' }],
    'Quebec': [ALL_OPTION, { value: 'Montreal', label: 'Montreal' }, { value: 'Quebec City', label: 'Quebec City' }, { value: 'Laval', label: 'Laval' }, { value: 'Gatineau', label: 'Gatineau' }],
    'Alberta': [ALL_OPTION, { value: 'Calgary', label: 'Calgary' }, { value: 'Edmonton', label: 'Edmonton' }, { value: 'Red Deer', label: 'Red Deer' }, { value: 'Lethbridge', label: 'Lethbridge' }],
    'New South Wales': [ALL_OPTION, { value: 'Sydney', label: 'Sydney' }, { value: 'Newcastle', label: 'Newcastle' }, { value: 'Wollongong', label: 'Wollongong' }],
    'Victoria': [ALL_OPTION, { value: 'Melbourne', label: 'Melbourne' }, { value: 'Geelong', label: 'Geelong' }, { value: 'Ballarat', label: 'Ballarat' }],
    'Queensland': [ALL_OPTION, { value: 'Brisbane', label: 'Brisbane' }, { value: 'Gold Coast', label: 'Gold Coast' }, { value: 'Cairns', label: 'Cairns' }],
    'Western Australia': [ALL_OPTION, { value: 'Perth', label: 'Perth' }, { value: 'Bunbury', label: 'Bunbury' }, { value: 'Geraldton', label: 'Geraldton' }],
    'Bavaria': [ALL_OPTION, { value: 'Munich', label: 'Munich' }, { value: 'Nuremberg', label: 'Nuremberg' }, { value: 'Augsburg', label: 'Augsburg' }],
    'Berlin': [ALL_OPTION, { value: 'Berlin', label: 'Berlin' }, { value: 'Spandau', label: 'Spandau' }],
    'Hesse': [ALL_OPTION, { value: 'Frankfurt', label: 'Frankfurt' }, { value: 'Wiesbaden', label: 'Wiesbaden' }, { value: 'Kassel', label: 'Kassel' }],
    'Hamburg': [ALL_OPTION, { value: 'Hamburg', label: 'Hamburg' }, { value: 'Harburg', label: 'Harburg' }],
    'Tokyo': [ALL_OPTION, { value: 'Tokyo', label: 'Tokyo' }, { value: 'Hachioji', label: 'Hachioji' }, { value: 'Machida', label: 'Machida' }],
    'Osaka': [ALL_OPTION, { value: 'Osaka', label: 'Osaka' }, { value: 'Sakai', label: 'Sakai' }, { value: 'Higashiosaka', label: 'Higashiosaka' }],
    'Kanagawa': [ALL_OPTION, { value: 'Yokohama', label: 'Yokohama' }, { value: 'Kawasaki', label: 'Kawasaki' }, { value: 'Fujisawa', label: 'Fujisawa' }],
    'Aichi': [ALL_OPTION, { value: 'Nagoya', label: 'Nagoya' }, { value: 'Toyota', label: 'Toyota' }, { value: 'Okazaki', label: 'Okazaki' }],
    'São Paulo': [ALL_OPTION, { value: 'São Paulo', label: 'São Paulo' }, { value: 'Campinas', label: 'Campinas' }, { value: 'Santos', label: 'Santos' }],
    'Rio de Janeiro': [ALL_OPTION, { value: 'Rio de Janeiro', label: 'Rio de Janeiro' }, { value: 'Niterói', label: 'Niterói' }, { value: 'Petropolis', label: 'Petropolis' }],
    'Bahia': [ALL_OPTION, { value: 'Salvador', label: 'Salvador' }, { value: 'Feira de Santana', label: 'Feira de Santana' }, { value: 'Vitória da Conquista', label: 'Vitória da Conquista' }],
    'Paraná': [ALL_OPTION, { value: 'Curitiba', label: 'Curitiba' }, { value: 'Londrina', label: 'Londrina' }, { value: 'Maringá', label: 'Maringá' }]
};

const timeFilterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last 365 Days' }
];

const diseaseFilterOptions = [
    ALL_OPTION,
    { value: 'COVID-19', label: 'COVID-19' },
    { value: 'Influenza', label: 'Influenza' },
    { value: 'Dengue', label: 'Dengue' },
    { value: 'Malaria', label: 'Malaria' }
];

const CustomDropdown = ({ value, onChange, options, icon, placeholder }) => {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-left hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer">
                    <div className="flex items-center">
                        {icon && React.cloneElement(icon, { className: 'h-4 w-4 text-gray-400' })}
                        <span className={`ml-3 text-sm font-medium ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {value ? value.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl max-h-60 overflow-auto focus:outline-none">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                className={({ active }) =>
                                    `cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? 'bg-emerald-50 text-gray-900' : 'text-gray-900'
                                    }`
                                }
                                value={option}
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between">
                                        <span className={selected ? 'font-semibold' : 'font-normal'}>
                                            {option.label}
                                        </span>
                                        {selected && <Check className="h-4 w-4 text-emerald-600" />}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

const Sidebar = ({ timeFilter, setTimeFilter, diseaseFilter, setDiseaseFilter, selectedCountry, handleCountryChange, selectedState, handleStateChange, selectedCity, setSelectedCity, isSidebarOpen, toggleSidebar }) => {

    const currentStates = states[selectedCountry.value] || [ALL_OPTION];
    const currentCities = cities[selectedState.value] || [ALL_OPTION];

    const handleFindHospitals = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    window.open(`https://www.google.com/maps/search/hospitals+near+${lat},${lng}`, '_blank');
                },
                () => {
                    window.open('https://www.google.com/maps/search/hospitals', '_blank');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            window.open('https://www.google.com/maps/search/hospitals', '_blank');
        }
    };

    const handleHealthGuidelines = () => {
        window.open('/health-guidelines', '_blank');
    };

    const handleEmergencyContacts = () => {
        window.open('/emergency-contacts', '_blank');
    };

    return (
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-white border-r border-gray-100 z-40 md:z-auto`}>
            <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button onClick={toggleSidebar} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Apply Filters</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                        Time Period
                    </label>
                    <CustomDropdown
                        value={timeFilter}
                        onChange={setTimeFilter}
                        options={timeFilterOptions}
                        placeholder="Select Time Period"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                        Location
                    </label>

                    <div className="space-y-3">
                        <CustomDropdown
                            value={selectedCountry}
                            onChange={handleCountryChange}
                            options={countries}
                            placeholder="Select Country"
                        />

                        <CustomDropdown
                            value={selectedState}
                            onChange={handleStateChange}
                            options={currentStates}
                            placeholder="Select State"
                        />

                        <CustomDropdown
                            value={selectedCity}
                            onChange={setSelectedCity}
                            options={currentCities}
                            placeholder="Select City"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-emerald-500" />
                        Disease Type
                    </label>
                    <CustomDropdown
                        value={diseaseFilter}
                        onChange={setDiseaseFilter}
                        options={diseaseFilterOptions}
                        placeholder="Select Disease"
                    />
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Links</h2>
                    <div className="space-y-2">
                        <button 
                            onClick={handleFindHospitals}
                            className="cursor-pointer flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <MapPin className="h-4 w-4 mr-3 text-blue-500" />
                            Find Hospitals
                        </button>
                        <button 
                            onClick={handleHealthGuidelines}
                            className="cursor-pointer flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <FileText className="h-4 w-4 mr-3 text-emerald-500" />
                            Health Guidelines
                        </button>
                        <button 
                            onClick={handleEmergencyContacts}
                            className="cursor-pointer flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Phone className="h-4 w-4 mr-3 text-red-500" />
                            Emergency Contacts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;