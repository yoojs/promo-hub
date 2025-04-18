import zlib  from 'zlib';
interface InviteData {
  eventId: string;
  promoterId: string;
}

export function encodeInviteData(data: InviteData): string {
  const jsonString = JSON.stringify(data);
  const compressed = zlib.deflateSync(jsonString).toString('base64');
  // Make base64 URL-safe by replacing characters
  return compressed.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeInviteData(encoded: string): InviteData | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = Buffer.from(base64, 'base64')
    const decompressedString = zlib.inflateSync(decoded).toString('utf8');
    const data = JSON.parse(decompressedString) as InviteData;
    
    if (!data.eventId || !data.promoterId) return null;
    return data;
  } catch {
    return null;
  }
}