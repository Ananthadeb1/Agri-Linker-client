export const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (typeof image === 'string') {
        if (image.startsWith('data:')) return image;
        let cleanImage = image.replace(/^http:\/\/https:\/\//g, 'https://').replace(/^https:\/\/http:\/\//g, 'https://');
        if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
            return cleanImage;
        }
        const baseUrl = (import.meta.env.VITE_API_URL || 'https://agri-linker-server.onrender.com').replace(/\/+$/, '');
        const path = cleanImage.startsWith('/') ? cleanImage : `/${cleanImage}`;
        return `${baseUrl}${path}`;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
};

export default getImageUrl;
