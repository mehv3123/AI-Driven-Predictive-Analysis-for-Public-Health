import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, Check, TrendingUp, Users, Shield, Map, Zap, Clock, Loader2 } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';
import Sidebar from './sidebar'; 

const API_BASE_URL = 'http://localhost:5000/api';

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

const ALERT_COLORS = {
    'Critical': '#fca5a5',
    'High': '#fcd34d',
    'Medium': '#93c5fd',
    'Low': '#86efac',
};

const diseaseInfo = {
    'COVID-19': {
        precautionTitle: 'Primary Precautions',
        precautionList: [
            'Wear high-quality masks indoors, especially in crowded settings.',
            'Maintain physical distance of at least 6 feet from others.',
            'Ensure proper ventilation in indoor spaces.',
            'Stay up-to-date with your vaccination schedule and boosters.',
        ],
        precautionIcon: <Shield className="h-6 w-6 text-white" />,
        precautionColor: 'bg-yellow-500',
        precautionSource: { name: 'WHO Official Site', link: 'https://www.who.int/health-topics/coronavirus' },
        treatmentTitle: 'Recommended Action/Treatment',
        treatmentList: [
            'Isolate immediately upon testing positive or showing symptoms.',
            'Monitor symptoms (especially fever and oxygen saturation).',
            'Use over-the-counter medication (Acetaminophen) for mild fever.',
            'Seek urgent medical care if experiencing difficulty breathing or chest pain.',
        ],
        treatmentIcon: <Check className="h-6 w-6 text-white" />,
        treatmentColor: 'bg-cyan-500',
        treatmentSource: { name: 'CDC Guidelines', link: 'https://www.cdc.gov/coronavirus/2019-ncov/your-health/isolation.html' },
    },
    'Influenza': {
        precautionTitle: 'Primary Precautions',
        precautionList: [
            'Get the annual flu vaccine.',
            'Wash hands frequently, especially before eating and after being in public.',
            'Cover coughs/sneezes with a tissue or elbow.',
            'Avoid touching your eyes, nose, and mouth to prevent spread.',
        ],
        precautionIcon: <Shield className="h-6 w-6 text-white" />,
        precautionColor: 'bg-yellow-500',
        precautionSource: { name: 'Health.gov', link: 'https://www.health.gov/topics/disease-prevention/flu-vaccines' },
        treatmentTitle: 'Recommended Action/Treatment',
        treatmentList: [
            'Rest and limit contact with others to prevent spreading.',
            'Stay hydrated with plenty of fluids.',
            'Use fever reducers (like paracetamol).',
            'Antiviral drugs may be prescribed for high-risk patients (consult a doctor).',
        ],
        treatmentIcon: <Check className="h-6 w-6 text-white" />,
        treatmentColor: 'bg-cyan-500',
        treatmentSource: { name: 'CDC Flu Information', link: 'https://www.cdc.gov/flu/treatment/whatiflat.htm' },
    },
    'Dengue': {
        precautionTitle: 'Primary Precautions',
        precautionList: [
            'Prevent mosquito bites using EPA-registered repellents.',
            'Wear long-sleeved shirts and long pants.',
            'Eliminate standing water sources (flower pots, old tires) where mosquitoes breed.',
            'Install and maintain screens on windows and doors.',
        ],
        precautionIcon: <Shield className="h-6 w-6 text-white" />,
        precautionColor: 'bg-yellow-500',
        precautionSource: { name: 'Mosquito Control Website', link: 'https://www.epa.gov/mosquito-control' },
        treatmentTitle: 'Recommended Action/Treatment',
        treatmentList: [
            'Rest and stay hydrated (oral rehydration salts are helpful).',
            'Avoid NSAIDs (like Ibuprofen and Aspirin) due to bleeding risk.',
            'Use Acetaminophen (Paracetamol) for fever and pain relief.',
            'Monitor for warning signs: severe abdominal pain, persistent vomiting, or rapid breathing.',
        ],
        treatmentIcon: <Check className="h-6 w-6 text-white" />,
        treatmentColor: 'bg-cyan-500',
        treatmentSource: { name: 'WHO Dengue Fact Sheet', link: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue' },
    },
    'Malaria': {
        precautionTitle: 'Primary Precautions',
        precautionList: [
            'Take prescribed antimalarial prophylactic medications before, during, and after visiting endemic areas.',
            'Sleep under insecticide-treated mosquito nets.',
            'Wear clothing that minimizes skin exposure, especially from dusk till dawn.',
            'Use high-concentration insect repellent on exposed skin.',
        ],
        precautionIcon: <Shield className="h-6 w-6 text-white" />,
        precautionColor: 'bg-yellow-500',
        precautionSource: { name: 'Malaria Foundation', link: 'https://www.malariafoundation.org/prevention' },
        treatmentTitle: 'Recommended Action/Treatment',
        treatmentList: [
            'Seek immediate medical care for diagnosis and treatment (Malaria is an emergency).',
            'Treatment must be tailored to the specific type of malaria parasite and drug resistance in the area.',
            'Adhere strictly to the full course of prescribed antimalarial drugs.',
        ],
        treatmentIcon: <Check className="h-6 w-6 text-white" />,
        treatmentColor: 'bg-cyan-500',
        treatmentSource: { name: 'CDC Malaria Treatment', link: 'https://www.cdc.gov/malaria/diagnosis_treatment/treatment.html' },
    },
    'all': {
        precautionTitle: 'General Precautions',
        precautionList: [
            'Maintain general personal hygiene, including frequent handwashing.',
            'Follow all local government and public health directives.',
            'Practice safe, sensible social habits to limit disease transmission.',
            'Ensure a balanced diet and regular exercise to support immune function.',
        ],
        precautionIcon: <Shield className="h-6 w-6 text-white" />,
        precautionColor: 'bg-gray-400',
        precautionSource: { name: 'Public Health Agency', link: 'https://www.publichealth.gov/general-guidelines' },
        treatmentTitle: 'General Treatment Advice',
        treatmentList: [
            'Consult a licensed medical professional for any persistent, severe, or unexplained symptoms.',
            'Do not self-diagnose severe illnesses.',
            'Take prescribed medications exactly as directed by your doctor.',
        ],
        treatmentIcon: <Check className="h-6 w-6 text-white" />,
        treatmentColor: 'bg-gray-500',
        treatmentSource: { name: 'Medical Ethics Board', link: 'https://www.medicalethicsboard.org/patient-advice' },
    }
};

const formatLargeNumber = (value) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
};

