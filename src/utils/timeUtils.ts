/**
 * Time utility functions for consistent formatting across the attendance module
 */

export const formatDateTime = (dateString: string | Date, options?: {
    includeSeconds?: boolean;
    includeDate?: boolean;
    format?: 'short' | 'medium' | 'long';
}): string => {
    if (!dateString) return 'Not available';
    
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const defaultOptions = {
        includeSeconds: false,
        includeDate: true,
        format: 'medium' as const
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        if (config.format === 'short') {
            // Short format: "2:30 PM" or "Jan 15, 2:30 PM"
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            
            if (config.includeSeconds) {
                timeOptions.second = '2-digit';
            }
            
            if (config.includeDate && !isToday) {
                timeOptions.month = 'short';
                timeOptions.day = 'numeric';
            }
            
            return date.toLocaleString('en-US', timeOptions);
        }
        
        if (config.format === 'long') {
            // Long format: "Friday, January 15, 2025 at 2:30:45 PM"
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            
            if (config.includeSeconds) {
                options.second = '2-digit';
            }
            
            return date.toLocaleString('en-US', options);
        }
        
        // Medium format (default): "Jan 15, 2025, 2:30 PM"
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        if (config.includeSeconds) {
            options.second = '2-digit';
        }
        
        if (!config.includeDate || isToday) {
            // Show only time if it's today and date not explicitly requested
            return date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: config.includeSeconds ? '2-digit' : undefined,
                hour12: true
            });
        }
        
        return date.toLocaleString('en-US', options);
        
    } catch (error) {
        console.error('Error formatting date:', error);
        return date.toString();
    }
};

export const getTimeAgo = (dateString: string | Date): string => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    // For longer periods, show the actual date
    return formatDateTime(date, { format: 'medium' });
};

export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};

export const formatSessionDuration = (startTime: string, endTime?: string): string => {
    if (!startTime) return 'Unknown duration';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    const diffInMilliseconds = end.getTime() - start.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
    }
    
    const remainingMinutes = diffInMinutes % 60;
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
};

export const isRecentTime = (dateString: string | Date, thresholdMinutes: number = 5): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    return diffInMinutes <= thresholdMinutes;
};