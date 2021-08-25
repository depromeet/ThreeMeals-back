import { Readable } from 'stream';
import { ProfileUrl } from './Account';

export interface ProfileImageData {
    filename: string;
    mimetype: string;
    encoding: string;
    body: Buffer|Uint8Array|string|Readable;
}

export abstract class ProfileImageUploader {
    abstract uploadProfileImage(data: ProfileImageData): Promise<ProfileUrl>
}
