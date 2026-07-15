import React, { useEffect, useState, Fragment } from 'react'
import axios from 'axios'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { ChevronDown, Globe, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Listbox, Transition } from '@headlessui/react'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const API_BASE_URL = 'http://localhost:5000/api'

const countryNameMapping = {
    'United States': 'United States of America',
    'United Kingdom': 'United Kingdom',
    'India': 'India',
    'Canada': 'Canada',
    'Australia': 'Australia',
    'Germany': 'Germany',
    'Japan': 'Japan',
    'Brazil': 'Brazil',
    'France': 'France',
    'China': 'China'
};


const diseaseFilterOptions = [
    { value: 'all', label: 'All Diseases', color: '#08589E' },
    { value: 'COVID-19', label: 'COVID-19', color: '#ef4444' },
    { value: 'Dengue', label: 'Dengue', color: '#f59e0b' },
    { value: 'Malaria', label: 'Malaria', color: '#10b981' },
];

const timeFilterOptions = [
    { value: 'today', label: 'Today', icon: <Clock className="h-4 w-4" /> },
    { value: 'week', label: 'Last 7 Days', icon: <Clock className="h-4 w-4" /> },
    { value: 'month', label: 'Last 30 Days', icon: <Clock className="h-4 w-4" /> },
    { value: 'year', label: 'Last Year', icon: <Clock className="h-4 w-4" /> },
    { value: 'all', label: 'All Time', icon: <Clock className="h-4 w-4" /> }
];

