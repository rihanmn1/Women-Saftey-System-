const assert = require('node:assert/strict');
const test = require('node:test');

const {
    isPrivateIpv4,
    normalizeDeviceUrl,
    validateDeviceUrl
} = require('../WISE/url-utils.js');

test('recognizes private and local IPv4 ranges', () => {
    assert.equal(isPrivateIpv4('10.0.0.1'), true);
    assert.equal(isPrivateIpv4('172.16.0.1'), true);
    assert.equal(isPrivateIpv4('172.31.255.255'), true);
    assert.equal(isPrivateIpv4('192.168.4.1'), true);
    assert.equal(isPrivateIpv4('8.8.8.8'), false);
    assert.equal(isPrivateIpv4('172.32.0.1'), false);
    assert.equal(isPrivateIpv4('999.1.1.1'), false);
});

test('adds HTTP to device addresses without a protocol', () => {
    assert.equal(normalizeDeviceUrl('192.168.4.1/set?value=123'), 'http://192.168.4.1/set?value=123');
});

test('accepts local device URLs', () => {
    assert.equal(validateDeviceUrl('192.168.4.1/set?value=123').valid, true);
    assert.equal(validateDeviceUrl('http://wise-device.local/set?value=123').valid, true);
    assert.equal(validateDeviceUrl('http://localhost:8080/set?value=123').valid, true);
});

test('rejects public, credentialed, and malformed URLs', () => {
    assert.equal(validateDeviceUrl('https://example.com/set?value=123').valid, false);
    assert.equal(validateDeviceUrl('http://user:pass@192.168.4.1').valid, false);
    assert.equal(validateDeviceUrl('not a url').valid, false);
    assert.equal(validateDeviceUrl('').valid, false);
});
