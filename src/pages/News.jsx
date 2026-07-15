import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Activity, Loader2, ExternalLink, Clock, User } from 'lucide-react'

const API_BASE_URL = 'https://newsapi.org/v2/everything'
const API_KEY = '46dde05bf13b4cf1afa5b54ca68e9c7d' 

const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="ml-3 text-lg font-medium text-gray-700">Loading News...</span>
    </div>
);

const NewsCard = ({ article }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 transition-all hover:shadow-md">
            <div className="flex flex-col h-full">
                {article.urlToImage && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                        <img 
                            src={article.urlToImage} 
                            alt={article.title} 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://picsum.photos/seed/news/400/200.jpg';
                            }}
                        />
                    </div>
                )}
                
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        {article.source && (
                            <div className="flex items-center mr-4">
                                <User className="h-3 w-3 mr-1" />
                                <span>{article.source.name}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                    </div>
                    
                    <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        <span className="text-sm font-medium mr-1">Read More</span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load News</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <button 
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
            Try Again
        </button>
    </div>
);

export default function DiseaseNews() {
    const [news, setNews] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        setIsFetching(true)
        setError(null)
        
        try {
            const response = await axios.get(API_BASE_URL, {
                params: {
                    q: 'disease OR outbreak OR pandemic OR epidemic OR virus OR infection OR health OR medical',
                    sortBy: 'publishedAt',
                    language: 'en',
                    pageSize: 12,
                    apiKey: API_KEY
                }
            })
            
            setNews(response.data.articles)
        } catch (error) {
            console.error('Error fetching news:', error)
            setError(error.response?.data?.message || 'Failed to fetch news. Please try again later.')
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Disease News Hub</h1>
                    <p className="text-gray-600">
                        Stay informed with the latest updates on global health and disease outbreaks
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 relative overflow-hidden shadow-sm">
                    {isFetching && <LoadingOverlay />}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Latest Disease News</h3>
                            <p className="text-sm text-gray-500 mt-1">Real-time updates from trusted sources</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    
                    {error ? (
                        <ErrorMessage message={error} onRetry={fetchNews} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.length > 0 ? (
                                news.map((article, index) => (
                                    <NewsCard key={index} article={article} />
                                ))
                            ) : (
                                !isFetching && (
                                    <div className="col-span-full text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No News Available</h3>
                                        <p className="text-sm text-gray-500">
                                            Please check back later for the latest disease news updates.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}