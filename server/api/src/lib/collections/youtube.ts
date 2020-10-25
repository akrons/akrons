import { BadRequestError } from '@akrons/service-utils';
import { File } from './file';
import { join } from 'path';
import * as https from 'https';
import * as fs from 'fs';

export class Youtube {
    private static instance: Youtube | undefined;
    public static getInstance(): Youtube {
        if (!this.instance) {
            this.instance = new Youtube();
        }
        return this.instance;
    }
    private constructor() { }

    async addVideo(videoId?: string) {
        if (!videoId) {
            throw new BadRequestError();
        }
        await this.loadThumbnail(videoId);
    }

    private async loadThumbnail(videoId: string) {
        // create unique filename
        const fileId = 'yt-' + videoId + (new Date()).getTime();
        const fileApi = File.getInstance();
        let fileDestination = join(fileApi.fileStorageDirectory, fileId);
        let youtubeThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        await new Promise((resolve, reject) => {
            let file = fs.createWriteStream(fileDestination);
            https.get(youtubeThumbnailUrl, (response) => {
                response.on('error', (err) => {
                    reject(err);
                });
                response.pipe(file);
                file.on('finish', function () {
                    file.close();
                    resolve();
                });
            });
        });
        const fileName = 'youtube/thumbnails/' + videoId;
        if (await fileApi.exists(fileName)) {
            await fileApi.deleteByName(fileName);
        }
        await fileApi.create(fileId, fileName, 'image/jpeg');
    }
}