const CustomDropdown = ({ value, onChange, options, icon, placeholder, isDisease = false }) => {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-left hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                    <div className="flex items-center">
                        {icon && React.cloneElement(icon, { className: 'h-4 w-4 text-gray-400' })}
                        <span className={`ml-3 text-sm font-medium truncate ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {value ? value.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
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
                                    `cursor-pointer select-none px-4 py-3 text-sm transition-colors ${
                                        active ? 'bg-emerald-50 text-gray-900' : 'text-gray-900'
                                    }`
                                }
                                value={option}
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {isDisease && option.color && (
                                                <div
                                                    className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                                    style={{ backgroundColor: option.color }}
                                                ></div>
                                            )}
                                            {!isDisease && option.icon && React.cloneElement(option.icon, { className: 'h-4 w-4 text-gray-500 mr-3' })}
                                            <span className={selected ? 'font-semibold' : 'font-normal'}>
                                                {option.label}
                                            </span>
                                        </div>
                                        {selected && <svg className="h-4 w-4 text-emerald-600 ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
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

const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="ml-3 text-lg font-medium text-gray-700">Loading Data...</span>
    </div>
);

const CustomTooltip = ({ content, x, y }) => {
    if (!content) return null;
    
    return (
        <div 
            className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 pointer-events-none transition-opacity duration-200"
            style={{ 
                left: x, 
                top: y,
                transform: 'translate(-50%, calc(-100% - 10px))'
            }}
        >
            <p className="text-sm font-medium whitespace-nowrap">{content}</p>
            <div className="absolute bottom-[-5px] left-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent" 
                 style={{ borderTop: '8px solid #1f2937', transform: 'translateX(-50%)' }}></div>
        </div>
    );
};

export default function CountryHeatmap() {
    const [data, setData] = useState([])
    const [maxCases, setMaxCases] = useState(0)
    const [disease, setDisease] = useState(diseaseFilterOptions[0])
    const [timeFilter, setTimeFilter] = useState(timeFilterOptions[2])
    const [isFetching, setIsFetching] = useState(true)
    const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 })

    useEffect(() => {
        fetchHeatmapData()
    }, [disease, timeFilter])

    const fetchHeatmapData = async () => {
        setIsFetching(true)
        try {
            const res = await axios.get(`${API_BASE_URL}/heatmap/country`, {
                params: { disease: disease.value, timeFilter: timeFilter.value }
            })
            setData(res.data)
            const max = Math.max(...res.data.map(d => d.totalCases || 0))
            setMaxCases(max)
        } catch (error) {
            console.error('Error fetching heatmap data:', error)
        } finally {
            setIsFetching(false)
        }
    }

    const getDiseaseColor = () => {
        return disease.color || '#08589E'
    }

    const colorScale = scaleLinear()
        .domain([0, maxCases])
        .range(['#E0F3F8', getDiseaseColor()])

    const handleMouseMove = (event) => {
        setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
    };

    const handleMouseEnter = (geo, countryData) => {
        const { name } = geo.properties;
        const content = countryData 
            ? `${name}: ${countryData.totalCases.toLocaleString()} cases`
            : `${name}: No data`;
        setTooltip(prev => ({ ...prev, content }));
    };

    const handleMouseLeave = () => {
        setTooltip({ content: '', x: 0, y: 0 });
    };

    const getMapCountryName = (dbCountryName) => {
        return countryNameMapping[dbCountryName] || dbCountryName;
    };

    return (
        <div className="min-h-screen bg-gray-50" onMouseMove={handleMouseMove}>
            <div className="p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Global Disease Heatmap</h1>
                    <p className="text-gray-600">
                        Analyzing the global distribution of <span className="font-semibold text-emerald-600">{disease.label}</span> cases over the <span className="font-semibold text-blue-600">{timeFilter.label}</span>.
                    </p>
                </div>

                <div className=" rounded-2xl p-6 relative  ">
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Filter Options</h3>
                        <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                            <div className="w-full sm:w-56">
                                <CustomDropdown
                                    value={disease}
                                    onChange={setDisease}
                                    options={diseaseFilterOptions}
                                    icon={<AlertCircle />}
                                    placeholder="Select Disease"
                                    isDisease={true}
                                />
                            </div>
                            <div className="w-full sm:w-56">
                                <CustomDropdown
                                    value={timeFilter}
                                    onChange={setTimeFilter}
                                    options={timeFilterOptions}
                                    icon={<Clock />}
                                    placeholder="Select Time Period"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 relative overflow-hidden  ">
                    {isFetching && <LoadingOverlay />}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Case Distribution Map</h3>
                            <p className="text-sm text-gray-500 mt-1">Visualizing current global case counts.</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                            <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    
                    <div className="w-full h-[600px] bg-gray-50 rounded-xl overflow-hidden relative border border-gray-200">
                        <ComposableMap projectionConfig={{ scale: 160 }}>
                            <Geographies geography={geoUrl} objectName="countries">
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const mapCountryName = geo.properties.name;
                                        const countryData = data.find(
                                            d => {
                                                const dbCountryName = d.Country;
                                                const mappedName = getMapCountryName(dbCountryName);
                                                return mappedName.toLowerCase() === mapCountryName.toLowerCase() ||
                                                    dbCountryName.toLowerCase() === mapCountryName.toLowerCase();
                                            }
                                        )
                                        const color = countryData ? colorScale(countryData.totalCases) : '#E5E7EB'
                                        
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo} 
                                                fill={color}
                                                stroke="#FFFFFF"
                                                strokeWidth={0.5}
                                                onMouseEnter={() => handleMouseEnter(geo, countryData)}
                                                onMouseLeave={handleMouseLeave}
                                                style={{
                                                    default: { outline: 'none' },
                                                    hover: { fill: '#374151', outline: 'none', cursor: 'pointer', transition: 'fill 0.2s' },
                                                    pressed: { outline: 'none' }
                                                }}
                                            />
                                        )
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                        <CustomTooltip content={tooltip.content} x={tooltip.x} y={tooltip.y} />
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center justify-between">
                        <div className="text-sm text-gray-700 font-medium">
                            <span className="text-gray-500">Color Intensity Legend</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2 border border-gray-300"></div>
                                <span className="text-xs text-gray-600">No Data</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm mr-2 border border-gray-300" style={{ backgroundColor: colorScale(maxCases * 0.1) }}></div>
                                <span className="text-xs text-gray-600">Low Cases</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm mr-2 border border-gray-300" style={{ backgroundColor: colorScale(maxCases * 0.5) }}></div>
                                <span className="text-xs text-gray-600">Moderate Cases</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-sm mr-2 border border-gray-300" style={{ backgroundColor: colorScale(maxCases) }}></div>
                                <span className="text-xs text-gray-600">High Cases</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}