const processDataForCards = (data) => {
    const totals = data.reduce((acc, row) => {
        acc.totalCases += row.NewCases;
        acc.recovered += row.Recovered;
        acc.deaths += row.Deaths;
        acc.activeCases += row.ActiveCases;
        return acc;
    }, { totalCases: 0, recovered: 0, deaths: 0, activeCases: 0 });

    return {
        ...totals,
        changeCases: null,
        changeRecovered: null,
        changeActive: null,
        changeDeaths: null,
        vaccinationRate: '78%'
    };
};

const processDataForTrend = (data) => {
    const dailyMap = data.reduce((acc, row) => {
        const date = row.Date;
        acc[date] = acc[date] || { date: date, cases: 0, recoveries: 0, active: 0 };
        acc[date].cases += row.NewCases;
        acc[date].recoveries += row.Recovered;
        acc[date].active += row.ActiveCases;
        return acc;
    }, {});

    return Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processDataForAlerts = (data) => {
    const alertCounts = data.reduce((acc, row) => {
        const level = row.AlertLevel;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const totalEntries = data.length;

    return Object.entries(ALERT_COLORS).map(([level, color]) => ({
        name: level,
        value: totalEntries > 0 ? (alertCounts[level] || 0) / totalEntries * 100 : 0,
        count: alertCounts[level] || 0,
        color: color
    })).filter(item => item.value > 0);
};

const processDataForRegions = (data, filters) => {
    let groupByField = 'Country';
    if (filters.selectedCountry.value !== 'all' && filters.selectedState.value === 'all') {
        groupByField = 'State';
    } else if (filters.selectedState.value !== 'all' && filters.selectedCity.value === 'all') {
        groupByField = 'City';
    } else {
        groupByField = 'Country';
    }

    const regionMap = data.reduce((acc, row) => {
        const key = row[groupByField];
        if (!key) return acc;

        acc[key] = acc[key] || { name: key, cases: 0, recovered: 0, active: 0 };
        acc[key].cases += row.NewCases;
        acc[key].recovered += row.Recovered;
        acc[key].active += row.ActiveCases;
        return acc;
    }, {});

    return Object.values(regionMap);
};

const StatusCard = ({ title, value, change, icon, color, description }) => {
    const changeValue = change ?? '';
    const isPositive = changeValue.startsWith('+');

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
                {change && typeof change === 'string' && (
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${!isPositive && 'rotate-180'}`} />
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
    );
};

const InfoCard = ({ title, list, icon, color, source }) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-4">{title}</h3>

            <ul className="text-sm text-gray-700 space-y-3 list-disc list-inside h-32 overflow-y-auto pr-2">
                {(list || []).map((item, index) => (
                    <li key={index} className="pl-1">
                        {item}
                    </li>
                ))}
            </ul>

            <div className="text-xs text-gray-500 mt-4 border-t pt-3">
                <span className="font-medium block mb-1">Information Source:</span>
                {source && (
                    <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
                    >
                        {source.name}
                    </a>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [timeFilter, setTimeFilter] = useState(timeFilterOptions[0]);
    const [diseaseFilter, setDiseaseFilter] = useState(diseaseFilterOptions[1]);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [selectedState, setSelectedState] = useState(ALL_OPTION);
    const [selectedCity, setSelectedCity] = useState(ALL_OPTION);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isFetching, setIsFetching] = useState(true);
    const [cardData, setCardData] = useState({});
    const [trendData, setTrendData] = useState([]);
    const [alertData, setAlertData] = useState([]);
    const [regionData, setRegionData] = useState([]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        console.log("Logged out. (Simulated redirect to login page)");
    };

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setSelectedState(ALL_OPTION);
        setSelectedCity(ALL_OPTION);
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
        setSelectedCity(ALL_OPTION);
    };

    const fetchData = useCallback(async () => {
        setIsFetching(true);

        const params = new URLSearchParams({
            country: selectedCountry?.value || 'all',
            state: selectedState?.value || 'all',
            city: selectedCity?.value || 'all',
            disease: diseaseFilter?.value || 'all',
            timeFilter: timeFilter?.value || 'today',
        });

        const url = `${API_BASE_URL}/health-data?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();

            const processedCardData = processDataForCards(rawData);
            const processedTrendData = processDataForTrend(rawData);
            const processedAlertData = processDataForAlerts(rawData);
            const processedRegionData = processDataForRegions(rawData, { selectedCountry, selectedState, selectedCity });

            setCardData(processedCardData);
            setTrendData(processedTrendData);
            setAlertData(processedAlertData);
            setRegionData(processedRegionData);

        } catch (error) {
            console.error("Failed to fetch or process health data:", error);
            setCardData({});
            setTrendData([]);
            setAlertData([]);
            setRegionData([]);
        } finally {
            setIsFetching(false);
        }
    }, [selectedCountry, selectedState, selectedCity, diseaseFilter, timeFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const locationLabel = selectedCity.value !== 'all' ? selectedCity.label
        : selectedState.value !== 'all' ? selectedState.label
            : selectedCountry.value !== 'all' ? selectedCountry.label
                : 'Global';

    const diseaseLabel = diseaseFilter.value !== 'all' ? diseaseFilter.label : 'All Diseases';

    const currentDiseaseInfo = diseaseInfo[diseaseFilter.value] || diseaseInfo['all'];

    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <span className="ml-3 text-lg font-medium text-gray-700">Loading Data...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex pt-4 sm:pt-0">
                <Sidebar
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
                    diseaseFilter={diseaseFilter}
                    setDiseaseFilter={setDiseaseFilter}
                    selectedCountry={selectedCountry}
                    handleCountryChange={handleCountryChange}
                    selectedState={selectedState}
                    handleStateChange={handleStateChange}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                <main className="flex-1 p-4 md:p-8 md:pl-4 min-w-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Health Monitoring Dashboard</h1>
                        <p className="text-gray-600">
                            Overview for <span className="font-semibold text-emerald-600">{diseaseLabel}</span> in <span className="font-semibold text-indigo-600">{locationLabel}</span> - <span className="font-semibold text-blue-600">{timeFilter.label}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 relative">
                        <StatusCard
                            title="Total New Cases"
                            value={cardData.totalCases ? cardData.totalCases.toLocaleString() : '0'}
                            change={cardData.changeCases}
                            icon={<Activity className="h-6 w-6 text-white" />}
                            color="bg-red-500"
                            description="New cases recorded in time frame"
                        />
                        <StatusCard
                            title="Active Cases"
                            value={cardData.activeCases ? cardData.activeCases.toLocaleString() : '0'}
                            change={cardData.changeActive}
                            icon={<Users className="h-6 w-6 text-white" />}
                            color="bg-orange-500"
                            description="Total currently active cases"
                        />
                        <StatusCard
                            title="Recovered"
                            value={cardData.recovered ? cardData.recovered.toLocaleString() : '0'}
                            change={cardData.changeRecovered}
                            icon={<Shield className="h-6 w-6 text-white" />}
                            color="bg-emerald-500"
                            description="Successful patient recovery"
                        />
                        <StatusCard
                            title="Total Deaths"
                            value={cardData.deaths ? cardData.deaths.toLocaleString() : '0'}
                            change={cardData.changeDeaths}
                            icon={<Zap className="h-6 w-6 text-white" />}
                            color="bg-gray-500"
                            description="Cumulative deaths recorded"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 relative">
                        <InfoCard
                            title={currentDiseaseInfo.precautionTitle}
                            list={currentDiseaseInfo.precautionList}
                            icon={currentDiseaseInfo.precautionIcon}
                            color={currentDiseaseInfo.precautionColor}
                            source={currentDiseaseInfo.precautionSource}
                        />
                        <InfoCard
                            title={currentDiseaseInfo.treatmentTitle}
                            list={currentDiseaseInfo.treatmentList}
                            icon={currentDiseaseInfo.treatmentIcon}
                            color={currentDiseaseInfo.treatmentColor}
                            source={currentDiseaseInfo.treatmentSource}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 relative">
                            {isFetching && <LoadingOverlay />}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Disease Trend</h3>
                                    <p className="text-sm text-gray-500 mt-1">Cases vs. Recoveries over time</p>
                                </div>
                                <div className="flex items-center px-3 py-1 bg-emerald-50 rounded-xl">
                                    <Clock className="h-4 w-4 text-emerald-600 mr-2" />
                                    <span className="text-xs font-semibold text-emerald-900">{timeFilter.label}</span>
                                </div>
                            </div>
                            <div className="h-72">
                                {trendData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                            <XAxis dataKey="date" stroke="#9ca3af" />
                                            <YAxis stroke="#9ca3af" tickFormatter={formatLargeNumber} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '8px'
                                                }}
                                                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                            <Area
                                                type="monotone"
                                                dataKey="cases"
                                                stroke="#ef4444"
                                                fill="url(#colorCases)"
                                                strokeWidth={2}
                                                name="New Cases"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="recoveries"
                                                stroke="#10b981"
                                                fill="url(#colorRecoveries)"
                                                strokeWidth={2}
                                                name="Recovered"
                                            />
                                            <defs>
                                                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorRecoveries" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#86efac" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No trend data available for selected filters.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 relative">
                            {isFetching && <LoadingOverlay />}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Alert Levels Distribution</h3>
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                            <div className="h-56 w-full flex justify-center items-center">
                                {alertData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={alertData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                                fill="#8884d8"
                                                labelLine={false}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {alertData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name, props) => [`${props.payload.count} Records`, name]} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No alert data available.
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {alertData.map((item, index) => (
                                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-gray-600">{item.name}:</span>
                                        <span className="text-xs font-semibold text-gray-900 ml-1">{item.value.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 relative">
                        {isFetching && <LoadingOverlay />}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Regional Distribution: {locationLabel}</h3>
                                <p className="text-sm text-gray-500 mt-1">Breakdown by Region ({diseaseLabel})</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Map className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="h-72">
                            {regionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" tickFormatter={formatLargeNumber} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Bar dataKey="cases" fill="#fca5a5" name="Cases" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="recovered" fill="#86efac" name="Recovered" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="active" fill="#fcd34d" name="Active" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No regional distribution data available for selected filters.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;