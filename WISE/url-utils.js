(function exposeUrlUtils(root, factory) {
    const api = factory();

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.WiseUrl = api;
    }
}(typeof window !== 'undefined' ? window : globalThis, function createUrlUtils() {
    const MAX_URL_LENGTH = 2048;

    function normalizeDeviceUrl(value) {
        const trimmed = String(value || '').trim();
        if (!trimmed) return '';

        return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    }

    function isPrivateIpv4(hostname) {
        const parts = hostname.split('.');
        if (parts.length !== 4) return false;

        const octets = parts.map(Number);
        if (octets.some((part, index) => (
            !/^\d{1,3}$/.test(parts[index]) || part < 0 || part > 255
        ))) {
            return false;
        }

        return octets[0] === 10
            || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
            || (octets[0] === 192 && octets[1] === 168)
            || (octets[0] === 127)
            || (octets[0] === 169 && octets[1] === 254);
    }

    function isLocalHostname(hostname) {
        const normalized = hostname.toLowerCase();
        return normalized === 'localhost'
            || normalized === '[::1]'
            || normalized.endsWith('.local')
            || isPrivateIpv4(normalized);
    }

    function validateDeviceUrl(value) {
        const normalized = normalizeDeviceUrl(value);

        if (!normalized) {
            return { valid: false, reason: 'Enter a device URL.' };
        }

        if (normalized.length > MAX_URL_LENGTH) {
            return { valid: false, reason: 'The device URL is too long.' };
        }

        try {
            const url = new URL(normalized);

            if (!['http:', 'https:'].includes(url.protocol)) {
                return { valid: false, reason: 'Use an HTTP or HTTPS device URL.' };
            }

            if (url.username || url.password) {
                return { valid: false, reason: 'Credentials are not allowed in the device URL.' };
            }

            if (!isLocalHostname(url.hostname)) {
                return {
                    valid: false,
                    reason: 'Use a private IP address, localhost, or a .local device name.'
                };
            }

            return { valid: true, url: url.toString() };
        } catch (error) {
            return { valid: false, reason: 'Enter a valid device URL.' };
        }
    }

    return {
        isPrivateIpv4,
        isLocalHostname,
        normalizeDeviceUrl,
        validateDeviceUrl
    };
}));
